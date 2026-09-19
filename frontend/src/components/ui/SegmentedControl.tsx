import styles from "./SegmentedControl.module.css";

export type SegmentedOption = {
  key: string;
  label: string;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  value: string;
  onChange: (key: string) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className={styles.container} role="radiogroup">
      {options.map((option) => {
        const active = option.key === value;
        const classes = active ? `${styles.option} ${styles.optionActive}` : styles.option;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={active}
            className={classes}
            onClick={() => onChange(option.key)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
