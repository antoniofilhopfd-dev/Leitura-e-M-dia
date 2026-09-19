import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { SearchInput } from "../components/ui/SearchInput";
import { EmptyState } from "../components/ui/EmptyState";
import { MediaCard } from "../components/media/MediaCard";
import { MediaFormModal } from "../components/media/MediaFormModal";
import { SessionQuickAddModal } from "../components/media/SessionQuickAddModal";
import { HighlightQuickAddModal } from "../components/media/HighlightQuickAddModal";
import { deleteMedia, listMedia } from "../lib/mediaApi";
import { SORT_OPTIONS, sortMediaItems } from "../lib/mediaTypes";
import type { MediaItem, MediaType, SortKey } from "../lib/mediaTypes";

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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<MediaItem | "new" | null>(null);
  const [sessionItem, setSessionItem] = useState<MediaItem | null>(null);
  const [highlightItem, setHighlightItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      listMedia({
        type,
        status: status === "todos" ? undefined : (status as MediaItem["status"]),
        search: search || undefined,
      })
        .then(setItems)
        .catch((err) => setError(err instanceof Error ? err.message : "Não foi possível carregar."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [type, status, search]);

  const visibleItems = sortMediaItems(items, sort);

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
      <SearchInput
        placeholder="Buscar por título, autor, gênero ou plataforma..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <SegmentedControl options={STATUS_FILTERS} value={status} onChange={setStatus} />
        <SegmentedControl
          options={SORT_OPTIONS.map((o) => ({ key: o.key, label: o.label }))}
          value={sort}
          onChange={(key) => setSort(key as SortKey)}
        />
      </div>

      {error && (
        <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
          {error}
        </div>
      )}

      {!loading && !error && visibleItems.length === 0 && (
        <EmptyState title="Nada por aqui ainda" description={emptyDescription} />
      )}

      {visibleItems.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visibleItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onEdit={() => setModalItem(item)}
              onDelete={() => handleDelete(item.id)}
              onLogSession={() => setSessionItem(item)}
              onAddHighlight={() => setHighlightItem(item)}
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

      {sessionItem && (
        <SessionQuickAddModal
          item={sessionItem}
          onClose={() => setSessionItem(null)}
          onSaved={(updated) => {
            setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setSessionItem(null);
          }}
        />
      )}

      {highlightItem && (
        <HighlightQuickAddModal item={highlightItem} onClose={() => setHighlightItem(null)} onSaved={() => setHighlightItem(null)} />
      )}
    </>
  );
}
