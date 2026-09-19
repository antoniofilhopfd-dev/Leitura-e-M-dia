import { PageHeader } from "../components/ui/PageHeader";
import { StatGrid, StatTile } from "../components/ui/StatTile";

const STATS = [
  { label: "Total de conteúdos", value: 0 },
  { label: "Em andamento", value: 0 },
  { label: "Concluídos", value: 0 },
  { label: "Quero consumir", value: 0 },
  { label: "Filmes concluídos", value: 0 },
  { label: "Séries concluídas", value: 0 },
  { label: "Livros concluídos", value: 0 },
  { label: "Páginas lidas", value: 0 },
];

export function Estatisticas() {
  return (
    <>
      <PageHeader title="Estatísticas" subtitle="Um retrato geral do seu consumo." />
      <StatGrid>
        {STATS.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </StatGrid>
    </>
  );
}
