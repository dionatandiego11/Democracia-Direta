# Arquitetura do MVP

## Diagrama C4 – Visão de Contêiner
```mermaid
C4Container
    title Democracia Direta – MVP
    Person(citizen, "Cidadão", "Participa enviando propostas, PRs, issues e votos")
    Person(visitor, "Visitante", "Consulta propostas e histórico")
    Person(moderator, "Moderador", "Aplica código de conduta")

    Container_Boundary(apps, "Monorepo") {
        Container(web, "Interface Web", "React/Vite", "Consome API, apresenta UI responsiva e acessível")
        Container(api, "API Cívica", "Node + Express", "Gerencia propostas, votações, auditoria")
        Container(design, "Design System", "TypeScript", "Componentes compartilhados e tokens de estilo")
    }

    ContainerDb(memory, "Store em Memória", "TypeScript", "Armazena dados temporários do MVP")

    Rel(citizen, web, "Interage via navegador")
    Rel(visitor, web, "Consulta informações públicas")
    Rel(moderator, web, "Acompanha issues e PRs")
    Rel(web, api, "Requisições REST/JSON", "HTTPS")
    Rel(api, memory, "Persistência in-memory")
```

## Fluxo Principal – Proposta
1. Cidadão autentica-se via `/auth/login`, recebendo token (MVP: ID estático).
2. Cidadão cria proposta enviando título, resumo, README e tags.
3. API gera slug, branch `main` e commit inicial, registrando evento no `auditLog`.
4. Outros cidadãos forkeiam a proposta, criam commits e PRs, alimentando timeline.
5. Issues e votos são anexados ao histórico com auditoria.
6. Interface atualiza contadores e exibe Markdown renderizado.

## Observabilidade
- `auditLog` guarda actor, action, entity, metadata e timestamp.
- Logs podem ser exportados para SIEM no futuro.
- Estrutura preparada para introduzir OpenTelemetry (span wrappers nos controladores).

## Segurança
- Helmet adiciona cabeçalhos (CSP configurável em produção).
- Rate limiting planejado (ex.: `express-rate-limit`).
- Todos os endpoints validados com Zod.

## Escalabilidade Futura
- Substituir store por Postgres: basta adaptar funções em `store.ts` para usar um ORM.
- Filas BullMQ/RabbitMQ para e-mails e tarefas de auditoria pesada.
- Deploy sugerido: containers Docker (API, Web, Postgres, Redis) orquestrados via Kubernetes ou ECS, com IaC (Terraform) na pasta `infra/`.
