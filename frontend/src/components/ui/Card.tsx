import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...rest }: CardProps) {
  const classes = className ? `${styles.card} ${className}` : styles.card;
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
