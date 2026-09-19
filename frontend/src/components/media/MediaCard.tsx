import { ProgressBar } from "../ui/ProgressBar";
import { STATUS_LABELS, progressLabel, progressPercent } from "../../lib/mediaTypes";
import type { MediaItem } from "../../lib/mediaTypes";
import styles from "./MediaCard.module.css";

type MediaCardProps = {
  item: MediaItem;
  onEdit: () => void;
  onDelete: () => void;
  onLogSession?: () => void;
  onAddHighlight?: () => void;
};

export function MediaCard({ item, onEdit, onDelete, onLogSession, onAddHighlight }: MediaCardProps) {
  const percent = progressPercent(item.progress);
  const label = progressLabel(item);
  const subtitleParts = [item.metadata?.author, item.metadata?.platform, item.metadata?.year]
    .filter(Boolean)
    .join(" · ");

  const badgeClass =
    item.status === "in_progress"
      ? `${styles.badge} ${styles.badgeActive}`
      : item.status === "completed"
        ? `${styles.badge} ${styles.badgeCompleted}`
        : styles.badge;

  return (
    <div className={styles.card}>
      <div className={styles.cover} style={item.coverUrl ? { backgroundImage: `url(${item.coverUrl})` } : undefined}>
        {!item.coverUrl && item.title.charAt(0).toUpperCase()}
      </div>
      <div className={styles.body}>
        <div className={styles.headerRow}>
          <span className={styles.title} title={item.title}>
            {item.title}
          </span>
          <span className={badgeClass}>{STATUS_LABELS[item.type][item.status]}</span>
        </div>
        {subtitleParts && <span className={styles.subtitle}>{subtitleParts}</span>}
        {Boolean(item.rating) && (
          <span className={styles.rating} aria-label={`Avaliação: ${item.rating} de 5`}>
            {"★".repeat(item.rating!)}
            {"☆".repeat(5 - item.rating!)}
          </span>
        )}
        {label && (
          <>
            <ProgressBar percent={percent} />
            <span className={styles.progressLabel}>{label}</span>
          </>
        )}
        <div className={styles.actions}>
          {onLogSession && item.progress && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={onLogSession}
              aria-label={`Registrar sessão de ${item.title}`}
            >
              Registrar sessão
            </button>
          )}
          {onAddHighlight && item.type === "book" && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={onAddHighlight}
              aria-label={`Adicionar destaque de ${item.title}`}
            >
              Destaque
            </button>
          )}
          <button type="button" className={styles.actionButton} onClick={onEdit} aria-label={`Editar ${item.title}`}>
            Editar
          </button>
          <button type="button" className={styles.actionButton} onClick={onDelete} aria-label={`Excluir ${item.title}`}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
