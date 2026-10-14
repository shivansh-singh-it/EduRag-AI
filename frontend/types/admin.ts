/**
 * TypeScript Type Definitions for EduRAG AI Admin & Institutional Analytics
 * Grounded in OULAD schemas and standard API contracts.
 */

export interface AdminStats {
  total_students: number;
  total_modules: number;
  total_assessments: number;
  total_interactions: number;
  avg_score: number;
  completion_rate: number;
  total_vle_interactions?: number;
  total_courses?: number;
  data_source?: string;
  dataset_connected?: boolean;
}

export interface PerformanceBand {
  range: string;
  count: number;
  color?: string;
}

export interface ModuleAnalyticsItem {
  code_module: string;
  code?: string;
  total_students: number;
  pass_count: number;
  distinction_count: number;
  fail_count: number;
  withdrawn_count: number;
  pass_rate: number;
  pass_rate_percentage: number;
  avg_clicks?: number;
}

export interface DemographicItem {
  category: string;
  count: number;
}

export interface DemographicDistributions {
  gender: DemographicItem[];
  highest_education: DemographicItem[];
  age_band: DemographicItem[];
  region: DemographicItem[];
  disability: DemographicItem[];
  final_result: DemographicItem[];
  ethics_disclaimer?: string;
}

export interface DatasetFileInfo {
  filename: string;
  exists: boolean;
  rows: number;
  columns: number;
  missing_values: number;
  status: string;
}

export interface DatasetSummary {
  dataset: string;
  status: "connected" | "unavailable";
  is_connected: boolean;
  source_type: "Live OULAD Analytics" | "Demo Data";
  data_directory: string;
  files_detected: DatasetFileInfo[];
  total_files: number;
  detected_files_count: number;
  errors?: string[];
  warnings?: string[];
}

export interface AdminAnalyticsResponse {
  stats: AdminStats;
  overview: AdminStats;
  performance_distribution: PerformanceBand[];
  module_performance: ModuleAnalyticsItem[];
  demographics: DemographicDistributions;
  dataset_summary: DatasetSummary;
}
