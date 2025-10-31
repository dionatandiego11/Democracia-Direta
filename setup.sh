#!/bin/bash

# Script de Setup Automático - Democracia-Direta
# Execute com: bash setup.sh

set -e  # Para na primeira erro

echo "🗳️  Democracia-Direta - Setup Automático"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções helper
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_step() {
    echo ""
    echo -e "${YELLOW}→${NC} $1"
}

# Verificar pré-requisitos
print_step "Verificando pré-requisitos..."

command -v node >/dev/null 2>&1 || {
    print_error "Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
}
print_success "Node.js $(node -v)"

command -v pnpm >/dev/null 2>&1 || {
    print_error "pnpm não encontrado. Instale com: npm install -g pnpm"
    exit 1
}
print_success "pnpm $(pnpm -v)"

command -v docker >/dev/null 2>&1 || {
    print_error "Docker não encontrado. Instale em: https://docker.com"
    exit 1
}
print_success "Docker instalado"

command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1 || {
    print_error "Docker Compose não encontrado"
    exit 1
}
print_success "Docker Compose instalado"

# Instalar dependências
print_step "Instalando dependências..."
pnpm install
print_success "Dependências instaladas"

# Configurar variáveis de ambiente
print_step "Configurando variáveis de ambiente..."

# API
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    print_success "Criado apps/api/.env"
else
    print_warning "apps/api/.env já existe (pulando)"
fi

# Database
if [ ! -f "packages/db/.env" ]; then
    cp packages/db/.env.example packages/db/.env
    print_success "Criado packages/db/.env"
else
    print_warning "packages/db/.env já existe (pulando)"
fi

# Web
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.local.example apps/web/.env.local
    print_success "Criado apps/web/.env.local"
else
    print_warning "apps/web/.env.local já existe (pulando)"
fi

# Iniciar Docker
print_step "Iniciando PostgreSQL..."
cd infra
if docker compose ps | grep -q "Up"; then
    print_warning "PostgreSQL já está rodando"
else
    docker compose up -d
    print_success "PostgreSQL iniciado"
    echo "Aguardando PostgreSQL ficar pronto..."
    sleep 5
fi
cd ..

# Gerar Prisma Client
print_step "Gerando Prisma Client..."
pnpm -C packages/db prisma:generate
print_success "Prisma Client gerado"

# Executar migrações
print_step "Executando migrações do banco..."
pnpm -C packages/db prisma migrate dev --name init --skip-seed
print_success "Migrações executadas"

# Seed do banco
print_step "Populando banco de dados..."
pnpm -C packages/db seed
print_success "Banco populado com dados de exemplo"

# Finalização
echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo "========================================"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Inicie a API (Terminal 1):"
echo "   cd apps/api && pnpm dev"
echo ""
echo "2. Inicie a Web (Terminal 2):"
echo "   cd apps/web && pnpm dev"
echo ""
echo "3. Acesse o sistema:"
echo "   - Web: http://localhost:3000"
echo "   - API: http://localhost:4000"
echo "   - Prisma Studio: pnpm -C packages/db prisma studio"
echo ""
echo "👤 Usuários de teste:"
echo "   - admin@partido.br (Executivo Nacional)"
echo "   - coord.sp@partido.br (Coordenador SP)"
echo "   - ana.silva@partido.br (Filiada)"
echo ""
echo "📚 Documentação:"
echo "   - README.md"
echo "   - docs/ARCHITECTURE.md"
echo "   - docs/API.md"
echo ""