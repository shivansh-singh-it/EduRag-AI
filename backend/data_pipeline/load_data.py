"""
OULAD Data Loader and Schema Validator
Loads and verifies the 7 canonical OULAD CSV files:
- courses.csv
- assessments.csv
- studentInfo.csv
- studentRegistration.csv
- studentAssessment.csv
- vle.csv
- studentVle.csv
"""

import os
import csv
import logging
from typing import Dict, List, Any, Tuple
from backend.config.settings import settings

logger = logging.getLogger(__name__)

EXPECTED_SCHEMAS = {
    "courses.csv": ["code_module", "code_presentation", "module_presentation_length"],
    "assessments.csv": ["code_module", "code_presentation", "id_assessment", "assessment_type", "date", "weight"],
    "studentInfo.csv": ["code_module", "code_presentation", "id_student", "gender", "region", "highest_education", "imd_band", "age_band", "num_of_prev_attempts", "studied_credits", "disability", "final_result"],
    "studentRegistration.csv": ["code_module", "code_presentation", "id_student", "date_registration", "date_unregistration"],
    "studentAssessment.csv": ["id_assessment", "id_student", "date_submitted", "is_banked", "score"],
    "vle.csv": ["id_site", "code_module", "code_presentation", "activity_type", "week_from", "week_to"],
    "studentVle.csv": ["code_module", "code_presentation", "id_student", "id_site", "date", "sum_click"]
}

class OULADLoader:
    def __init__(self, data_dir: str = None):
        self.data_dir = data_dir or settings.OULAD_DIR
        
    def validate_dataset(self) -> Dict[str, Any]:
        """Validates existence and schema conformity of all OULAD CSV files."""
        status = {
            "is_valid": True,
            "data_directory": self.data_dir,
            "files": {},
            "errors": [],
            "warnings": []
        }
        
        if not os.path.exists(self.data_dir):
            status["is_valid"] = False
            status["errors"].append(f"OULAD data directory not found at: {self.data_dir}")
            return status
            
        for filename, expected_cols in EXPECTED_SCHEMAS.items():
            file_path = os.path.join(self.data_dir, filename)
            file_info = {
                "exists": os.path.exists(file_path),
                "path": file_path,
                "rows_count": 0,
                "columns_count": 0,
                "missing_values": 0,
                "status": "Missing",
                "missing_columns": [],
                "actual_columns": []
            }
            
            if not file_info["exists"]:
                status["is_valid"] = False
                file_info["status"] = "Missing"
                status["errors"].append(f"Missing required OULAD file: {filename}. Please place it in {self.data_dir}/")
            else:
                try:
                    with open(file_path, "r", encoding="utf-8-sig") as f:
                        reader = csv.reader(f)
                        header = next(reader, None)
                        if header:
                            file_info["actual_columns"] = header
                            file_info["columns_count"] = len(header)
                            missing = [col for col in expected_cols if col not in header]
                            file_info["missing_columns"] = missing
                            if missing:
                                status["is_valid"] = False
                                file_info["status"] = "Invalid Schema"
                                status["errors"].append(f"File {filename} is missing required columns: {missing}")
                            
                            rows_count = 0
                            missing_values_count = 0
                            for row in reader:
                                rows_count += 1
                                for cell in row:
                                    if cell is None or cell.strip() == "" or cell.strip() == "?":
                                        missing_values_count += 1
                            
                            file_info["rows_count"] = rows_count
                            file_info["missing_values"] = missing_values_count
                            if file_info["status"] != "Invalid Schema":
                                file_info["status"] = "Connected" if rows_count > 0 else "Empty"
                        else:
                            file_info["status"] = "Empty"
                except Exception as e:
                    status["is_valid"] = False
                    file_info["status"] = "Error"
                    status["errors"].append(f"Error reading {filename}: {str(e)}")
                    
            status["files"][filename] = file_info
            
        return status

    def get_dataset_summary(self) -> Dict[str, Any]:
        """Provides high-level dataset health, detected files, row counts, missing values, and status."""
        val = self.validate_dataset()
        files_detected = []
        for filename in EXPECTED_SCHEMAS.keys():
            info = val["files"].get(filename, {})
            files_detected.append({
                "filename": filename,
                "exists": bool(info.get("exists", False)),
                "rows": int(info.get("rows_count", 0)),
                "columns": int(info.get("columns_count", len(info.get("actual_columns", [])))),
                "missing_values": int(info.get("missing_values", 0)),
                "status": str(info.get("status", "Missing" if not info.get("exists") else "Connected"))
            })
            
        detected_count = sum(1 for f in files_detected if f["exists"] and f["rows"] > 0)
        is_connected = val["is_valid"] and detected_count == len(EXPECTED_SCHEMAS)
        
        return {
            "dataset": "OULAD",
            "status": "connected" if is_connected else "unavailable",
            "is_connected": is_connected,
            "source_type": "Live OULAD Analytics" if is_connected else "Demo Data",
            "data_directory": self.data_dir,
            "files_detected": files_detected,
            "total_files": len(EXPECTED_SCHEMAS),
            "detected_files_count": detected_count,
            "errors": val.get("errors", []),
            "warnings": val.get("warnings", [])
        }

    def load_table(self, filename: str) -> List[Dict[str, Any]]:
        """Loads a single CSV file as a list of dicts with basic type coercion."""
        file_path = os.path.join(self.data_dir, filename)
        if not os.path.exists(file_path):
            logger.warning(f"File {filename} not found in {self.data_dir}")
            return []
            
        records = []
        with open(file_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cleaned_row = {}
                for k, v in row.items():
                    if v is None or v == "" or v == "?":
                        cleaned_row[k] = None
                    else:
                        cleaned_row[k] = v.strip() if isinstance(v, str) else v
                records.append(cleaned_row)
        return records

    def load_all(self) -> Dict[str, List[Dict[str, Any]]]:
        """Loads all 7 OULAD tables into memory."""
        return {
            "courses": self.load_table("courses.csv"),
            "assessments": self.load_table("assessments.csv"),
            "student_info": self.load_table("studentInfo.csv"),
            "student_registration": self.load_table("studentRegistration.csv"),
            "student_assessment": self.load_table("studentAssessment.csv"),
            "vle": self.load_table("vle.csv"),
            "student_vle": self.load_table("studentVle.csv")
        }

if __name__ == "__main__":
    loader = OULADLoader()
    res = loader.validate_dataset()
    print("OULAD Validation Status:", "PASSED" if res["is_valid"] else "FAILED")
    if not res["is_valid"]:
        print("Errors:", res["errors"])
    else:
        for f, details in res["files"].items():
            print(f" - {f}: {details['rows_count']} rows, columns: {len(details['actual_columns'])}")
