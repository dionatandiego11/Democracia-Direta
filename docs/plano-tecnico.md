# Plano Técnico Democracia Direta

## Visão
Plataforma web que replica fluxos de colaboração do GitHub para elaboração de políticas públicas municipais. Cada proposta funciona como um repositório versionável, permitindo forks, pull requests cívicos, issues e votações verificáveis. Transparência é o princípio orientador: toda interação gera registros auditáveis publicados para a comunidade.

## Objetivos do MVP
1. Disponibilizar CRUD de propostas com suporte a README em Markdown, branches, commits e PRs simples.
2. Habilitar votação por aprovação (sim/não) com contagem pública.
3. Expor histórico (audit log) e métricas básicas via API.
4. Entregar UI responsiva inspirada na linguagem do GitHub, com navegação acessível (WCAG 2.1 AA).
5. Preparar terreno para expansão futura (outros métodos de voto, integrações Gov.br, escalabilidade).

## Decisões de Arquitetura
| Tema | Alternativas avaliadas | Decisão | Justificativa |
| --- | --- | --- | --- |
| **Back-end** | NestJS (Node), FastAPI (Python) | **Node + Express modular** | Para o MVP, Express oferece curva de implementação menor. O design modular permite migração futura para NestJS mantendo TypeScript. |
| **Front-end** | Next.js App Router, Remix, Vite + React | **Vite + React + React Router** | Simplifica bootstrap local mantendo SSR opcional para futura expansão com Next. Compatível com componentes design system. |
| **Persistência** | PostgreSQL, SQLite, In-memory | **In-memory com adapter projetado** | MVP prioriza tempo. Interfaces no `store` abstraem dados permitindo troca rápida por Postgres com Prisma. |
| **Mensageria** | Kafka, RabbitMQ, BullMQ | **Não implementado no MVP** | Jobs assíncronos entram na fase 2. Estrutura de eventos pensada em `auditLog`. |
| **Busca** | ElasticSearch, MeiliSearch | **Postergado** | MVP usa filtros simples. Interfaces definidas para futura integração. |
| **Autenticação** | Gov.br OAuth, Magic Link | **Token header estático (MVP)** | Facilidade em demonstração. Plano evolutivo previsto em roadmap. |
| **Licenças** | MIT, AGPL-3.0 | **AGPL-3.0 para código, CC-BY 4.0 para conteúdo** | Garante reciprocidade de código e livre circulação de propostas. |

## Camadas
1. **Interface Web** (apps/web): React + Tailwind, React Query para consumo da API.
2. **API Gateway** (apps/api): Express, validações com Zod, armazenamento temporário em memória.
3. **Design System** (packages/ui): biblioteca compartilhável de componentes com tokens de estilo.
4. **Observabilidade**: logs de auditoria expostos via endpoint `/audit`.
5. **Infraestrutura**: Dockerfiles e IaC planejados (fase futura) — pasta `infra/` reserva estrutura.

## Segurança e LGPD
- Coleta mínima: usuários possuem `municipalityCode` e `roles`, sem dados sensíveis.
- Endpoint `/auth/login` simula Gov.br, retornando token que deve ser passado em `x-user-id`.
- Todos os dados trafegam via HTTPS (em produção). Helmet habilita cabeçalhos seguros.
- Votos armazenados anonimizados por ID (MVP) com possibilidade de torná-los públicos via metadata futura.
- Logs auditáveis registram ação, ator, entidade e metadata, permitindo rastreabilidade.

## Estratégia de Evolução
1. Substituir store in-memory por Postgres + Prisma, adicionando migrations e seeds.
2. Implementar autenticação com OAuth Gov.br e verificação municipal.
3. Introduzir métodos de votação adicionais (ranked choice, quadrática) com configuração em `governanceRules`.
4. Integrar motores de busca (MeiliSearch) para indexação full-text.
5. Adicionar pipelines CI/CD (GitHub Actions) para build/test/deploy automatizado.
6. Instrumentar OpenTelemetry e Prometheus para métricas de tempo de resposta e uso.

## Critérios de Qualidade
- Cobertura de testes mínima 80% (planejado). MVP inclui estrutura para Vitest.
- Acessibilidade: contraste alto, navegação por teclado, foco visível.
- Performance: Vite + lazy data fetching. Assets otimizados.

## Requisitos Não Funcionais
- **Escalabilidade**: arquitetura modular, API stateless, facilmente containerizável.
- **Manutenibilidade**: TypeScript end-to-end, lint configurável, store centralizada.
- **Transparência**: `auditLogs` acessíveis publicamente, diffs preservados.

## Dependências Externas
- `nanoid` para identificadores únicos.
- `zod` para validação.
- `react-query` e `axios` para consumo da API.
- `react-markdown` para renderização do README.

## Roadmap (Resumo)
- Semana 1: Discovery, refinamento de requisitos (concluído neste plano).
- Semanas 2–3: Persistência, autenticação, CRUD completo com Postgres.
- Semana 4: Módulo de votação completo, auditoria robusta, deploy inicial.
- Semanas 5–6: Fork/PR avançado, moderação, dashboards públicos.
- Semana 7+: Métodos de votação, Gov.br, PWA/mobile.
