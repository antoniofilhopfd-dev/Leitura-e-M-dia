import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Field";
import { createSession } from "../../lib/sessionApi";
import type { MediaItem } from "../../lib/mediaTypes";

const UNIT_LABELS: Record<string, string> = {
  page: "Páginas lidas nesta sessão",
  second: "Minutos nesta sessão",
  episode: "Episódios assistidos",
  chapter: "Capítulos lidos",
  part: "Quantidade",
};

type SessionQuickAddModalProps = {
  item: MediaItem;
  onClose: () => void;
  onSaved: (media: MediaItem) => void;
};

export function SessionQuickAddModal({ item, onClose, onSaved }: SessionQuickAddModalProps) {
  const unit = item.progress?.unit ?? "part";
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const value = Number(quantity);
    if (!value || value <= 0) {
      setError("Informe uma quantidade válida.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const rawQuantity = unit === "second" ? Math.round(value * 60) : Math.round(value);
      const result = await createSession({ mediaId: item.id, quantity: rawQuantity });
      onSaved(result.media);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível registrar a sessão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`Registrar sessão — ${item.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div style={{ color: "var(--color-danger)", background: "var(--color-danger-bg)", borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
            {error}
          </div>
        )}
        <TextField
          label={UNIT_LABELS[unit] ?? "Quantidade"}
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          autoFocus
          required
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
