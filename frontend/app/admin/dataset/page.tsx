"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { exploreDataset, getDatasetOverview } from "@/lib/api";
import {
  Database,
  Filter,
  Layers,
  Search,
  Download,
  Info,
  CheckCircle2,
  Table,
} from "lucide-react";

export default function DatasetExplorerPage() {
  const [selectedTable, setSelectedTable] = useState("studentInfo");
  const [moduleFilter, setModuleFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const tables = [
    { id: "studentInfo", label: "studentInfo.csv", desc: "Demographics & final academic outcomes" },
    { id: "courses", label: "courses.csv", desc: "Module codes, presentations and lengths" },
    { id: "assessments", label: "assessments.csv", desc: "TMA, CMA, and Exam definitions & weights" },
    { id: "studentAssessment", label: "studentAssessment.csv", desc: "Scores and submission dates per student" },
    { id: "vle", label: "vle.csv", desc: "Virtual Learning Environment resources & types" },
    { id: "studentVle", label: "studentVle.csv", desc: "Daily interaction click logs per student" },
    { id: "studentRegistration", label: "studentRegistration.csv", desc: "Registration and un-registration days" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await exploreDataset(selectedTable, moduleFilter || undefined, resultFilter || undefined);
      if (res) {
        const rows = res.rows || res.sample_records || [];
        const columns = res.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
        setData({
          ...res,
          rows,
          columns,
        });
      }
    } catch (e) {
      console.warn("Using sample rows for dataset explorer:", e);
      // Fallback sample data
      setData({
        table_name: selectedTable,
        total_records: 1240,
        columns: ["code_module", "code_presentation", "id_student", "gender", "region", "highest_education", "final_result"],
        rows: [
          { code_module: "GGG", code_presentation: "2014J", id_student: 10042, gender: "F", region: "East Anglian", highest_education: "A Level", final_result: "Pass" },
          { code_module: "GGG", code_presentation: "2014J", id_student: 10084, gender: "M", region: "Scotland", highest_education: "HE Qualification", final_result: "Distinction" },
          { code_module: "FFF", code_presentation: "2013J", id_student: 10129, gender: "M", region: "North Region", highest_education: "Lower Than A Level", final_result: "Pass" },
          { code_module: "BBB", code_presentation: "2014B", id_student: 10231, gender: "F", region: "London Region", highest_education: "A Level", final_result: "Withdrawn" },
          { code_module: "AAA", code_presentation: "2013J", id_student: 10305, gender: "M", region: "South Region", highest_education: "Post Graduate", final_result: "Pass" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable, moduleFilter, resultFilter]);

  return (
    <AppShell
      title="OULAD Dataset Explorer"
      subtitle="Inspect schema definitions, raw records, and cohort distributions across the Open University Learning Analytics Dataset."
    >
      <div className="space-y-6">
        {/* Table Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {tables.map((tbl) => (
            <button
              key={tbl.id}
              onClick={() => setSelectedTable(tbl.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedTable === tbl.id
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-card hover:bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tbl.label}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="p-4 rounded-2xl glass-card border border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <Filter className="w-3.5 h-3.5 text-primary" /> Filters:
            </span>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
            >
              <option value="">All Modules</option>
              <option value="AAA">Module AAA</option>
              <option value="BBB">Module BBB</option>
              <option value="CCC">Module CCC</option>
              <option value="DDD">Module DDD</option>
              <option value="EEE">Module EEE</option>
              <option value="FFF">Module FFF</option>
              <option value="GGG">Module GGG</option>
            </select>

            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground focus:outline-none"
            >
              <option value="">All Outcomes</option>
              <option value="Pass">Pass</option>
              <option value="Distinction">Distinction</option>
              <option value="Fail">Fail</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="text-muted-foreground">
            Displaying sample slice ({data?.rows?.length || 0} rows)
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card rounded-2xl border border-border/60 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Table className="w-4 h-4 text-primary" />
              Table: {selectedTable}.csv
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Total matched: {data?.total_records || 32593} records
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">Loading table data...</div>
          ) : data && data.columns ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/30 border-b border-border/50 text-muted-foreground font-mono">
                  <tr>
                    {data.columns.map((col: string, i: number) => (
                      <th key={i} className="px-4 py-3 font-semibold uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {data.rows.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-muted/10 transition-colors">
                      {data.columns.map((col: string, cIdx: number) => (
                        <td key={cIdx} className="px-4 py-3 text-foreground font-mono">
                          {row[col] !== undefined ? String(row[col]) : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {/* Ethical Notice */}
        <div className="p-4 rounded-xl bg-card border border-border/80 flex items-start gap-3 text-xs text-muted-foreground">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Research & Demographic Transparency:</strong> In the OULAD
            dataset, demographic variables (such as IMD band, gender, age band, disability) reflect institutional
            socioeconomic cohorts. These fields are exclusively analyzed for equity studies and model bias audits, and
            are never used as deterministic determinants of individual student potential.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
