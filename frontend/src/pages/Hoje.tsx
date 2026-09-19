import { PageHeader } from "../components/ui/PageHeader";
import { Section } from "../components/ui/Section";
import { StatGrid, StatTile } from "../components/ui/StatTile";
import { EmptyState } from "../components/ui/EmptyState";

const HOJE_STATS = [
  { label: "Páginas lidas", value: 0 },
  { label: "Minutos ouvidos", value: 0 },
  { label: "Episódios/capítulos", value: 0 },
  { label: "Sessões", value: 0 },
];

const RESUMO_STATS = [
  { label: "Filmes", value: 0 },
  { label: "Séries", value: 0 },
  { label: "Novelas", value: 0 },
  { label: "Livros", value: 0 },
  { label: "Audiolivros", value: 0 },
];

export function Hoje() {
  return (
    <>
      <PageHeader title="Hoje" subtitle="O que está em andamento e o que você fez hoje." />

      <Section title="Continuar">
        <EmptyState
          title="Nada em andamento"
          description="O que você estiver assistindo, lendo ou ouvindo aparece aqui."
        />
      </Section>

      <Section title="Hoje">
        <StatGrid>
          {HOJE_STATS.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </StatGrid>
      </Section>

      <Section title="Recentes">
        <EmptyState
          title="Nenhuma atualização recente"
          description="Os últimos conteúdos atualizados aparecem aqui."
        />
      </Section>

      <Section title="Resumo">
        <StatGrid>
          {RESUMO_STATS.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </StatGrid>
      </Section>
    </>
  );
}
