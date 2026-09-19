import { useAuth } from "../auth/AuthContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Button } from "../components/ui/Button";

export function Configuracoes() {
  const { user, logout } = useAuth();

  return (
    <>
      <PageHeader title="Configurações" subtitle="Preferências do sistema." />
      <Card>
        <h3 style={{ marginBottom: 12 }}>Tema</h3>
        <ThemeToggle variant="onLight" />
      </Card>
      <Card>
        <h3 style={{ marginBottom: 12 }}>Conta</h3>
        <p style={{ marginBottom: 16, color: "var(--color-muted)", fontSize: 14 }}>
          {user?.name} · {user?.email}
        </p>
        <Button variant="secondary" onClick={() => logout()}>
          Sair
        </Button>
      </Card>
    </>
  );
}
