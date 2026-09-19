import { useTheme } from "../../theme/ThemeContext";
import { SegmentedControl } from "./SegmentedControl";
import { ModuleTabs } from "./ModuleTabs";

const OPTIONS = [
  { key: "auto", label: "Automático" },
  { key: "light", label: "Claro" },
  { key: "dark", label: "Escuro" },
];

type ThemeToggleProps = {
  /** "onDark" para uso sobre a sidebar/superfícies escuras; "onLight" para o padrão de filtro */
  variant?: "onDark" | "onLight";
};

export function ThemeToggle({ variant = "onLight" }: ThemeToggleProps) {
  const { mode, setMode } = useTheme();
  const onChange = (key: string) => setMode(key as "auto" | "light" | "dark");

  if (variant === "onDark") {
    return <ModuleTabs items={OPTIONS} value={mode} onChange={onChange} />;
  }
  return <SegmentedControl options={OPTIONS} value={mode} onChange={onChange} />;
}
