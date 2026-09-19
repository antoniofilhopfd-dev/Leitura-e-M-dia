import { apiRequest } from "./apiClient";

export type HighlightRecord = {
  id: string;
  mediaId: string;
  page: number | null;
  text: string;
  createdAt: string;
  media: { id: string; title: string };
};

export function listHighlights(mediaId?: string) {
  const qs = mediaId ? `?mediaId=${mediaId}` : "";
  return apiRequest(`/api/highlights${qs}`) as Promise<HighlightRecord[]>;
}

export function createHighlight(input: { mediaId: string; text: string; page?: number | null }) {
  return apiRequest("/api/highlights", {
    method: "POST",
    body: JSON.stringify(input),
  }) as Promise<HighlightRecord>;
}

export function deleteHighlight(id: string) {
  return apiRequest(`/api/highlights/${id}`, { method: "DELETE" }) as Promise<null>;
}
