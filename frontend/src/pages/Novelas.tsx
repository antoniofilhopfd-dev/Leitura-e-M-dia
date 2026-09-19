import { MediaListPage } from "./MediaListPage";

export function Novelas() {
  return (
    <MediaListPage
      type="soap_opera"
      title="Novelas"
      subtitle="Capítulos acompanhados por canal ou plataforma."
      addLabel="+ Adicionar novela"
      emptyDescription="Cadastre a primeira novela para acompanhar os capítulos."
    />
  );
}
