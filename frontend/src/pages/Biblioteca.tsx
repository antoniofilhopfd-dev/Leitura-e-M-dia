import { useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { SearchInput } from "../components/ui/SearchInput";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { EmptyState } from "../components/ui/EmptyState";

const TIPOS = [
  { key: "todos", label: "Todos" },
  { key: "filme", label: "Filmes" },
  { key: "serie", label: "Séries" },
  { key: "novela", label: "Novelas" },
  { key: "livro", label: "Livros" },
  { key: "audiolivro", label: "Audiolivros" },
];

export function Biblioteca() {
  const [tipo, setTipo] = useState("todos");

  return (
    <>
      <PageHeader title="Biblioteca" subtitle="Todos os seus conteúdos em um só lugar." />
      <SearchInput placeholder="Buscar por título, autor, gênero ou plataforma..." />
      <SegmentedControl options={TIPOS} value={tipo} onChange={setTipo} />
      <EmptyState
        title="Sua biblioteca está vazia"
        description="Os conteúdos que você cadastrar em Assistir e Ler aparecerão aqui."
      />
    </>
  );
}
