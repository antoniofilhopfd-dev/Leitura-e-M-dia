import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./Field.module.css";

type FieldWrapperProps = {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
};

export function FieldWrapper({ label, hint, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

export function TextField({
  label,
  hint,
  id,
  ...rest
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper label={label} hint={hint} htmlFor={fieldId}>
      <input id={fieldId} className={styles.input} {...rest} />
    </FieldWrapper>
  );
}

export function SelectField({
  label,
  hint,
  id,
  children,
  ...rest
}: { label: string; hint?: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper label={label} hint={hint} htmlFor={fieldId}>
      <select id={fieldId} className={styles.select} {...rest}>
        {children}
      </select>
    </FieldWrapper>
  );
}

export function TextareaField({
  label,
  hint,
  id,
  ...rest
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return (
    <FieldWrapper label={label} hint={hint} htmlFor={fieldId}>
      <textarea id={fieldId} className={styles.textarea} {...rest} />
    </FieldWrapper>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
