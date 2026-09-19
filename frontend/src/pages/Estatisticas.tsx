import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { StatGrid, StatTile } from "../components/ui/StatTile";
import { fetchStats } from "../lib/statsApi";
import type { Stats } from "../lib/statsApi";

const TYPE_LABELS: Record<string, string> = {
  movie: "Filmes concluídos",
  series: "Séries concluídas",
  soap_opera: "Novelas concluídas",
  book: "Livros concluídos",
  audiobook: "Audiolivros concluídos",
};

const TYPE_ORDER = ["movie", "series", "soap_opera", "book", "audiobook"];

export function Estatisticas() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  const s = stats ?? {
    totalItems: 0,
    inProgress: 0,
    completed: 0,
    wanted: 0,
    totalByType: {},
    completedByType: {},
    pagesRead: 0,
    sessionsCount: 0,
  };

  return (
    <>
      <PageHeader title="Estatísticas" subtitle="Um retrato geral do seu consumo." />
      <StatGrid>
        <StatTile value={s.totalItems} label="Total de conteúdos" />
        <StatTile value={s.inProgress} label="Em andamento" />
        <StatTile value={s.completed} label="Concluídos" />
        <StatTile value={s.wanted} label="Quero consumir" />
        {TYPE_ORDER.map((type) => (
          <StatTile key={type} value={s.completedByType[type] ?? 0} label={TYPE_LABELS[type]} />
        ))}
        <StatTile value={s.pagesRead} label="Páginas lidas" />
        <StatTile value={s.sessionsCount} label="Sessões registradas" />
      </StatGrid>
    </>
  );
}
