import { useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { EmptyState } from "../components/ui/EmptyState";

const STATUS_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "andamento", label: "Em andamento" },
  { key: "quero", label: "Quero" },
  { key: "concluidos", label: "Concluídos" },
];

type MediaListPageProps = {
  title: string;
  subtitle: string;
  addLabel: string;
  emptyDescription: string;
};

export function MediaListPage({ title, subtitle, addLabel, emptyDescription }: MediaListPageProps) {
  const [status, setStatus] = useState("todos");

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={<Button variant="primary">{addLabel}</Button>}
      />
      <SegmentedControl options={STATUS_FILTERS} value={status} onChange={setStatus} />
      <EmptyState
        title="Nada por aqui ainda"
        description={emptyDescription}
      />
    </>
  );
}
