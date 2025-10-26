# Democracia Direta

Plataforma cívica inspirada em fluxos de código aberto (forks, pull requests, issues) para construção colaborativa de políticas públicas municipais.

## Estrutura do Monorepo
- `apps/api`: API REST em Node.js/Express (TypeScript) com armazenamento em memória e trilha de auditoria.
- `apps/web`: Interface React (Vite + Tailwind) que reproduz experiência à la GitHub.
- `packages/ui`: Design system compartilhado com componentes básicos.
- `docs/`: Plano técnico, backlog priorizado, arquitetura e instruções do MVP.
- `infra/`: Espaço reservado para scripts de IaC e deployment.

## Como executar
Siga as instruções detalhadas em [`docs/mvp.md`](docs/mvp.md).

## Licenças
- Código-fonte: [AGPL-3.0](LICENSE-AGPL.md)
- Conteúdo das propostas: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Roadmap
Confira [`docs/plano-tecnico.md`](docs/plano-tecnico.md) e [`docs/backlog.md`](docs/backlog.md).
