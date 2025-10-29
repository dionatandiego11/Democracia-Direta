# Modelo de Dados (resumo)

Entidades principais (ver `packages/db/prisma/schema.prisma`):
- `User`: membro do partido
- `OrgUnit`: árvore organizacional (Nacional/Estadual/Municipal/Núcleo)
- `Membership`: vínculo usuário ↔ unidade com `role`
- `Proposal`: proposta com status e versões
- `ProposalVersion`: conteúdo versionado (markdown)
- `Issue`/`Comment`: debates e discussões
- `PullRequest`/`ReviewVote`: contribuições e revisão (like/dislike + justificativa)
- `VoteSession`/`Vote`: módulos de votação com regras (`VoteRule`)
- `AuditLog`: trilha de auditoria de ações

Regras de votação (exemplos):
- `ONE_MEMBER_ONE_VOTE`: peso 1 por membro apto
- `WEIGHT_BY_ROLE`: pesos por `Role`
- `WEIGHT_BY_DELEGATE`: pesos por delegação cadastrada

Indices/uniqueness:
- `OrgUnit.slug` único
- `Proposal` único por `orgUnitId + slug`
- `ProposalVersion` único por `proposalId + version`
- `ReviewVote` único por `prId + userId`
- `Vote` único por `sessionId + userId`

