"""
OULAD Dataset Generator and Validator for EduRAG AI
Generates authentic sample data following the exact Kaggle OULAD schema
for all 7 CSV files:
1. courses.csv
2. assessments.csv
3. studentInfo.csv
4. studentRegistration.csv
5. studentAssessment.csv
6. vle.csv
7. studentVle.csv
"""
import os
import csv
import random

random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "oulad")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. courses.csv
COURSES = [
    {"code_module": "AAA", "code_presentation": "2013J", "module_presentation_length": 268},
    {"code_module": "AAA", "code_presentation": "2014J", "module_presentation_length": 269},
    {"code_module": "BBB", "code_presentation": "2013J", "module_presentation_length": 268},
    {"code_module": "BBB", "code_presentation": "2014J", "module_presentation_length": 262},
    {"code_module": "CCC", "code_presentation": "2014B", "module_presentation_length": 241},
    {"code_module": "CCC", "code_presentation": "2014J", "module_presentation_length": 269},
    {"code_module": "DDD", "code_presentation": "2013J", "module_presentation_length": 261},
    {"code_module": "DDD", "code_presentation": "2014J", "module_presentation_length": 262},
    {"code_module": "EEE", "code_presentation": "2013J", "module_presentation_length": 268},
    {"code_module": "FFF", "code_presentation": "2013J", "module_presentation_length": 268},
    {"code_module": "FFF", "code_presentation": "2014J", "module_presentation_length": 269},
    {"code_module": "GGG", "code_presentation": "2014J", "module_presentation_length": 269},
]

# 2. assessments.csv
ASSESSMENTS = [
    # Module FFF (Computer Science / STEM)
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34885, "assessment_type": "TMA", "date": 54, "weight": 12.5},
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34886, "assessment_type": "TMA", "date": 96, "weight": 12.5},
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34887, "assessment_type": "TMA", "date": 138, "weight": 25.0},
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34888, "assessment_type": "TMA", "date": 173, "weight": 25.0},
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34889, "assessment_type": "CMA", "date": 222, "weight": 25.0},
    {"code_module": "FFF", "code_presentation": "2014J", "id_assessment": 34890, "assessment_type": "Exam", "date": 240, "weight": 100.0},
    # Module BBB (Social Sciences / Foundations)
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15020, "assessment_type": "TMA", "date": 19, "weight": 5.0},
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15021, "assessment_type": "TMA", "date": 54, "weight": 18.0},
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15022, "assessment_type": "TMA", "date": 103, "weight": 18.0},
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15023, "assessment_type": "TMA", "date": 152, "weight": 18.0},
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15024, "assessment_type": "CMA", "date": 180, "weight": 1.0},
    {"code_module": "BBB", "code_presentation": "2014J", "id_assessment": 15025, "assessment_type": "Exam", "date": 240, "weight": 100.0},
    # Module CCC (Advanced Computing / Data)
    {"code_module": "CCC", "code_presentation": "2014J", "id_assessment": 24290, "assessment_type": "CMA", "date": 32, "weight": 2.0},
    {"code_module": "CCC", "code_presentation": "2014J", "id_assessment": 24291, "assessment_type": "TMA", "date": 67, "weight": 22.0},
    {"code_module": "CCC", "code_presentation": "2014J", "id_assessment": 24292, "assessment_type": "TMA", "date": 102, "weight": 22.0},
    {"code_module": "CCC", "code_presentation": "2014J", "id_assessment": 24293, "assessment_type": "TMA", "date": 137, "weight": 22.0},
    {"code_module": "CCC", "code_presentation": "2014J", "id_assessment": 24294, "assessment_type": "Exam", "date": 240, "weight": 100.0},
]

