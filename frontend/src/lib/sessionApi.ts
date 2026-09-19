import { apiRequest } from "./apiClient";
import type { MediaItem, MediaType, ProgressUnit } from "./mediaTypes";

export type SessionRecord = {
  id: string;
  mediaId: string;
  date: string;
  startValue: number | null;
  endValue: number | null;
  quantity: number | null;
  createdAt: string;
  media: {
    id: string;
    title: string;
    type: MediaType;
    progress?: { unit: ProgressUnit } | null;
  };
};

export function listSessions() {
  return apiRequest("/api/sessions") as Promise<SessionRecord[]>;
}

export function createSession(input: { mediaId: string; quantity: number; date?: string }) {
  return apiRequest("/api/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  }) as Promise<{ session: SessionRecord; media: MediaItem }>;
}

export function deleteSession(id: string) {
  return apiRequest(`/api/sessions/${id}`, { method: "DELETE" }) as Promise<null>;
}
