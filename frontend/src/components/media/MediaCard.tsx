import { ProgressBar } from "../ui/ProgressBar";
import { STATUS_LABELS, progressLabel, progressPercent } from "../../lib/mediaTypes";
import type { MediaItem } from "../../lib/mediaTypes";
import styles from "./MediaCard.module.css";

type MediaCardProps = {
  item: MediaItem;
  onEdit: () => void;
  onDelete: () => void;
};

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
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
        {label && (
          <>
            <ProgressBar percent={percent} />
            <span className={styles.progressLabel}>{label}</span>
          </>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={onEdit}>
            Editar
          </button>
          <button type="button" className={styles.actionButton} onClick={onDelete}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