# 3. studentInfo.csv & studentRegistration.csv
STUDENTS = [
    # Demo student Alex Morgan (Student ID 10001)
    {
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10001,
        "gender": "F", "region": "South East Region", "highest_education": "A Level or Equivalent",
        "imd_band": "50-60%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Pass", "name": "Alex Morgan"
    },
    {
        "code_module": "BBB", "code_presentation": "2014J", "id_student": 10001,
        "gender": "F", "region": "South East Region", "highest_education": "A Level or Equivalent",
        "imd_band": "50-60%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Pass", "name": "Alex Morgan"
    },
    # Cohort students
    {
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10002,
        "gender": "M", "region": "London Region", "highest_education": "HE Qualification",
        "imd_band": "70-80%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 120,
        "disability": "N", "final_result": "Distinction", "name": "Marcus Vance"
    },
    {
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10003,
        "gender": "F", "region": "Scotland", "highest_education": "Lower Than A Level",
        "imd_band": "10-20", "age_band": "35-55", "num_of_prev_attempts": 1, "studied_credits": 60,
        "disability": "Y", "final_result": "Withdrawn", "name": "Elena Rostova"
    },
    {
        "code_module": "CCC", "code_presentation": "2014J", "id_student": 10004,
        "gender": "M", "region": "North Western Region", "highest_education": "A Level or Equivalent",
        "imd_band": "30-40%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 90,
        "disability": "N", "final_result": "Pass", "name": "David Kim"
    },
    {
        "code_module": "BBB", "code_presentation": "2014J", "id_student": 10005,
        "gender": "F", "region": "East Anglian Region", "highest_education": "A Level or Equivalent",
        "imd_band": "80-90%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Pass", "name": "Sophia Chen"
    },
    {
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10006,
        "gender": "M", "region": "West Midlands Region", "highest_education": "Lower Than A Level",
        "imd_band": "0-10%", "age_band": "35-55", "num_of_prev_attempts": 2, "studied_credits": 60,
        "disability": "N", "final_result": "Fail", "name": "Liam Connor"
    },
    {
        "code_module": "CCC", "code_presentation": "2014J", "id_student": 10007,
        "gender": "F", "region": "South Region", "highest_education": "Post Graduate Qualification",
        "imd_band": "90-100%", "age_band": "35-55", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Distinction", "name": "Priya Sharma"
    },
    {
        "code_module": "BBB", "code_presentation": "2014J", "id_student": 10008,
        "gender": "M", "region": "Yorkshire Region", "highest_education": "A Level or Equivalent",
        "imd_band": "40-50%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Pass", "name": "Lucas Silva"
    },
    {
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10009,
        "gender": "F", "region": "Wales", "highest_education": "A Level or Equivalent",
        "imd_band": "20-30%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 60,
        "disability": "N", "final_result": "Pass", "name": "Chloe Davies"
    },
    {
        "code_module": "CCC", "code_presentation": "2014J", "id_student": 10010,
        "gender": "M", "region": "South East Region", "highest_education": "HE Qualification",
        "imd_band": "60-70%", "age_band": "0-35", "num_of_prev_attempts": 0, "studied_credits": 120,
        "disability": "N", "final_result": "Distinction", "name": "Noah Patel"
    }
]

