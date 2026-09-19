import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { SearchInput } from "../components/ui/SearchInput";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { EmptyState } from "../components/ui/EmptyState";
import { MediaCard } from "../components/media/MediaCard";
import { MediaFormModal } from "../components/media/MediaFormModal";
import { SessionQuickAddModal } from "../components/media/SessionQuickAddModal";
import { HighlightQuickAddModal } from "../components/media/HighlightQuickAddModal";
import { deleteMedia, listMedia } from "../lib/mediaApi";
import { SORT_OPTIONS, sortMediaItems } from "../lib/mediaTypes";
import type { MediaItem, MediaType, SortKey } from "../lib/mediaTypes";
import fieldStyles from "../components/ui/Field.module.css";

const TIPOS: { key: string; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "movie", label: "Filmes" },
  { key: "series", label: "Séries" },
  { key: "soap_opera", label: "Novelas" },
  { key: "book", label: "Livros" },
  { key: "audiobook", label: "Audiolivros" },
];

const ALL = "todos";

export function Biblioteca() {
  const [tipo, setTipo] = useState(ALL);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recentes");
  const [genero, setGenero] = useState(ALL);
  const [plataforma, setPlataforma] = useState(ALL);
  const [ano, setAno] = useState(ALL);
  const [avaliacaoMin, setAvaliacaoMin] = useState("0");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [sessionItem, setSessionItem] = useState<MediaItem | null>(null);
  const [highlightItem, setHighlightItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      listMedia({ type: tipo === ALL ? undefined : (tipo as MediaType), search: search || undefined })
        .then(setItems)
        .catch((err) => setError(err instanceof Error ? err.message : "Não foi possível carregar."))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [tipo, search]);

  const generoOptions = useMemo(
    () => Array.from(new Set(items.map((i) => i.genre).filter(Boolean))) as string[],
    [items],
  );
  const plataformaOptions = useMemo(
    () => Array.from(new Set(items.map((i) => i.metadata?.platform).filter(Boolean))) as string[],
    [items],
  );
  const anoOptions = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.metadata?.year).filter(Boolean)))
        .sort((a, b) => (b as number) - (a as number))
        .map(String),
    [items],
  );

  const visibleItems = sortMediaItems(
    items.filter((item) => {
      if (genero !== ALL && item.genre !== genero) return false;
      if (plataforma !== ALL && item.metadata?.platform !== plataforma) return false;
      if (ano !== ALL && String(item.metadata?.year ?? "") !== ano) return false;
      if (Number(avaliacaoMin) > 0 && (item.rating ?? 0) < Number(avaliacaoMin)) return false;
      return true;
    }),
    sort,
  );

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <select className={fieldStyles.select} style={{ width: "auto" }} value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value={ALL}>Todos os gêneros</option>
          {generoOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          className={fieldStyles.select}
          style={{ width: "auto" }}
          value={plataforma}
          onChange={(e) => setPlataforma(e.target.value)}
        >
          <option value={ALL}>Todas as plataformas</option>
          {plataformaOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select className={fieldStyles.select} style={{ width: "auto" }} value={ano} onChange={(e) => setAno(e.target.value)}>
          <option value={ALL}>Todos os anos</option>
          {anoOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
          className={fieldStyles.select}
          style={{ width: "auto" }}
          value={avaliacaoMin}
          onChange={(e) => setAvaliacaoMin(e.target.value)}
        >
          <option value="0">Qualquer avaliação</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ou mais
            </option>
          ))}
        </select>
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
        <EmptyState
          title="Sua biblioteca está vazia"
          description="Os conteúdos que você cadastrar em Assistir e Ler aparecerão aqui."
        />
      )}

      {visibleItems.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visibleItems.map((item) => (
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
