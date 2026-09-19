import { MediaListPage } from "./MediaListPage";

export function Series() {
  return (
    <MediaListPage
      type="series"
      title="Séries"
      subtitle="Temporadas e episódios em andamento."
      addLabel="+ Adicionar série"
      emptyDescription="Cadastre a primeira série para acompanhar temporada e episódio atuais."
    />
  );
}
