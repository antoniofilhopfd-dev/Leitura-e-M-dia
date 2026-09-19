import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { EmptyState } from "../components/ui/EmptyState";
import { MediaCard } from "../components/media/MediaCard";
import { MediaFormModal } from "../components/media/MediaFormModal";
import { deleteMedia, listMedia } from "../lib/mediaApi";
import type { MediaItem, MediaType } from "../lib/mediaTypes";

const STATUS_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "in_progress", label: "Em andamento" },
  { key: "want", label: "Quero" },
  { key: "completed", label: "Concluídos" },
];

type MediaListPageProps = {
  type: MediaType;
  title: string;
  subtitle: string;
  addLabel: string;
  emptyDescription: string;
};

export function MediaListPage({ type, title, subtitle, addLabel, emptyDescription }: MediaListPageProps) {
  const [status, setStatus] = useState("todos");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<MediaItem | "new" | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listMedia({ type, status: status === "todos" ? undefined : (status as MediaItem["status"]) });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status]);

  async function handleDelete(id: string) {
    if (!window.confirm("Excluir este item? Essa ação não pode ser desfeita.")) return;
    await deleteMedia(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<Button variant="primary" onClick={() => setModalItem("new")}>{addLabel}</Button>}
      />
      <SegmentedControl options={STATUS_FILTERS} value={status} onChange={setStatus} />

      {error && (
        <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState title="Nada por aqui ainda" description={emptyDescription} />
      )}

      {items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={() => setModalItem(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {modalItem && (
        <MediaFormModal
          type={type}
          initial={modalItem === "new" ? undefined : modalItem}
          onClose={() => setModalItem(null)}
          onSaved={(saved) => {
            setItems((prev) => {
              const exists = prev.some((item) => item.id === saved.id);
              return exists ? prev.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...prev];
            });
            setModalItem(null);
          }}
        />
      )}
    </>
  );
}
