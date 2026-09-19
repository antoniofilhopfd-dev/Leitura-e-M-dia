import type { MediaInput, MediaItem, MediaStatus, MediaType } from "./mediaTypes";

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function listMedia(params: { type?: MediaType; status?: MediaStatus; search?: string } = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  const qs = query.toString();
  return request(`/api/media${qs ? `?${qs}` : ""}`) as Promise<MediaItem[]>;
}

export function getMedia(id: string) {
  return request(`/api/media/${id}`) as Promise<MediaItem>;
}

export function createMedia(input: MediaInput) {
  return request("/api/media", { method: "POST", body: JSON.stringify(input) }) as Promise<MediaItem>;
}

export function updateMedia(id: string, input: Partial<MediaInput>) {
  return request(`/api/media/${id}`, { method: "PATCH", body: JSON.stringify(input) }) as Promise<MediaItem>;
}

export function deleteMedia(id: string) {
  return request(`/api/media/${id}`, { method: "DELETE" }) as Promise<null>;
}
