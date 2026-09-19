import { MediaListPage } from "./MediaListPage";

export function Audiolivros() {
  return (
    <MediaListPage
      type="audiobook"
      title="Audiolivros"
      subtitle="Tempo ouvido e quanto falta para concluir."
      addLabel="+ Adicionar audiolivro"
      emptyDescription="Cadastre o primeiro audiolivro para registrar sessões de escuta."
    />
  );
}
