import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export function Configuracoes() {
  return (
    <>
      <PageHeader title="Configurações" subtitle="Preferências do sistema." />
      <Card>
        <h3 style={{ marginBottom: 12 }}>Tema</h3>
        <ThemeToggle variant="onLight" />
      </Card>
    </>
  );
}
