# Leitura & Mídia — Especificação Mestre do Projeto

> Documento de referência para todas as etapas de desenvolvimento. Substitui os
> protótipos HTML separados (Leitura, Mídia, `cinema(5).html`) por um único
> sistema. Este arquivo é a fonte de verdade das decisões arquiteturais — cada
> etapa do plano de desenvolvimento deve segui-lo, e qualquer mudança estrutural
> deve ser refletida aqui antes de ser implementada.

Status: **aprovado**, com os ajustes descritos na seção 13.

## 1. Objetivo

Criar uma biblioteca pessoal centralizada que reúne Filmes, Séries, Novelas,
Livros e Audiolivros, permitindo saber a qualquer momento: o que está em
andamento, onde parou, quanto falta, o que pretende consumir depois e qual é o
histórico de consumo.

## 2. Nome do projeto

Nome de trabalho: **Leitura & Mídia**. A decisão sobre se o sistema será um
módulo do "Viva360" ou um produto independente fica em aberto — não bloqueia
nenhuma etapa e será revisitada mais adiante.

## 3. Arquitetura

| Camada | Escolha |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Fastify |
| Banco | PostgreSQL |
| ORM | Prisma |
| Hospedagem | Hostinger VPS |
| Servidor web | Nginx |
| Deploy | Docker Compose (`frontend`, `api`, `postgres`, `nginx`) |

Não será usado Google Apps Script nem Google Sheets como banco. O PostgreSQL é
a fonte oficial dos dados; `localStorage` só é aceitável para preferências de
interface ou cache temporário.

## 4. Perfis de usuário (MVP)

Conta única (usuário principal = administrador técnico). O schema já é
desenhado com `user_id` em todas as tabelas de conteúdo, para permitir
multiusuário no futuro sem migração estrutural — mas a autenticação do MVP não
implementa convites, papéis ou compartilhamento.

## 5. Navegação

**Desktop** — sidebar: Hoje · Assistir (Filmes, Séries, Novelas) · Ler (Livros,
Audiolivros) · Biblioteca · Histórico · Estatísticas · Configurações.

**Mobile** — bottom navigation com 5 itens: Hoje · Assistir · Ler · Biblioteca ·
Mais. Dentro de "Assistir": Filmes | Séries | Novelas. Dentro de "Ler": Livros |
Audiolivros.

A Home/dashboard principal chama-se **"Hoje"** (não "Início") — nome escolhido
por refletir o foco do produto em progresso diário e sessões, não em uma tela
genérica de abertura.

## 6. Módulos e campos por tipo de mídia

### Filmes
Título, capa, ano, gênero, plataforma, status, duração total, onde parei
(campo livre), quanto falta, progresso percentual, avaliação, observações.

Decisão de escopo: **sem controle de minuto exato no MVP.** Percentual +
campo livre "onde parei" resolve o caso de uso real; guardar o segundo exato
exigiria um scrubber de UI sem ganho percebido agora. Pode ser adicionado
depois como campo opcional, sem quebrar o schema.

### Séries
Título, capa, ano, gênero, plataforma, status, temporada atual, episódio
atual, total de episódios da temporada, total de episódios da série,
progresso, avaliação, observações.

Decisão de escopo: **sem estrutura completa de episódios no MVP** (sem tabela
por episódio). Apenas temporada atual + episódio atual + totais.

### Novelas
Título, capa, ano, canal/plataforma, status, capítulo atual, total de
capítulos, progresso, avaliação, observações.

### Livros
Título, autor, capa, ano, gênero, status, página atual, total de páginas,
progresso, avaliação, observações. Suporta sessões de leitura (data, página
inicial, página final, quantidade lida) e destaques (página, trecho, data).

### Audiolivros
Título, autor, capa, ano, status, duração total, tempo ouvido, quanto falta,
progresso, avaliação, observações. Suporta sessões (data, quantidade ouvida).

### Status (padronizado no banco, traduzido na UI)
- Filmes/Séries/Novelas: Quero assistir → Assistindo → Concluído → Pausado → Abandonado
- Livros: Quero ler → Lendo → Concluído → Pausado → Abandonado
- Audiolivros: Quero ouvir → Ouvindo → Concluído → Pausado → Abandonado

