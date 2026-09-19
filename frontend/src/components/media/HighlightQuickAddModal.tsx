import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TextField, TextareaField } from "../ui/Field";
import { createHighlight } from "../../lib/highlightApi";
import type { MediaItem } from "../../lib/mediaTypes";

type HighlightQuickAddModalProps = {
  item: MediaItem;
  onClose: () => void;
  onSaved: () => void;
};

export function HighlightQuickAddModal({ item, onClose, onSaved }: HighlightQuickAddModalProps) {
  const [page, setPage] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) {
      setError("Escreva o trecho ou a anotação.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createHighlight({ mediaId: item.id, text: text.trim(), page: page ? Number(page) : null });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o destaque.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Novo destaque — ${item.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
            {error}
          </div>
        )}
        <TextField label="Página" type="number" value={page} onChange={(e) => setPage(e.target.value)} />
        <TextareaField label="Trecho ou anotação" value={text} onChange={(e) => setText(e.target.value)} autoFocus required />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar destaque"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
