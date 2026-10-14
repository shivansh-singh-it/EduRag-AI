/**
 * Centralized API client for EduRAG AI
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? (localStorage.getItem("edurag_token") || localStorage.getItem("learnwise_token")) : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Request failed");
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`API call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// Student APIs
export const getStudentDashboard = (studentId?: number) =>
  fetchApi(`/student/dashboard${studentId ? `?student_id=${studentId}` : ""}`);

export const getStudentProfile = (studentId?: number) =>
  fetchApi(`/student/profile${studentId ? `?student_id=${studentId}` : ""}`);

export const getModules = () => fetchApi("/student/modules");

export const getStudentAssessments = (studentId?: number, moduleCode?: string) => {
  const params = new URLSearchParams();
  if (studentId) params.append("student_id", studentId.toString());
  if (moduleCode) params.append("module_code", moduleCode);
  const qs = params.toString();
  return fetchApi(`/student/assessments${qs ? `?${qs}` : ""}`);
};

export const completeOnboarding = (data: any) =>
  fetchApi("/student/onboarding", { method: "POST", body: JSON.stringify(data) });

// AI Tutor & Chat APIs
export const sendChatMessage = (data: {
  message: string;
  module?: string;
  topic?: string;
  session_id?: string;
  proficiency_override?: string;
}) => fetchApi("/chat", { method: "POST", body: JSON.stringify(data) });

export const getAdaptiveDemo = (topic: string) =>
  fetchApi(`/chat/adaptive-demo?topic=${encodeURIComponent(topic)}`);

export const submitChatFeedback = (data: { message_id: string; rating: string; comment?: string }) =>
  fetchApi("/chat/feedback", { method: "POST", body: JSON.stringify(data) });

// Quiz APIs
export const generateQuiz = (data: { topic: string; difficulty?: string; num_questions?: number }) =>
  fetchApi("/quiz/generate", { method: "POST", body: JSON.stringify(data) });

export const submitQuiz = (data: { topic: string; difficulty: string; answers: Record<string, number> }) =>
  fetchApi("/quiz/submit", { method: "POST", body: JSON.stringify(data) });

// Learning Path & Gaps APIs
export const getLearningPath = () => fetchApi("/learning-path");
export const getKnowledgeGaps = () => fetchApi("/knowledge-gaps");
export const getRecommendations = () => fetchApi("/recommendations");

// Documents
export const getDocuments = () => fetchApi("/documents");

// Admin & Research APIs
export const getAdminStats = () => fetchApi("/admin/stats");
export const getAdminPerformance = () => fetchApi("/admin/performance");
export const getAdminEngagement = () => fetchApi("/admin/engagement");
export const getAdminModules = () => fetchApi("/admin/modules");
export const getAdminDemographics = () => fetchApi("/admin/demographics");
export const getAdminRisk = () => fetchApi("/admin/risk");
export const getAdminDatasetSummary = () => fetchApi("/admin/dataset-summary");
export const loadDataset = () => fetchApi("/admin/load-dataset", { method: "POST" });
export const getAdminAnalytics = () => fetchApi("/admin/analytics");
export const getDatasetOverview = () => fetchApi("/admin/dataset-overview");
export const exploreDataset = (tableName: string, moduleFilter?: string, resultFilter?: string) => {
  let url = `/admin/dataset-explorer?table_name=${tableName}`;
  if (moduleFilter) url += `&module_filter=${moduleFilter}`;
  if (resultFilter) url += `&result_filter=${resultFilter}`;
  return fetchApi(url);
};
export const getCohortRiskAnalytics = () => fetchApi("/admin/risk-analytics");
export const getEvaluationMetrics = () => fetchApi("/admin/evaluation");
export const getABComparison = () => fetchApi("/admin/ab-comparison");
export const getAblationStudy = () => fetchApi("/admin/ablation-study");
