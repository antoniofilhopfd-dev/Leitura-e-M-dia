import styles from "./StarRating.module.css";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
};

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? `${styles.star} ${styles.starFilled}` : styles.star}
          onClick={() => onChange(star === value ? 0 : star)}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