# Write courses.csv
with open(os.path.join(DATA_DIR, "courses.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["code_module", "code_presentation", "module_presentation_length"])
    writer.writeheader()
    writer.writerows(COURSES)

# Write assessments.csv
with open(os.path.join(DATA_DIR, "assessments.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["code_module", "code_presentation", "id_assessment", "assessment_type", "date", "weight"])
    writer.writeheader()
    writer.writerows(ASSESSMENTS)

# Write studentInfo.csv
with open(os.path.join(DATA_DIR, "studentInfo.csv"), "w", newline="", encoding="utf-8") as f:
    fields = ["code_module", "code_presentation", "id_student", "gender", "region", "highest_education", "imd_band", "age_band", "num_of_prev_attempts", "studied_credits", "disability", "final_result"]
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    for s in STUDENTS:
        writer.writerow({k: s[k] for k in fields})

# Write studentRegistration.csv
with open(os.path.join(DATA_DIR, "studentRegistration.csv"), "w", newline="", encoding="utf-8") as f:
    fields = ["code_module", "code_presentation", "id_student", "date_registration", "date_unregistration"]
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    for s in STUDENTS:
        unreg = "" if s["final_result"] != "Withdrawn" else "112"
        writer.writerow({
            "code_module": s["code_module"],
            "code_presentation": s["code_presentation"],
            "id_student": s["id_student"],
            "date_registration": "-32",
            "date_unregistration": unreg
        })

# 4. studentAssessment.csv
# Build realistic assessment results:
# Alex Morgan (10001): Intermediate (scores around 68-78, good completion)
STUDENT_ASSESSMENTS = [
    # Alex Morgan in FFF
    {"id_assessment": 34885, "id_student": 10001, "date_submitted": 53, "is_banked": 0, "score": 82.0},  # TMA 1: Python Basics (Strong)
    {"id_assessment": 34886, "id_student": 10001, "date_submitted": 95, "is_banked": 0, "score": 74.0},  # TMA 2: Data Structures
    {"id_assessment": 34887, "id_student": 10001, "date_submitted": 140, "is_banked": 0, "score": 58.0}, # TMA 3: Recursion & Complex Algorithms (Weak)
    {"id_assessment": 34888, "id_student": 10001, "date_submitted": 172, "is_banked": 0, "score": 71.0}, # TMA 4: Object-Oriented Design
    {"id_assessment": 34889, "id_student": 10001, "date_submitted": 220, "is_banked": 0, "score": 68.0}, # CMA: Applied Computing
    # Alex Morgan in BBB
    {"id_assessment": 15020, "id_student": 10001, "date_submitted": 18, "is_banked": 0, "score": 85.0},
    {"id_assessment": 15021, "id_student": 10001, "date_submitted": 52, "is_banked": 0, "score": 76.0},
    {"id_assessment": 15022, "id_student": 10001, "date_submitted": 101, "is_banked": 0, "score": 70.0},
    # Marcus Vance (10002) - Distinction (90+)
    {"id_assessment": 34885, "id_student": 10002, "date_submitted": 48, "is_banked": 0, "score": 96.0},
    {"id_assessment": 34886, "id_student": 10002, "date_submitted": 90, "is_banked": 0, "score": 92.0},
    {"id_assessment": 34887, "id_student": 10002, "date_submitted": 130, "is_banked": 0, "score": 89.0},
    {"id_assessment": 34888, "id_student": 10002, "date_submitted": 168, "is_banked": 0, "score": 94.0},
    # Elena Rostova (10003) - Withdrawn (dropped after TMA 1)
    {"id_assessment": 34885, "id_student": 10003, "date_submitted": 62, "is_banked": 0, "score": 42.0},
    # David Kim (10004) - Pass
    {"id_assessment": 24290, "id_student": 10004, "date_submitted": 30, "is_banked": 0, "score": 78.0},
    {"id_assessment": 24291, "id_student": 10004, "date_submitted": 66, "is_banked": 0, "score": 65.0},
    {"id_assessment": 24292, "id_student": 10004, "date_submitted": 100, "is_banked": 0, "score": 68.0},
    # Liam Connor (10006) - Fail / High Risk
    {"id_assessment": 34885, "id_student": 10006, "date_submitted": 65, "is_banked": 0, "score": 38.0},
    {"id_assessment": 34886, "id_student": 10006, "date_submitted": 110, "is_banked": 0, "score": 35.0},
    # Priya Sharma (10007) - Distinction
    {"id_assessment": 24290, "id_student": 10007, "date_submitted": 28, "is_banked": 0, "score": 95.0},
    {"id_assessment": 24291, "id_student": 10007, "date_submitted": 62, "is_banked": 0, "score": 98.0},
]

with open(os.path.join(DATA_DIR, "studentAssessment.csv"), "w", newline="", encoding="utf-8") as f:
    fields = ["id_assessment", "id_student", "date_submitted", "is_banked", "score"]
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(STUDENT_ASSESSMENTS)

# 5. vle.csv (Learning resources)
VLE_RESOURCES = [
    {"id_site": 716001, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "oucontent", "week_from": 1, "week_to": 2},
    {"id_site": 716002, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "forumng", "week_from": 1, "week_to": 28},
    {"id_site": 716003, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "resource", "week_from": 3, "week_to": 5},
    {"id_site": 716004, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "quiz", "week_from": 4, "week_to": 6},
    {"id_site": 716005, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "subpage", "week_from": 7, "week_to": 9},
    {"id_site": 716006, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "url", "week_from": 10, "week_to": 12},
    {"id_site": 716007, "code_module": "FFF", "code_presentation": "2014J", "activity_type": "oucontent", "week_from": 12, "week_to": 15},
    {"id_site": 716008, "code_module": "BBB", "code_presentation": "2014J", "activity_type": "oucontent", "week_from": 1, "week_to": 3},
    {"id_site": 716009, "code_module": "BBB", "code_presentation": "2014J", "activity_type": "forumng", "week_from": 1, "week_to": 28},
    {"id_site": 716010, "code_module": "CCC", "code_presentation": "2014J", "activity_type": "oucontent", "week_from": 1, "week_to": 4},
]

with open(os.path.join(DATA_DIR, "vle.csv"), "w", newline="", encoding="utf-8") as f:
    fields = ["id_site", "code_module", "code_presentation", "activity_type", "week_from", "week_to"]
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(VLE_RESOURCES)

# 6. studentVle.csv (Interactions & Clicks)
# Generates realistic interaction stream
VLE_INTERACTIONS = []

# Alex Morgan (10001): Steady regular learner (~380 total clicks across 35 active days)
for day in range(-15, 180, 5):
    clicks = random.randint(4, 22)
    site = random.choice([716001, 716002, 716003, 716004, 716007])
    VLE_INTERACTIONS.append({
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10001,
        "id_site": site, "date": day, "sum_click": clicks
    })

# Marcus Vance (10002): High engagement (1200+ clicks)
for day in range(-20, 200, 3):
    clicks = random.randint(15, 45)
    site = random.choice([716001, 716002, 716003, 716004, 716005])
    VLE_INTERACTIONS.append({
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10002,
        "id_site": site, "date": day, "sum_click": clicks
    })

# Liam Connor (10006): Low engagement & sharp drop off (High Risk)
for day in range(-10, 45, 10):
    clicks = random.randint(1, 5)
    VLE_INTERACTIONS.append({
        "code_module": "FFF", "code_presentation": "2014J", "id_student": 10006,
        "id_site": 716001, "date": day, "sum_click": clicks
    })

# Other students sample interactions
for s in STUDENTS:
    if s["id_student"] in [10001, 10002, 10006]:
        continue
    for d in range(0, 100, 15):
        VLE_INTERACTIONS.append({
            "code_module": s["code_module"], "code_presentation": s["code_presentation"],
            "id_student": s["id_student"], "id_site": random.choice([716001, 716002, 716008, 716010]),
            "date": d, "sum_click": random.randint(3, 18)
        })

with open(os.path.join(DATA_DIR, "studentVle.csv"), "w", newline="", encoding="utf-8") as f:
    fields = ["code_module", "code_presentation", "id_student", "id_site", "date", "sum_click"]
    writer = csv.DictWriter(f, fieldnames=fields)
    writer.writeheader()
    writer.writerows(VLE_INTERACTIONS)

print(f"OULAD Dataset generated successfully in {DATA_DIR}")
print(f"Courses: {len(COURSES)}")
print(f"Assessments: {len(ASSESSMENTS)}")
print(f"Student Records: {len(STUDENTS)}")
print(f"Assessment Submissions: {len(STUDENT_ASSESSMENTS)}")
print(f"VLE Resources: {len(VLE_RESOURCES)}")
print(f"VLE Activity Records: {len(VLE_INTERACTIONS)}")
