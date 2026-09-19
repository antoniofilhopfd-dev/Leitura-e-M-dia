import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Section } from "../components/ui/Section";
import { StatGrid, StatTile } from "../components/ui/StatTile";
import { EmptyState } from "../components/ui/EmptyState";
import { MediaCard } from "../components/media/MediaCard";
import { MediaFormModal } from "../components/media/MediaFormModal";
import { SessionQuickAddModal } from "../components/media/SessionQuickAddModal";
import { HighlightQuickAddModal } from "../components/media/HighlightQuickAddModal";
import { deleteMedia, listMedia } from "../lib/mediaApi";
import { listSessions } from "../lib/sessionApi";
import type { SessionRecord } from "../lib/sessionApi";
import type { MediaItem, MediaType } from "../lib/mediaTypes";

const TYPE_LABELS: Record<MediaType, string> = {
  movie: "Filmes",
  series: "Séries",
  soap_opera: "Novelas",
  book: "Livros",
  audiobook: "Audiolivros",
};

const TYPE_ORDER: MediaType[] = ["movie", "series", "soap_opera", "book", "audiobook"];

function isToday(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function Hoje() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [sessionItem, setSessionItem] = useState<MediaItem | null>(null);
  const [highlightItem, setHighlightItem] = useState<MediaItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [mediaData, sessionData] = await Promise.all([listMedia(), listSessions()]);
      setItems(mediaData);
      setSessions(sessionData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Excluir este item? Essa ação não pode ser desfeita.")) return;
    await deleteMedia(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItemFromMedia(updated: MediaItem) {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }

  const emAndamento = items
    .filter((item) => item.status === "in_progress")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const recentes = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  const resumo = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    count: items.filter((item) => item.type === type).length,
  }));

  const sessionsToday = sessions.filter((session) => isToday(session.date));
  const pagesToday = sessionsToday
    .filter((s) => s.media.progress?.unit === "page")
    .reduce((sum, s) => sum + (s.quantity ?? 0), 0);
  const minutesToday = Math.round(
    sessionsToday.filter((s) => s.media.progress?.unit === "second").reduce((sum, s) => sum + (s.quantity ?? 0), 0) / 60,
  );
  const episodesChaptersToday = sessionsToday
    .filter((s) => s.media.progress?.unit === "episode" || s.media.progress?.unit === "chapter")
    .reduce((sum, s) => sum + (s.quantity ?? 0), 0);

  return (
    <>
      <PageHeader title="Hoje" subtitle="O que está em andamento e o que você fez hoje." />

      <Section title="Continuar">
        {!loading && emAndamento.length === 0 && (
          <EmptyState
            title="Nada em andamento"
            description="O que você estiver assistindo, lendo ou ouvindo aparece aqui."
          />
        )}
        {emAndamento.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {emAndamento.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={() => setEditing(item)}
                onDelete={() => handleDelete(item.id)}
                onLogSession={() => setSessionItem(item)}
                onAddHighlight={() => setHighlightItem(item)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Hoje">
        <StatGrid>
          <StatTile value={pagesToday} label="Páginas lidas" />
          <StatTile value={minutesToday} label="Minutos ouvidos" />
          <StatTile value={episodesChaptersToday} label="Episódios/capítulos" />
          <StatTile value={sessionsToday.length} label="Sessões" />
        </StatGrid>
      </Section>

      <Section title="Recentes">
        {!loading && recentes.length === 0 && (
          <EmptyState title="Nenhuma atualização recente" description="Os últimos conteúdos atualizados aparecem aqui." />
        )}
        {recentes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentes.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onEdit={() => setEditing(item)}
                onDelete={() => handleDelete(item.id)}
                onLogSession={() => setSessionItem(item)}
                onAddHighlight={() => setHighlightItem(item)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Resumo">
        <StatGrid>
          {resumo.map((stat) => (
            <StatTile key={stat.type} value={stat.count} label={stat.label} />
          ))}
        </StatGrid>
      </Section>

      {editing && (
        <MediaFormModal
          type={editing.type}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            updateItemFromMedia(saved);
            setEditing(null);
          }}
        />
      )}

      {sessionItem && (
        <SessionQuickAddModal
          item={sessionItem}
          onClose={() => setSessionItem(null)}
          onSaved={(updated) => {
            updateItemFromMedia(updated);
            setSessionItem(null);
            listSessions().then(setSessions);
          }}
        />
      )}

      {highlightItem && (
        <HighlightQuickAddModal item={highlightItem} onClose={() => setHighlightItem(null)} onSaved={() => setHighlightItem(null)} />
      )}
    </>
  );
}
