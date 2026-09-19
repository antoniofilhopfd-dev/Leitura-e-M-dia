import type { ReactNode } from "react";
import { Card } from "./Card";
import styles from "./StatTile.module.css";

type StatTileProps = {
  value: string | number;
  label: string;
};

export function StatTile({ value, label }: StatTileProps) {
  return (
    <Card>
      <div className={styles.tile}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </Card>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
