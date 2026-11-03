// import axios, { AxiosInstance, AxiosResponse } from "axios";

// // ---------- Shared Types ----------
// interface HazardBase {
//   hazard_name: string;
// }

// // ---------- 1. Generate Suggestions ----------
// interface SuggestionsRequest {
//   hazards: string[];
// }

// interface SuggestionsResponse {
//   suggestions: string[];
// }

// // ---------- 2. Debrief Summary ----------
// interface DebriefItem {
//   question: string;
//   answers: string[];
// }

// interface SummaryRequest {
//   responses: DebriefItem[];
// }

// interface SummaryResponse {
//   summary: string;
// }

// // ---------- 3. Root Cause Clustering ----------
// interface RootCauseArea {
//   area_name: string;
//   descriptions: string[];
// }

// interface RootCauseHazardInput {
//   hazard_name: string;
//   areas: RootCauseArea[];
// }

// interface RootCauseRequest {
//   hazards: RootCauseHazardInput[];
// }

// interface RootCauseHazardOutput {
//   hazard_name: string;
//   key_insight: string;
//   root_cause: string;
//   affected_areas: string[];
//   recommendation: string;
//   summary: string;
// }

// interface RootCauseResponse {
//   hazards: RootCauseHazardOutput[];
// }

// // ---------- 4. Positive Trend Analysis ----------
// interface TrendHazard {
//   hazard_name: string;
//   previous_count: number;
//   current_count: number;
// }

// interface TrendRequest {
//   hazards: TrendHazard[];
// }

// interface PositiveTrend {
//   hazard_name: string;
//   change_percentage: number;
//   message: string;
// }

// interface TrendResponse {
//   positive_trends: PositiveTrend[];
// }

// // ---------- 5. What‑Changed Analysis (already defined) ----------
// interface HazardWithSeverity {
//   hazard_name: string;
//   high_count: number;
//   medium_count: number;
//   low_count: number;
// }

// interface AreaCount {
//   area_name: string;
//   count: number;
// }

// interface PeriodData {
//   hazards: HazardWithSeverity[];
//   areas: AreaCount[];
// }

// interface WhatChangedRequest {
//   previous_period: PeriodData;
//   current_period: PeriodData;
// }

// interface Change {
//   title: string;
//   message: string;
// }

// interface WhatChangedResponse {
//   changes: Change[];
// }

// // ---------- Service Class ----------
// class SafetyApiService {
//   private baseUrl: string;
//   private axiosInstance: AxiosInstance;

//   constructor() {
//     this.baseUrl = "https://safeai.dsrt321.online"; // or "http://10.10.26.226:8020"
//     this.axiosInstance = axios.create({
//       baseURL: this.baseUrl,
//       timeout: 30000,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }

//   // 1. Generate Suggestions
//   async getSuggestions(data: SuggestionsRequest): Promise<SuggestionsResponse> {
//     try {
//       const response: AxiosResponse<SuggestionsResponse> =
//         await this.axiosInstance.post("/suggest", data);
//       return response.data;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // 2. Debrief Summary
//   async getSummary(data: SummaryRequest): Promise<SummaryResponse> {
//     try {
//       const response: AxiosResponse<SummaryResponse> =
//         await this.axiosInstance.post("/summary", data);
//       return response.data;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // 3. Root Cause Clustering
//   async getRootCauses(data: RootCauseRequest): Promise<RootCauseResponse> {
//     try {
//       const response: AxiosResponse<RootCauseResponse> =
//         await this.axiosInstance.post("/root-cause", data);
//       return response.data;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // 4. Positive Trend Analysis
//   async getPositiveTrends(data: TrendRequest): Promise<TrendResponse> {
//     try {
//       const response: AxiosResponse<TrendResponse> =
//         await this.axiosInstance.post("/positive-trends", data);
//       return response.data;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // 5. What‑Changed Analysis
//   async getWhatChanged(data: WhatChangedRequest): Promise<WhatChangedResponse> {
//     try {
//       const response: AxiosResponse<WhatChangedResponse> =
//         await this.axiosInstance.post("/what-changed", data);
//       return response.data;
//     } catch (error) {
//       this.handleError(error);
//     }
//   }

//   // Centralized error handler
//   private handleError(error: unknown): never {
//     if (axios.isAxiosError(error)) {
//       throw new Error(`API Error: ${error.message}`);
//     }
//     throw error;
//   }
// }

// export default new SafetyApiService();
