# Arquitetura

Visão geral da plataforma Democracia-Direta.

- Monorepo com `pnpm` e `turbo`
- API `Node.js` (Express) + `Prisma` + `PostgreSQL`
- Web `Next.js` 14 (App Router)
- Mobile `Expo`/React Native
- Pacotes compartilhados: `@dd/db` (Prisma Client) e `@dd/types`
- Infra: `docker-compose` com Postgres

Princípios:
- Transparência por padrão: logs de auditoria, histórico de versões
- Segurança: camadas de autorização por papel e por unidade organizacional
- Extensibilidade: rotas e regras de votação configuráveis
- Federado: unidades organizacionais independentes, integradas ao repositório nacional

Autenticação:
- Placeholder local na API. Futuro: OIDC (gov.br), e-CPF ou ID partidário

Autorização:
- Papel + associação (`Membership.role`) + escopo de `OrgUnit`
- Policies a serem implementadas como middlewares na API

