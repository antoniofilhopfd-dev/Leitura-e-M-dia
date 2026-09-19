import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Hoje } from "./pages/Hoje";
import { Filmes } from "./pages/Filmes";
import { Series } from "./pages/Series";
import { Novelas } from "./pages/Novelas";
import { Livros } from "./pages/Livros";
import { Audiolivros } from "./pages/Audiolivros";
import { Biblioteca } from "./pages/Biblioteca";
import { Historico } from "./pages/Historico";
import { Estatisticas } from "./pages/Estatisticas";
import { Configuracoes } from "./pages/Configuracoes";
import { Mais } from "./pages/Mais";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Hoje />} />
        <Route path="/assistir" element={<Navigate to="/assistir/filmes" replace />} />
        <Route path="/assistir/filmes" element={<Filmes />} />
        <Route path="/assistir/series" element={<Series />} />
        <Route path="/assistir/novelas" element={<Novelas />} />
        <Route path="/ler" element={<Navigate to="/ler/livros" replace />} />
        <Route path="/ler/livros" element={<Livros />} />
        <Route path="/ler/audiolivros" element={<Audiolivros />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/mais" element={<Mais />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
