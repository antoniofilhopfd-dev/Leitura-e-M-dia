import { MediaListPage } from "./MediaListPage";

export function Filmes() {
  return (
    <MediaListPage
      type="movie"
      title="Filmes"
      subtitle="O que você já assistiu, está assistindo ou quer ver."
      addLabel="+ Adicionar filme"
      emptyDescription="Cadastre o primeiro filme para começar a acompanhar o progresso."
    />
  );
}
