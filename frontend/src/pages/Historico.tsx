import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";

export function Historico() {
  return (
    <>
      <PageHeader title="Histórico" subtitle="Progresso registrado ao longo do tempo." />
      <EmptyState
        title="Nenhuma atividade registrada ainda"
        description="Quando você atualizar o progresso de algum conteúdo, o registro aparecerá aqui."
      />
    </>
  );
}
