import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TextField, SelectField, TextareaField, FieldRow, FieldWrapper } from "../ui/Field";
import { StarRating } from "../ui/StarRating";
import { CoverPicker } from "../ui/CoverPicker";
import { STATUS_LABELS, STATUS_ORDER } from "../../lib/mediaTypes";
import type { MediaInput, MediaItem, MediaType } from "../../lib/mediaTypes";
import { createMedia, updateMedia } from "../../lib/mediaApi";

type MediaFormModalProps = {
  type: MediaType;
  initial?: MediaItem;
  onClose: () => void;
  onSaved: (item: MediaItem) => void;
};

const TYPE_TITLES: Record<MediaType, string> = {
  movie: "filme",
  series: "série",
  soap_opera: "novela",
  book: "livro",
  audiobook: "audiolivro",
};

function minutesToSeconds(value: string) {
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes * 60) : null;
}

function secondsToMinutesString(seconds?: number | null) {
  if (!seconds) return "";
  return String(Math.round(seconds / 60));
}

export function MediaFormModal({ type, initial, onClose, onSaved }: MediaFormModalProps) {
  const isEdit = Boolean(initial);
  const metadata = initial?.metadata;
  const progress = initial?.progress;

  const [title, setTitle] = useState(initial?.title ?? "");
  const [status, setStatus] = useState(initial?.status ?? "want");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [genre, setGenre] = useState(initial?.genre ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [year, setYear] = useState(metadata?.year ? String(metadata.year) : "");
  const [platform, setPlatform] = useState(metadata?.platform ?? "");
  const [author, setAuthor] = useState(metadata?.author ?? "");

  // Filmes
  const [durationMinutes, setDurationMinutes] = useState(secondsToMinutesString(metadata?.durationSeconds));
  const [percent, setPercent] = useState(() => {
    if (type !== "movie" || !progress?.totalValue) return "";
    return String(Math.round((progress.currentValue / progress.totalValue) * 100));
  });

  // Séries
  const [seasonCurrent, setSeasonCurrent] = useState(metadata?.seasonCurrent ? String(metadata.seasonCurrent) : "1");
  const [episodeCurrent, setEpisodeCurrent] = useState(progress?.currentValue ? String(progress.currentValue) : "");
  const [seasonTotalEpisodes, setSeasonTotalEpisodes] = useState(
    metadata?.seasonTotalEpisodes ? String(metadata.seasonTotalEpisodes) : progress?.totalValue ? String(progress.totalValue) : "",
  );
  const [seriesTotalEpisodes, setSeriesTotalEpisodes] = useState(
    metadata?.seriesTotalEpisodes ? String(metadata.seriesTotalEpisodes) : "",
  );

  // Novelas
  const [chapterCurrent, setChapterCurrent] = useState(progress?.currentValue ? String(progress.currentValue) : "");
  const [chapterTotal, setChapterTotal] = useState(
    metadata?.chapterTotal ? String(metadata.chapterTotal) : progress?.totalValue ? String(progress.totalValue) : "",
  );

  // Livros
  const [pageCurrent, setPageCurrent] = useState(progress?.currentValue ? String(progress.currentValue) : "");
  const [pageTotal, setPageTotal] = useState(progress?.totalValue ? String(progress.totalValue) : "");

  // Audiolivros
  const [audioDurationMinutes, setAudioDurationMinutes] = useState(secondsToMinutesString(metadata?.durationSeconds));
  const [audioListenedMinutes, setAudioListenedMinutes] = useState(
    progress?.currentValue ? String(Math.round(progress.currentValue / 60)) : "",
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function buildInput(): MediaInput {
    const base: MediaInput = {
      type,
      title: title.trim(),
      status,
      coverUrl: coverUrl.trim() || null,
      genre: genre.trim() || null,
      rating: rating || null,
      notes: notes.trim() || null,
      metadata: {},
    };

    if (year) base.metadata!.year = Number(year);

    if (type === "movie") {
      const durationSeconds = minutesToSeconds(durationMinutes);
      base.metadata!.platform = platform.trim() || null;
      base.metadata!.durationSeconds = durationSeconds;
      const pct = Math.min(100, Math.max(0, Number(percent) || 0));
      base.progress = {
        unit: "second",
        totalValue: durationSeconds,
        currentValue: durationSeconds ? Math.round((pct / 100) * durationSeconds) : 0,
      };
    }

    if (type === "series") {
      base.metadata!.platform = platform.trim() || null;
      base.metadata!.seasonCurrent = seasonCurrent ? Number(seasonCurrent) : null;
      base.metadata!.seasonTotalEpisodes = seasonTotalEpisodes ? Number(seasonTotalEpisodes) : null;
      base.metadata!.seriesTotalEpisodes = seriesTotalEpisodes ? Number(seriesTotalEpisodes) : null;
      base.progress = {
        unit: "episode",
        currentValue: Number(episodeCurrent) || 0,
        totalValue: seasonTotalEpisodes ? Number(seasonTotalEpisodes) : null,
      };
    }

    if (type === "soap_opera") {
      base.metadata!.platform = platform.trim() || null;
      base.metadata!.chapterTotal = chapterTotal ? Number(chapterTotal) : null;
      base.progress = {
        unit: "chapter",
        currentValue: Number(chapterCurrent) || 0,
        totalValue: chapterTotal ? Number(chapterTotal) : null,
      };
    }

    if (type === "book") {
      base.metadata!.author = author.trim() || null;
      base.progress = {
        unit: "page",
        currentValue: Number(pageCurrent) || 0,
        totalValue: pageTotal ? Number(pageTotal) : null,
      };
    }

    if (type === "audiobook") {
      const durationSeconds = minutesToSeconds(audioDurationMinutes);
      base.metadata!.author = author.trim() || null;
      base.metadata!.durationSeconds = durationSeconds;
      base.progress = {
        unit: "second",
        currentValue: minutesToSeconds(audioListenedMinutes) ?? 0,
        totalValue: durationSeconds,
      };
    }

    return base;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("O título é obrigatório.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const input = buildInput();
      const saved = isEdit ? await updateMedia(initial!.id, input) : await createMedia(input);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  const remainingLabel = (() => {
    if (type === "movie" && durationMinutes && percent) {
      const remaining = Math.round(Number(durationMinutes) * (1 - Math.min(100, Number(percent)) / 100));
      return `Faltam aproximadamente ${remaining} min`;
    }
    if (type === "audiobook" && audioDurationMinutes && audioListenedMinutes) {
      const remaining = Math.max(0, Number(audioDurationMinutes) - Number(audioListenedMinutes));
      return `Faltam aproximadamente ${remaining} min`;
    }
    return null;
  })();

  return (
    <Modal title={isEdit ? `Editar ${TYPE_TITLES[type]}` : `Adicionar ${TYPE_TITLES[type]}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
            {error}
          </div>
        )}

        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />

        <FieldRow>
          <SelectField label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[type][s]}
              </option>
            ))}
          </SelectField>
          <TextField label="Ano" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </FieldRow>

        <CoverPicker value={coverUrl} onChange={setCoverUrl} />

        {(type === "movie" || type === "series" || type === "soap_opera") && (
          <FieldRow>
            <TextField label="Gênero" value={genre} onChange={(e) => setGenre(e.target.value)} />
            <TextField label="Plataforma" value={platform} onChange={(e) => setPlatform(e.target.value)} />
          </FieldRow>
        )}

        {(type === "book" || type === "audiobook") && (
          <FieldRow>
            <TextField label="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <TextField label="Gênero" value={genre} onChange={(e) => setGenre(e.target.value)} />
          </FieldRow>
        )}

        {type === "movie" && (
          <FieldRow>
            <TextField label="Duração total (min)" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
            <TextField label="Progresso (%)" type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} hint={remainingLabel ?? undefined} />
          </FieldRow>
        )}

        {type === "series" && (
          <>
            <FieldRow>
              <TextField label="Temporada atual" type="number" value={seasonCurrent} onChange={(e) => setSeasonCurrent(e.target.value)} />
              <TextField label="Episódio atual" type="number" value={episodeCurrent} onChange={(e) => setEpisodeCurrent(e.target.value)} />
            </FieldRow>
            <FieldRow>
              <TextField label="Episódios da temporada" type="number" value={seasonTotalEpisodes} onChange={(e) => setSeasonTotalEpisodes(e.target.value)} />
              <TextField label="Episódios da série (total)" type="number" value={seriesTotalEpisodes} onChange={(e) => setSeriesTotalEpisodes(e.target.value)} />
            </FieldRow>
          </>
        )}

        {type === "soap_opera" && (
          <FieldRow>
            <TextField label="Capítulo atual" type="number" value={chapterCurrent} onChange={(e) => setChapterCurrent(e.target.value)} />
            <TextField label="Total de capítulos" type="number" value={chapterTotal} onChange={(e) => setChapterTotal(e.target.value)} />
          </FieldRow>
        )}

        {type === "book" && (
          <FieldRow>
            <TextField label="Página atual" type="number" value={pageCurrent} onChange={(e) => setPageCurrent(e.target.value)} />
            <TextField label="Total de páginas" type="number" value={pageTotal} onChange={(e) => setPageTotal(e.target.value)} />
          </FieldRow>
        )}

        {type === "audiobook" && (
          <FieldRow>
            <TextField label="Duração total (min)" type="number" value={audioDurationMinutes} onChange={(e) => setAudioDurationMinutes(e.target.value)} />
            <TextField label="Tempo ouvido (min)" type="number" value={audioListenedMinutes} onChange={(e) => setAudioListenedMinutes(e.target.value)} hint={remainingLabel ?? undefined} />
          </FieldRow>
        )}

        <FieldWrapper label="Avaliação">
          <StarRating value={rating} onChange={setRating} />
        </FieldWrapper>

        <TextareaField
          label={type === "movie" ? "Onde parei" : "Observações"}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
