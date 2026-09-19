import { MediaListPage } from "./MediaListPage";

export function Livros() {
  return (
    <MediaListPage
      title="Livros"
      subtitle="Páginas lidas, sessões e destaques."
      addLabel="+ Adicionar livro"
      emptyDescription="Cadastre o primeiro livro para registrar páginas e sessões de leitura."
    />
  );
}
