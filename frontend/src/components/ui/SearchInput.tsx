import type { InputHTMLAttributes } from "react";
import styles from "./SearchInput.module.css";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput(props: SearchInputProps) {
  return <input type="search" className={styles.input} {...props} />;
}
