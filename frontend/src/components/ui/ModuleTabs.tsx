import styles from "./ModuleTabs.module.css";

export type ModuleTabItem = {
  key: string;
  label: string;
};

type ModuleTabsProps = {
  items: ModuleTabItem[];
  value: string;
  onChange: (key: string) => void;
};

export function ModuleTabs({ items, value, onChange }: ModuleTabsProps) {
  return (
    <div className={styles.container} role="tablist">
      {items.map((item) => {
        const active = item.key === value;
        const classes = active ? `${styles.tab} ${styles.tabActive}` : styles.tab;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={classes}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
