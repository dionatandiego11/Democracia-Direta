# API (rascunho)

Base: `http://localhost:4000`

Rotas:
- `GET /health` — status do serviço
- `POST /auth/login` — login (placeholder)
- `POST /auth/logout` — logout

Propostas
- `GET /proposals?org=:slug` — lista (até 50 mais recentes)
- `POST /proposals` — cria proposta + primeira versão
  - body: `{ title, slug, orgUnitId, authorId, contentMd }`
- `GET /proposals/:id` — detalhe + última versão

Votações
- `GET /votes/sessions` — lista de sessões de voto
- `POST /votes/sessions` — cria sessão
  - body: `{ orgUnitId, title, scope, subjectId, rule, startsAt, endsAt, createdById }`

Autorização e segurança ainda serão adicionadas via middleware com JWT/OIDC.

