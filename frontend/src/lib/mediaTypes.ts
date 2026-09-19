export type MediaType = "movie" | "series" | "soap_opera" | "book" | "audiobook";

export type MediaStatus = "want" | "in_progress" | "completed" | "paused" | "abandoned";

export type ProgressUnit = "page" | "episode" | "chapter" | "second" | "part";

export type MediaMetadata = {
  author?: string | null;
  year?: number | null;
  platform?: string | null;
  seasonCurrent?: number | null;
  seasonTotalEpisodes?: number | null;
  seriesTotalEpisodes?: number | null;
  chapterTotal?: number | null;
  durationSeconds?: number | null;
};

export type Progress = {
  currentValue: number;
  totalValue?: number | null;
  unit: ProgressUnit;
};

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  status: MediaStatus;
  coverUrl?: string | null;
  genre?: string | null;
  rating?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: MediaMetadata | null;
  progress?: Progress | null;
};

export type MediaInput = {
  type: MediaType;
  title: string;
  status?: MediaStatus;
  coverUrl?: string | null;
  genre?: string | null;
  rating?: number | null;
  notes?: string | null;
  metadata?: MediaMetadata;
  progress?: Progress;
};

// Vocabulário por tipo (seção 6 da especificação) — o banco usa o mesmo
// enum para todos, a UI traduz para o texto adequado a cada mídia.
export const STATUS_LABELS: Record<MediaType, Record<MediaStatus, string>> = {
  movie: {
    want: "Quero assistir",
    in_progress: "Assistindo",
    completed: "Concluído",
    paused: "Pausado",
    abandoned: "Abandonado",
  },
  series: {
    want: "Quero assistir",
    in_progress: "Assistindo",
    completed: "Concluído",
    paused: "Pausado",
    abandoned: "Abandonado",
  },
  soap_opera: {
    want: "Quero assistir",
    in_progress: "Assistindo",
    completed: "Concluído",
    paused: "Pausado",
    abandoned: "Abandonado",
  },
  book: {
    want: "Quero ler",
    in_progress: "Lendo",
    completed: "Concluído",
    paused: "Pausado",
    abandoned: "Abandonado",
  },
  audiobook: {
    want: "Quero ouvir",
    in_progress: "Ouvindo",
    completed: "Concluído",
    paused: "Pausado",
    abandoned: "Abandonado",
  },
};

export const STATUS_ORDER: MediaStatus[] = ["want", "in_progress", "completed", "paused", "abandoned"];

export function progressPercent(progress?: Progress | null): number {
  if (!progress || !progress.totalValue) return 0;
  return Math.min(100, Math.round((progress.currentValue / progress.totalValue) * 100));
}

export function progressLabel(item: MediaItem): string | null {
  const { type, progress, metadata } = item;
  if (!progress) return null;

  if (type === "movie") {
    return `${progressPercent(progress)}% assistido`;
  }
  if (type === "series") {
    const season = metadata?.seasonCurrent ?? 1;
    return progress.totalValue
      ? `T${season} · Ep. ${progress.currentValue} de ${progress.totalValue}`
      : `T${season} · Ep. ${progress.currentValue}`;
  }
  if (type === "soap_opera") {
    return progress.totalValue
      ? `Cap. ${progress.currentValue} de ${progress.totalValue}`
      : `Cap. ${progress.currentValue}`;
  }
  if (type === "book") {
    return progress.totalValue
      ? `Pág. ${progress.currentValue} de ${progress.totalValue}`
      : `Pág. ${progress.currentValue}`;
  }
  if (type === "audiobook") {
    const listened = Math.round(progress.currentValue / 60);
    const total = progress.totalValue ? Math.round(progress.totalValue / 60) : null;
    return total ? `${listened} min de ${total} min` : `${listened} min ouvidos`;
  }
  return null;
}
