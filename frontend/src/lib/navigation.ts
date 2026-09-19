export type NavLeaf = {
  key: string;
  label: string;
  path: string;
};

export type NavGroup = {
  key: string;
  label: string;
  children: NavLeaf[];
};

export type NavEntry = NavLeaf | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

export const ASSISTIR_GROUP: NavGroup = {
  key: "assistir",
  label: "Assistir",
  children: [
    { key: "filmes", label: "Filmes", path: "/assistir/filmes" },
    { key: "series", label: "Séries", path: "/assistir/series" },
    { key: "novelas", label: "Novelas", path: "/assistir/novelas" },
  ],
};

export const LER_GROUP: NavGroup = {
  key: "ler",
  label: "Ler",
  children: [
    { key: "livros", label: "Livros", path: "/ler/livros" },
    { key: "audiolivros", label: "Audiolivros", path: "/ler/audiolivros" },
  ],
};

// Navegação da sidebar (desktop) — seção 5 da especificação
export const SIDEBAR_NAV: NavEntry[] = [
  { key: "hoje", label: "Hoje", path: "/" },
  ASSISTIR_GROUP,
  LER_GROUP,
  { key: "biblioteca", label: "Biblioteca", path: "/biblioteca" },
  { key: "historico", label: "Histórico", path: "/historico" },
  { key: "estatisticas", label: "Estatísticas", path: "/estatisticas" },
  { key: "configuracoes", label: "Configurações", path: "/configuracoes" },
];

// Bottom navigation (mobile) — no máximo 5 itens, seção 5 da especificação
export const BOTTOM_NAV: NavLeaf[] = [
  { key: "hoje", label: "Hoje", path: "/" },
  { key: "assistir", label: "Assistir", path: "/assistir/filmes" },
  { key: "ler", label: "Ler", path: "/ler/livros" },
  { key: "biblioteca", label: "Biblioteca", path: "/biblioteca" },
  { key: "mais", label: "Mais", path: "/mais" },
];
