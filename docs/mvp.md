# MVP Funcionando

## Pré-requisitos
- Node.js >= 18
- npm >= 9

## Instalação
```bash
npm install
```

## Executar API
```bash
npm run dev --workspace api
```
A API sobe em `http://localhost:3333`.

### Rotas principais
- `POST /auth/login` — payload `{ "userId": "u-maria" }` devolve token demo.
- `GET /proposals` — lista propostas.
- `GET /proposals/{slug}` — detalhe completo.
- `POST /proposals/{slug}/vote` — registra voto (enviar cabeçalho `x-user-id`).
- `GET /audit` — log de auditoria.

## Executar Web
Em novo terminal:
```bash
npm run dev --workspace web
```
A interface abre em `http://localhost:5173`.

A aplicação assume usuário `u-maria` para demonstrar ações. Para alternar usuário, altere a chamada `setUser` em `HomePage.tsx`.

## Fluxos demonstrados
1. **Listagem de propostas** com status, tags e datas.
2. **Visualização detalhada** com README renderizado, timeline de commits, votação e issues.
3. **Registro de voto** em tempo real, com contagem atualizada.
4. **Abertura de issue** diretamente pela UI.
5. **Trilha de auditoria** disponível via `GET /audit`.

## Testes
Estrutura de testes com Vitest está preparada (`npm test --workspace api`). Casos de teste automatizados serão adicionados na próxima iteração.

## Deploy Sugerido
1. Criar imagens Docker para `apps/api` e `apps/web` (Next step no roadmap).
2. Configurar Postgres gerenciado e Redis para sessões/cache.
3. Utilizar Terraform (pasta `infra/`) para provisionar ambiente (VPC, ECS/EKS, RDS, S3 para anexos).
4. Configurar GitHub Actions para build + lint + test + deploy.