## 7. Hoje (dashboard)

- **Continuar**: cards do que está assistindo/lendo/ouvindo agora.
- **Hoje**: páginas lidas, minutos ouvidos, episódios/capítulos registrados, sessões do dia.
- **Recentes**: últimos conteúdos atualizados.
- **Resumo**: contagem por tipo de mídia (filmes, séries, novelas, livros, audiolivros).

## 8. Busca e filtros

Busca global por título, autor, gênero, plataforma, além de busca dentro de
cada módulo. Filtros como segmented controls: Status (Todos | Em andamento |
Quero | Concluídos), Período (7 dias | 30 dias | Ano | Tudo), Ordenação
(Recentes | Nome | Avaliação | Progresso).

## 9. Tema

Obrigatório desde o MVP: claro, escuro, automático — via `prefers-color-scheme`
com override manual por `data-theme="light"` / `data-theme="dark"`.

### Tokens visuais
- Cards: `border-radius: 20px`
- Controles: `border-radius: 12px`
- Sombra clara: `0 18px 50px rgba(34,48,94,0.08)`
- Sombra escura: `0 18px 50px rgba(0,0,0,0.4)`
- Tipografia: Manrope (600/700/800) para display; Inter (400/500/600) para corpo/UI

### Cores — tema claro
```
--color-brand-blue: #3852B4
--color-brand-blue-light: #5E7AC4
--color-brand-orange: #F08D39
--color-brand-orange-light: #F3BE7A
--color-brand-bg: #F5F6FA
--color-brand-bg-alt: #F6F7FB
--color-card: #FFFFFF
--color-border: #E6E9F1
--color-brand-sidebar: #263A70
--color-brand-sidebar-alt: #30477F
--color-ink: #172033
--color-muted: #747D91
--color-danger: #B23A3A
--color-danger-bg: #F3D9D9
```

### Cores — tema escuro
```
--color-brand-blue: #8098E6
--color-brand-blue-light: #A3B6EC
--color-brand-orange: #F3A35F
--color-brand-orange-light: #F6C090
--color-brand-bg: #10141F
--color-brand-bg-alt: #0B0E17
--color-card: #191F2F
--color-border: #2B3348
--color-brand-sidebar: #0C1120
--color-brand-sidebar-alt: #151D34
--color-ink: #E9ECF5
--color-muted: #9AA3BA
--color-danger: #E28A8A
--color-danger-bg: #3A2222
```

### Abas de módulo (sobre sidebar ou área escura)
Container: fundo branco 10% opacidade, padding 4px, `border-radius: 10px`,
itens `flex: 1`. Inativa: texto branco 75%. Ativa: fundo branco, texto na cor
da sidebar, `border-radius: 8px`, padding vertical 6px, `font-size: 12px`,
bold.

### Segmented controls (filtros)
Container: `--color-brand-bg`, padding 4px, `border-radius: 12px`. Inativo:
texto `--color-muted`. Ativo: fundo `--color-brand-sidebar`, texto branco,
`border-radius: 8px`, padding `6px 10px`, `font-size: 12px`, bold, transição
suave.

**Regra importante**: laranja e azul nunca indicam seleção/estado ativo de
aba ou filtro — ficam reservados a CTAs, links e destaques. A cor ativa de
abas e filtros é sempre a cor da sidebar.

## 10. API

Estrutura por domínio, não por tipo de mídia:
`/api/auth`, `/api/media`, `/api/progress`, `/api/sessions`,
`/api/highlights`, `/api/stats`, `/api/uploads`, `/api/settings`.

`/api/media` aceita `type` (`movie` | `series` | `soap_opera` | `book` |
`audiobook`) em vez de rotas separadas por tipo.

## 11. Modelo de dados

- **users** — id, name, email, password_hash, created_at
- **media_items** — id, user_id, type, title, status, cover_url, genre, rating, notes, created_at, updated_at
- **media_metadata** — dados específicos por tipo: author, year, platform, `season_current`, `season_total_episodes`, `series_total_episodes`, chapter fields, duration, etc.
- **progress** — media_id, current_value, total_value, `unit` (enum Postgres: `page` | `episode` | `chapter` | `second` | `part`)
- **activity_sessions** — id, media_id, date, start_value, end_value, quantity, duration
- **highlights** — id, media_id, page (opcional), text, created_at — usa `media_id` genérico, não `book_id`, para permitir destaques de audiolivro no futuro sem migração de schema
- **settings**, **uploads** — conforme necessário na Etapa 2/12

