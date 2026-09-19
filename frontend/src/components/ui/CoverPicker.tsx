import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { uploadCover } from "../../lib/uploadApi";
import styles from "./CoverPicker.module.css";
import fieldStyles from "./Field.module.css";

type CoverPickerProps = {
  value: string;
  onChange: (url: string) => void;
};

export function CoverPicker({ value, onChange }: CoverPickerProps) {
  const fieldId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadCover(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label} htmlFor={fieldId}>
        Capa
      </label>
      <div className={styles.row}>
        <div className={styles.preview} style={value ? { backgroundImage: `url(${value})` } : undefined} />
        <div className={styles.controls}>
          <input
            id={fieldId}
            className={fieldStyles.input}
            placeholder="Cole a URL de uma imagem..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className={styles.uploadRow}>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Enviando..." : "Enviar imagem do dispositivo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              hidden
            />
          </div>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </div>
    </div>
  );
}
