# Democracia-Direta

Plataforma web e mobile para governança interna de partidos políticos, inspirada no fluxo do GitHub e na filosofia Open Source. Permite propor, debater, versionar e votar ideias, programas e decisões de forma transparente e colaborativa.

Principais módulos:
- Autenticação e níveis de permissão (filiado, coordenação, diretórios, executivo)
- Repositório de propostas com histórico (commits/versões), issues e pull requests
- Módulo de votação com pesos (regras estatutárias) e auditoria
- Árvore organizacional (nacional > estadual > municipal > núcleos)
- Governança interna (atas, resoluções, cargos e mandatos)

Monorepo com `pnpm` workspaces:
- `apps/api` — API Node.js (Express + Prisma)
- `apps/web` — App Web (Next.js)
- `apps/mobile` — App Mobile (React Native/Expo)
- `packages/db` — Prisma schema e cliente
- `packages/types` — Tipos e enums compartilhados
- `infra/` — Docker Compose (Postgres) e configs
- `docs/` — Arquitetura, modelo de dados, API e roadmap

Como começar (resumo):
1. Instale pnpm e Node 18+.
2. Copie `.env.example` para `.env` em `apps/api` e `packages/db` e ajuste `DATABASE_URL`.
3. Suba o Postgres: `docker compose -f infra/docker-compose.yml up -d`.
4. Instale deps: `pnpm install`.
5. Gere Prisma e migre: `pnpm -C packages/db prisma:generate` e `pnpm -C packages/db prisma:migrate`.
6. Rode API: `pnpm -C apps/api dev`. Web: `pnpm -C apps/web dev`. Mobile: `pnpm -C apps/mobile start`.

Veja `docs/ARCHITECTURE.md` e `docs/DATA_MODEL.md` para detalhes.
