import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Section } from "../components/ui/Section";
import { EmptyState } from "../components/ui/EmptyState";
import { listSessions } from "../lib/sessionApi";
import type { SessionRecord } from "../lib/sessionApi";
import { listHighlights } from "../lib/highlightApi";
import type { HighlightRecord } from "../lib/highlightApi";
import styles from "./Historico.module.css";

const UNIT_SUFFIX: Record<string, string> = {
  page: "págs.",
  second: "min",
  episode: "ep.",
  chapter: "cap.",
  part: "un.",
};

function formatQuantity(session: SessionRecord) {
  const unit = session.media.progress?.unit ?? "part";
  const raw = session.quantity ?? 0;
  const value = unit === "second" ? Math.round(raw / 60) : raw;
  return `+${value} ${UNIT_SUFFIX[unit] ?? ""}`.trim();
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function Historico() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [highlights, setHighlights] = useState<HighlightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listSessions(), listHighlights()])
      .then(([sessionData, highlightData]) => {
        setSessions(sessionData);
        setHighlights(highlightData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Histórico" subtitle="Progresso registrado ao longo do tempo." />

      <Section title="Sessões">
        {!loading && sessions.length === 0 && (
          <EmptyState
            title="Nenhuma atividade registrada ainda"
            description="Quando você registrar uma sessão de leitura, escuta ou episódios assistidos, ela aparece aqui."
          />
        )}
        {sessions.length > 0 && (
          <div className={styles.list}>
            {sessions.map((session) => (
              <div className={styles.row} key={session.id}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{session.media.title}</span>
                  <span className={styles.rowMeta}>{formatDate(session.date)}</span>
                </div>
                <span className={styles.rowValue}>{formatQuantity(session)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Destaques">
        {!loading && highlights.length === 0 && (
          <EmptyState title="Nenhum destaque salvo" description="Destaques de livros aparecem aqui, com página e trecho." />
        )}
        {highlights.length > 0 && (
          <div className={styles.list}>
            {highlights.map((highlight) => (
              <div className={styles.row} key={highlight.id}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    {highlight.media.title}
                    {highlight.page ? ` · pág. ${highlight.page}` : ""}
                  </span>
                  <span className={styles.highlightText}>"{highlight.text}"</span>
                </div>
                <span className={styles.rowMeta}>{formatDate(highlight.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
