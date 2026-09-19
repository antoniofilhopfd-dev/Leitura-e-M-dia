import { NavLink } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import styles from "./Mais.module.css";

const ITEMS = [
  { to: "/historico", label: "Histórico" },
  { to: "/estatisticas", label: "Estatísticas" },
  { to: "/configuracoes", label: "Configurações" },
];

export function Mais() {
  return (
    <>
      <PageHeader title="Mais" />
      <Card>
        <div className={styles.list}>
          {ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={styles.item}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </Card>
    </>
  );
}
