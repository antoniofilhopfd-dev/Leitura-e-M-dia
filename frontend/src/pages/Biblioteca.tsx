import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { SearchInput } from "../components/ui/SearchInput";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { EmptyState } from "../components/ui/EmptyState";
import { MediaCard } from "../components/media/MediaCard";
import { MediaFormModal } from "../components/media/MediaFormModal";
import { SessionQuickAddModal } from "../components/media/SessionQuickAddModal";
import { HighlightQuickAddModal } from "../components/media/HighlightQuickAddModal";
import { deleteMedia, listMedia } from "../lib/mediaApi";
import type { MediaItem, MediaType } from "../lib/mediaTypes";

const TIPOS: { key: string; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "movie", label: "Filmes" },
  { key: "series", label: "Séries" },
  { key: "soap_opera", label: "Novelas" },
  { key: "book", label: "Livros" },
  { key: "audiobook", label: "Audiolivros" },
];

export function Biblioteca() {
  const [tipo, setTipo] = useState("todos");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [sessionItem, setSessionItem] = useState<MediaItem | null>(null);
  const [highlightItem, setHighlightItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      listMedia({ type: tipo === "todos" ? undefined : (tipo as MediaType), search: search || undefined })
        .then(setItems)
        .catch((err) => setError(err instanceof Error ? err.message : "Não foi possível carregar."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [tipo, search]);

  async function handleDelete(id: string) {
    if (!window.confirm("Excluir este item? Essa ação não pode ser desfeita.")) return;
    await deleteMedia(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <>
      <PageHeader title="Biblioteca" subtitle="Todos os seus conteúdos em um só lugar." />
      <SearchInput
        placeholder="Buscar por título, autor, gênero ou plataforma..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SegmentedControl options={TIPOS} value={tipo} onChange={setTipo} />

      {error && (
        <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Sua biblioteca está vazia"
          description="Os conteúdos que você cadastrar em Assistir e Ler aparecerão aqui."
        />
      )}

      {items.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
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

      {editing && (
        <MediaFormModal
          type={editing.type}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setItems((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
            setEditing(null);
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
