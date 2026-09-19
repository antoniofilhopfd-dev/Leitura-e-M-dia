import { apiRequest } from "./apiClient";

export type Stats = {
  totalItems: number;
  inProgress: number;
  completed: number;
  wanted: number;
  totalByType: Record<string, number>;
  completedByType: Record<string, number>;
  pagesRead: number;
  sessionsCount: number;
};

export function fetchStats() {
  return apiRequest("/api/stats") as Promise<Stats>;
}
