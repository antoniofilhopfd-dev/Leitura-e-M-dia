import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { SIDEBAR_NAV, isNavGroup } from "../../lib/navigation";
import { ModuleTabs } from "../ui/ModuleTabs";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandTitle}>Leitura & Mídia</span>
        <span className={styles.brandSubtitle}>Biblioteca pessoal</span>
      </div>

      <nav className={styles.nav}>
        {SIDEBAR_NAV.map((entry) => {
          if (isNavGroup(entry)) {
            const activeChild = entry.children.find((child) =>
              location.pathname.startsWith(child.path),
            );
            // Sem correspondência (ex.: navegando em "Ler" enquanto este é o
            // grupo "Assistir") nenhuma aba deste grupo fica marcada como ativa.
            const value = activeChild?.key ?? "";
            return (
              <div className={styles.group} key={entry.key}>
                <span className={styles.groupLabel}>{entry.label}</span>
                <div className={styles.groupTabs}>
                  <ModuleTabs
                    items={entry.children.map((child) => ({ key: child.key, label: child.label }))}
                    value={value}
                    onChange={(key) => {
                      const target = entry.children.find((child) => child.key === key);
                      if (target) navigate(target.path);
                    }}
                  />
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={entry.key}
              to={entry.path}
              end={entry.path === "/"}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.linkActive}` : styles.link)}
            >
              {entry.label}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <ThemeToggle variant="onDark" />
      </div>
    </aside>
  );
}
