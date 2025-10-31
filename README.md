# 🗳️ Democracia-Direta - Guia de Setup Completo

# 🗳️ Democracia-Direta

**Plataforma de governança interna para partidos políticos**, inspirada no fluxo do GitHub e na filosofia Open Source. Permite propor, debater, versionar e votar ideias, programas e decisões de forma transparente e colaborativa.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

---

## 📑 Índice

- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#️-arquitetura)
- [Setup Rápido](#-setup-rápido-5-minutos)
- [Documentação](#-documentação)
- [Desenvolvimento](#️-desenvolvimento)
- [Contribuindo](#-contribuindo)

---

## ✨ Funcionalidades

### 🏛️ Governança Democrática
- **Propostas versionadas** como repositórios Git
- **Issues e Pull Requests** para discussões e melhorias
- **Sistema de votação** com múltiplas regras (simples, ponderada, delegada)
- **Auditoria completa** de todas as ações

### 👥 Organização Hierárquica
- **Estrutura federada**: Nacional → Estadual → Municipal → Núcleos Temáticos
- **Permissões por papel**: Filiado, Coordenador, Diretor, Executivo
- **Delegação de voto** configurável

### 📊 Transparência
- **Histórico completo** de todas as alterações
- **Dashboards** de participação e engajamento
- **Visualização de diferenças** (diff viewer)
- **Logs de auditoria** públicos

### 🔐 Segurança
- Autenticação preparada para **gov.br** (OIDC)
- **Autorização em camadas** (papel + unidade)
- Trilha de auditoria imutável

---

## 🏗️ Arquitetura

```
democracia-direta/
├── apps/
│   ├── api/              # Backend Node.js (Express + Prisma)
│   ├── web/              # Frontend Web (Next.js 14)
│   └── mobile/           # App Mobile (React Native/Expo)
├── packages/
│   ├── db/               # Prisma schema e cliente
│   └── types/            # Tipos TypeScript compartilhados
├── infra/
│   └── docker-compose.yml  # PostgreSQL
├── docs/                 # Documentação
└── Makefile             # Comandos úteis
```

### Stack Tecnológica

**Backend:**
- Node.js 18+ com TypeScript
- Express.js
- Prisma ORM
- PostgreSQL 16
- GraphQL (schema definido)

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules

**Mobile:**
- React Native
- Expo

**Infra:**
- Docker & Docker Compose
- pnpm (monorepo)
- Turbo (build system)

---

## 🚀 Setup Rápido (5 minutos)

### Pré-requisitos

```bash
# Instale primeiro:
node -v        # 18+
pnpm -v        # 9+
docker -v      # Qualquer versão recente
```

### Instalação Automatizada

```bash
# Clone o repositório
git clone <seu-repo>
cd democracia-direta

# Execute o script de setup
bash setup.sh

# OU use o Makefile
make setup
```

### Instalação Manual

<details>
<summary>Clique para expandir</summary>

#### 1. Instale dependências
```bash
pnpm install
```

#### 2. Configure variáveis de ambiente
```bash
# API
cp apps/api/.env.example apps/api/.env

# Database
cp packages/db/.env.example packages/db/.env

# Web
cp apps/web/.env.local.example apps/web/.env.local
```

#### 3. Inicie o PostgreSQL
```bash
docker compose -f infra/docker-compose.yml up -d
```

#### 4. Configure o banco
```bash
# Gere o Prisma Client
pnpm -C packages/db prisma:generate

# Execute migrações
pnpm -C packages/db prisma migrate dev --name init

# Popule com dados de exemplo
pnpm -C packages/db seed
```

#### 5. Inicie os serviços

**Terminal 1 - API:**
```bash
pnpm -C apps/api dev
# ou: make api
```

**Terminal 2 - Web:**
```bash
pnpm -C apps/web dev
# ou: make web
```

</details>

### ✅ Verifique a Instalação

```bash
# Teste a API
curl http://localhost:4000/health
# Resposta: {"ok":true}

# Acesse a Web
open http://localhost:3000
```

---

## 📖 Documentação

### Estrutura

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Visão geral da arquitetura
- **[DATA_MODEL.md](docs/DATA_MODEL.md)** - Modelo de dados detalhado
- **[API.md](docs/API.md)** - Endpoints da API REST
- **[ROADMAP.md](docs/ROADMAP.md)** - Planejamento e próximos passos

### Modelo de Dados Resumido

```
User (Usuário)
  ↓ Membership
OrgUnit (Unidade Organizacional)
  ↓ Proposal (Proposta)
    ↓ ProposalVersion (Versões)
    ↓ Issue (Discussões)
    ↓ PullRequest (Contribuições)
  ↓ VoteSession (Votação)
    ↓ Vote (Votos individuais)
```

### Endpoints Principais

```
GET  /health                   # Status da API
POST /auth/login               # Login (placeholder)
GET  /proposals                # Listar propostas
POST /proposals                # Criar proposta
GET  /proposals/:id            # Detalhes da proposta
GET  /votes/sessions           # Listar votações
POST /votes/sessions           # Criar votação
```

---

## 🛠️ Desenvolvimento

### Comandos do Makefile

```bash
make help              # Lista todos os comandos
make setup             # Setup inicial completo
make dev               # Inicia todos os serviços
make api               # Inicia apenas API
make web               # Inicia apenas Web
make db-studio         # Abre Prisma Studio
make db-reset          # Reseta banco de dados
make clean             # Limpa cache e builds
make check             # Verifica se está tudo funcionando
```

### Comandos pnpm

```bash
# Geral
pnpm install           # Instala dependências
pnpm dev               # Roda tudo com Turbo
pnpm build             # Build de produção
pnpm lint              # Executa linter
pnpm format            # Formata código

# API
pnpm -C apps/api dev          # Dev server
pnpm -C apps/api build        # Build produção
pnpm -C apps/api start        # Start produção

# Web
pnpm -C apps/web dev          # Dev server
pnpm -C apps/web build        # Build produção
pnpm -C apps/web start        # Start produção

# Database
pnpm -C packages/db prisma:generate   # Gera client
pnpm -C packages/db prisma:migrate    # Cria migração
pnpm -C packages/db prisma:studio     # GUI do banco
pnpm -C packages/db seed              # Popula dados
```

### Banco de Dados

#### Prisma Studio (GUI)
```bash
make db-studio
# ou: pnpm -C packages/db prisma studio
# Abre em: http://localhost:5555
```

#### Criar migração
```bash
make db-migrate
# ou: pnpm -C packages/db prisma migrate dev --name nome_da_migracao
```

#### Resetar banco (CUIDADO!)
```bash
make db-reset
# Remove todos os dados e recria com seed
```

### Usuários de Teste

Após o seed, você terá:

| Email | Papel | Unidade |
|-------|-------|---------|
| admin@partido.br | Executivo Nacional | Nacional |
| coord.sp@partido.br | Coordenador | SP |
| coord.rj@partido.br | Coordenador | RJ |
| ana.silva@partido.br | Filiada | SP |
| joao.santos@partido.br | Filiado | SP Capital |
| maria.costa@partido.br | Filiada | Núcleo Ambiental |

---

## 🎯 Páginas da Interface

- **/** - Home
- **/propostas** - Lista de propostas
- **/propostas/nova** - Criar proposta
- **/propostas/:id** - Detalhes da proposta
- **/votacoes** - Sessões de votação
- **/dashboard** - Dashboard de governança
- **/diff** - Visualizador de diferenças
- **/login** - Login (placeholder)

---

## 🧪 Testando

### Teste Manual via cURL

```bash
# Health check
curl http://localhost:4000/health

# Listar propostas
curl http://localhost:4000/proposals

# Criar proposta
curl -X POST http://localhost:4000/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "slug": "teste",
    "orgUnitId": "<id-da-org>",
    "authorId": "<id-do-autor>",
    "contentMd": "# Conteúdo"
  }'

# Listar votações
curl http://localhost:4000/votes/sessions
```

### Teste via Prisma Studio

```bash
make db-studio
```

Navegue pelo banco visualmente e edite dados.

---

## 🐛 Troubleshooting

### Porta já em uso
```bash
# Verificar portas em uso
make port-check

# Matar processo na porta 4000 (API)
lsof -ti:4000 | xargs kill -9

# Matar processo na porta 3000 (Web)
lsof -ti:3000 | xargs kill -9
```

### Erro de conexão com banco
```bash
# Verificar se Docker está rodando
docker ps

# Reiniciar PostgreSQL
make db-down
make db-up
```

### Erro no Prisma
```bash
# Regenerar client
pnpm -C packages/db prisma:generate

# Verificar status das migrações
pnpm -C packages/db prisma migrate status

# Resetar (última opção)
make db-reset
```

### Limpar tudo e começar do zero
```bash
make clean-all
make setup
```

---

## 🗺️ Roadmap

### ✅ MVP (Atual)
- [x] Autenticação básica (placeholder)
- [x] CRUD de Propostas + Versões
- [x] Issues + Comentários
- [x] Pull Requests + Reviews
- [x] Sessão de Voto simples
- [x] Auditoria de ações
- [x] Interface Web básica

### 🚧 V1 (Próximo)
- [ ] Autenticação OIDC (gov.br)
- [ ] Autorização por papel/unidade
- [ ] Pesos de voto configuráveis
- [ ] GraphQL API
- [ ] WebSockets (notificações real-time)
- [ ] Dashboards avançados
- [ ] App Mobile funcional
- [ ] Testes automatizados

### 🔮 V2 (Futuro)
- [ ] Federação entre diretórios
- [ ] Smart contracts (auditoria blockchain)
- [ ] Sistema de badges e reputação
- [ ] Wiki colaborativa
- [ ] Módulo de delegação líquida
- [ ] Exportação de relatórios
- [ ] Integração com e-voting certificado

Ver [ROADMAP.md](docs/ROADMAP.md) completo.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Este projeto segue os princípios de democracia e transparência.

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes

- Siga o estilo de código existente
- Adicione testes quando possível
- Documente mudanças significativas
- Use commits semânticos

---

## 📄 Licença

Este projeto está sob a licença MIT. Ver [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- **Issues**: Use o [issue tracker](issues)
- **Discussões**: Use [discussions](discussions)
- **Documentação**: Ver pasta `/docs`

---

## 🙏 Agradecimentos

Inspirado por:
- **GitHub** - Fluxo de trabalho colaborativo
- **GitLab** - Funcionalidades de governança
- **Liquid Democracy** - Delegação de voto
- **Open Source** - Transparência e colaboração

---

**Construído com ❤️ para democracia e transparência**