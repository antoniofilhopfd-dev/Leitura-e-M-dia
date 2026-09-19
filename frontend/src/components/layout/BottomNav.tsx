import { NavLink, useLocation } from "react-router-dom";
import { BOTTOM_NAV } from "../../lib/navigation";
import styles from "./BottomNav.module.css";

function isEntryActive(pathname: string, entryKey: string) {
  if (entryKey === "hoje") return pathname === "/";
  if (entryKey === "assistir") return pathname.startsWith("/assistir");
  if (entryKey === "ler") return pathname.startsWith("/ler");
  if (entryKey === "biblioteca") return pathname.startsWith("/biblioteca");
  if (entryKey === "mais") {
    return ["/mais", "/historico", "/estatisticas", "/configuracoes"].some((prefix) =>
      pathname.startsWith(prefix),
    );
  }
  return false;
}

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      {BOTTOM_NAV.map((item) => {
        const active = isEntryActive(location.pathname, item.key);
        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
          >
            <span className={styles.dot} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
