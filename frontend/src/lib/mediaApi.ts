import { apiRequest } from "./apiClient";
import type { MediaInput, MediaItem, MediaStatus, MediaType } from "./mediaTypes";

export function listMedia(params: { type?: MediaType; status?: MediaStatus; search?: string } = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return apiRequest(`/api/media${qs ? `?${qs}` : ""}`) as Promise<MediaItem[]>;
}

export function getMedia(id: string) {
  return apiRequest(`/api/media/${id}`) as Promise<MediaItem>;
}

export function createMedia(input: MediaInput) {
  return apiRequest("/api/media", { method: "POST", body: JSON.stringify(input) }) as Promise<MediaItem>;
}

export function updateMedia(id: string, input: Partial<MediaInput>) {
  return apiRequest(`/api/media/${id}`, { method: "PATCH", body: JSON.stringify(input) }) as Promise<MediaItem>;
}

export function deleteMedia(id: string) {
  return apiRequest(`/api/media/${id}`, { method: "DELETE" }) as Promise<null>;
}