## 12. Segurança e operação

- Sessão via cookie HTTP-only, `Secure` em produção, `SameSite` apropriado. Sem token em `localStorage`.
- Senha com hash Argon2 ou bcrypt.
- HTTPS, rate limiting, validação de entrada, headers de segurança, `.env`, PostgreSQL nunca exposto publicamente.
- Backup automático do PostgreSQL: 7 diários, 4 semanais, 3 mensais, mais exportação manual em JSON.
- Capas: busca automática por API externa, upload manual ou URL — nunca obrigatório usar API externa para cadastrar uma obra.

## 13. Ajustes aprovados sobre a proposta original

1. **`progress.unit` como enum Postgres** (`page`, `episode`, `chapter`,
   `second`, `part`) em vez de string livre, definido já na Etapa 2, para
   evitar inconsistência de valores.
2. **Totais de temporada/série movidos para `media_metadata`**
   (`season_total_episodes`, `series_total_episodes`), não para `progress` —
   evita que a tabela `progress` tenha semântica dupla (progresso dentro da
   temporada vs. da série toda).
3. **Migração dos dados dos protótipos antigos incluída na Etapa 4**: endpoint
   `POST /api/media/import` que aceita o JSON hoje salvo em `localStorage`,
   mapeando os nomes de status antigos ("Já vi", "Assistido", "Lido", "Já
   ouvi" etc.) para o vocabulário padronizado da seção 6.
4. **`highlights` usa `media_id` genérico** desde o início (já estava assim na
   proposta original) — mantido explicitamente para permitir destaques de
   audiolivro (trecho + timestamp) no futuro sem alterar o schema.

## 14. Perguntas em aberto (não bloqueiam o início)

- Nome definitivo do ecossistema (Viva360 vs. produto independente).
- Domínio e escolha de APIs externas de metadados/capas.

## 15. Plano de desenvolvimento por etapas

1. ✅ Estrutura visual — design system, tema claro/escuro, sidebar desktop,
   bottom nav mobile, tipografia, cards, botões, abas, modal base, tela
   "Hoje" vazia. **Sem backend.**
2. ✅ Backend base — Node, PostgreSQL, Prisma, Docker, `.env`, `/api/health`.
3. ✅ Autenticação — login, logout, sessão, usuário único.
4. ✅ Biblioteca — CRUD genérico para os 5 tipos de mídia.
5. ✅ Filmes — campos e progresso completos.
6. ✅ Séries e novelas — temporadas, episódios, capítulos, progresso.
7. ✅ Livros — autor, páginas, capa, progresso, avaliação, sessões.
8. ✅ Audiolivros — duração, ouvido, restante, progresso, sessões.
9. ✅ Hoje — dashboard completo (continuar, recentes, progresso, resumo).
10. ✅ Sessões, histórico e destaques.
11. ✅ Busca, filtros e estatísticas.
12. ⏳ Produção — VPS, Nginx, HTTPS, domínio, backup, logs, segurança, testes finais.
    **Aguardando aprovação explícita** — é a única etapa que toca infraestrutura
    real (a VPS, o domínio, certificados) fora do ambiente de desenvolvimento.

Nota sobre a Etapa 4: como a arquitetura já usa uma tabela `media_items`
genérica com componentes de UI compartilhados entre os 5 tipos, o CRUD saiu
pronto com os campos de cada tipo (Etapas 5-8) na mesma leva de trabalho —
por isso essas seis etapas foram entregues e reportadas juntas. A
importação do `localStorage` dos protótipos antigos prevista aqui não foi
implementada: o projeto passou a ser construído do zero (decisão do dono do
produto), então não há dados antigos deste sistema para migrar.

Cada etapa: informar antes o que será alterado; ao final, reportar
funcionalidades implementadas, arquivos criados/modificados, testes
realizados, problemas encontrados e a próxima etapa recomendada. Nenhuma
etapa começa automaticamente sem aprovação.
