import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional)
  await prisma.auditLog.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.voteSession.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reviewVote.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.proposalVersion.deleteMany();
  await prisma.proposalLabel.deleteMany();
  await prisma.label.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.orgUnit.deleteMany();

  // 1. Criar Unidades Organizacionais
  console.log('📍 Criando unidades organizacionais...');
  
  const nacional = await prisma.orgUnit.create({
    data: {
      name: 'Diretório Nacional',
      slug: 'nacional',
      level: 'NATIONAL',
      code: 'BR'
    }
  });

  const sp = await prisma.orgUnit.create({
    data: {
      name: 'Diretório Estadual SP',
      slug: 'sp',
      level: 'STATE',
      code: 'SP',
      parentId: nacional.id
    }
  });

  const rj = await prisma.orgUnit.create({
    data: {
      name: 'Diretório Estadual RJ',
      slug: 'rj',
      level: 'STATE',
      code: 'RJ',
      parentId: nacional.id
    }
  });

  const spCapital = await prisma.orgUnit.create({
    data: {
      name: 'Diretório Municipal SP Capital',
      slug: 'sp-capital',
      level: 'MUNICIPAL',
      code: 'SP-SAO-PAULO',
      parentId: sp.id
    }
  });

  const tematico = await prisma.orgUnit.create({
    data: {
      name: 'Núcleo Temático - Meio Ambiente',
      slug: 'meio-ambiente',
      level: 'THEMATIC',
      code: 'THEME-ENV',
      parentId: nacional.id
    }
  });

  // 2. Criar Usuários
  console.log('👥 Criando usuários...');
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@partido.br',
      name: 'Administrador Nacional',
      documentId: 'admin-hash-123'
    }
  });

  const coordSP = await prisma.user.create({
    data: {
      email: 'coord.sp@partido.br',
      name: 'Coordenador SP'
    }
  });

  const coordRJ = await prisma.user.create({
    data: {
      email: 'coord.rj@partido.br',
      name: 'Coordenadora RJ'
    }
  });

  const filiado1 = await prisma.user.create({
    data: {
      email: 'ana.silva@partido.br',
      name: 'Ana Silva'
    }
  });

  const filiado2 = await prisma.user.create({
    data: {
      email: 'joao.santos@partido.br',
      name: 'João Santos'
    }
  });

  const filiado3 = await prisma.user.create({
    data: {
      email: 'maria.costa@partido.br',
      name: 'Maria Costa'
    }
  });

  // 3. Criar Memberships
  console.log('🔗 Criando associações...');
  
  await prisma.membership.createMany({
    data: [
      {
        userId: admin.id,
        orgUnitId: nacional.id,
        role: 'EXECUTIVO_NACIONAL',
        active: true
      },
      {
        userId: coordSP.id,
        orgUnitId: sp.id,
        role: 'COORDENADOR',
        active: true
      },
      {
        userId: coordRJ.id,
        orgUnitId: rj.id,
        role: 'COORDENADOR',
        active: true
      },
      {
        userId: filiado1.id,
        orgUnitId: sp.id,
        role: 'FILIADO',
        active: true
      },
      {
        userId: filiado2.id,
        orgUnitId: spCapital.id,
        role: 'FILIADO',
        active: true
      },
      {
        userId: filiado3.id,
        orgUnitId: tematico.id,
        role: 'FILIADO',
        active: true
      }
    ]
  });

  // 4. Criar Labels
  console.log('🏷️ Criando labels...');
  
  const labels = await prisma.label.createMany({
    data: [
      { name: 'bug', color: '#d73a4a', orgUnitId: nacional.id },
      { name: 'enhancement', color: '#a2eeef', orgUnitId: nacional.id },
      { name: 'documentation', color: '#0075ca', orgUnitId: nacional.id },
      { name: 'urgente', color: '#ff0000', orgUnitId: nacional.id },
      { name: 'consenso', color: '#00ff00', orgUnitId: nacional.id }
    ]
  });

  // 5. Criar Propostas
  console.log('📝 Criando propostas...');
  
  const proposta1 = await prisma.proposal.create({
    data: {
      title: 'Reforma do Estatuto - Capítulo 3',
      slug: 'reforma-estatuto-cap3',
      orgUnitId: nacional.id,
      authorId: admin.id,
      status: 'OPEN',
      versions: {
        create: {
          version: 1,
          contentMd: `# Reforma do Estatuto - Capítulo 3

## Artigo 3º - Dos Direitos dos Filiados

Todo filiado tem direito a:
- Participar de decisões internas através de propostas e votações
- Votar em todas as consultas de sua unidade organizacional
- Apresentar propostas e emendas aos documentos do partido
- Delegar seu voto quando impossibilitado de participar
- Acesso transparente a todas as decisões e documentos

## Artigo 4º - Dos Deveres

São deveres do filiado:
- Respeitar o estatuto e código de conduta da organização
- Contribuir ativamente com a organização e suas propostas
- Participar das deliberações sempre que possível
- Manter suas informações de cadastro atualizadas
- Zelar pela democracia interna e transparência`,
          createdById: admin.id
        }
      }
    }
  });

  const proposta2 = await prisma.proposal.create({
    data: {
      title: 'Programa de Mobilidade Urbana Sustentável',
      slug: 'mobilidade-urbana-sp',
      orgUnitId: sp.id,
      authorId: coordSP.id,
      status: 'OPEN',
      versions: {
        create: {
          version: 1,
          contentMd: `# Programa de Mobilidade Urbana Sustentável

## Objetivo
Propor diretrizes para mobilidade urbana sustentável no estado de São Paulo.

## Diretrizes

### 1. Transporte Público
- Expansão do metrô e trem metropolitano
- Integração tarifária entre modais
- Corredores de ônibus elétricos

### 2. Mobilidade Ativa
- Ciclovias seguras e integradas
- Calçadas acessíveis
- Zonas de baixa velocidade em áreas residenciais

### 3. Tecnologia
- App unificado de mobilidade
- Pagamento digital integrado
- Dados abertos de transporte`,
          createdById: coordSP.id
        }
      }
    }
  });

  const proposta3 = await prisma.proposal.create({
    data: {
      title: 'Política de Proteção Ambiental',
      slug: 'protecao-ambiental',
      orgUnitId: tematico.id,
      authorId: filiado3.id,
      status: 'DRAFT',
      versions: {
        create: {
          version: 1,
          contentMd: `# Política de Proteção Ambiental

## Contexto
Proposta de diretrizes para proteção ambiental em nível nacional.

## Eixos Principais

1. **Preservação de Biomas**
2. **Economia Circular**
3. **Energias Renováveis**
4. **Educação Ambiental**

*(Documento em elaboração)*`,
          createdById: filiado3.id
        }
      }
    }
  });

  // 6. Criar Issues
  console.log('🐛 Criando issues...');
  
  const issue1 = await prisma.issue.create({
    data: {
      proposalId: proposta1.id,
      authorId: filiado1.id,
      title: 'Definir critérios para delegação de voto',
      body: 'Precisamos especificar melhor os critérios e limites para delegação de voto entre filiados.',
      status: 'OPEN'
    }
  });

  const issue2 = await prisma.issue.create({
    data: {
      proposalId: proposta2.id,
      authorId: filiado2.id,
      title: 'Adicionar seção sobre transporte ferroviário',
      body: 'Sugiro incluir diretrizes específicas sobre expansão ferroviária para cidades médias.',
      status: 'OPEN'
    }
  });

  // 7. Criar Comentários
  console.log('💬 Criando comentários...');
  
  await prisma.comment.createMany({
    data: [
      {
        issueId: issue1.id,
        authorId: coordSP.id,
        body: 'Concordo! Sugiro limitarmos delegações a no máximo 3 votos por pessoa.'
      },
      {
        issueId: issue1.id,
        authorId: admin.id,
        body: 'Boa sugestão. Vou abrir um PR com essa alteração.'
      },
      {
        issueId: issue2.id,
        authorId: coordSP.id,
        body: 'Excelente ponto. Vou incorporar isso na próxima versão.'
      }
    ]
  });

  // 8. Criar Pull Request
  console.log('🔀 Criando pull requests...');
  
  const pr1 = await prisma.pullRequest.create({
    data: {
      fromProposalId: proposta2.id,
      toProposalId: proposta1.id,
      title: 'Adiciona referência cruzada ao programa de mobilidade',
      description: 'Este PR adiciona uma referência ao programa de mobilidade urbana no estatuto.',
      status: 'OPEN',
      createdById: coordSP.id
    }
  });

  // 9. Criar Reviews
  console.log('⭐ Criando reviews...');
  
  await prisma.reviewVote.createMany({
    data: [
      {
        prId: pr1.id,
        userId: admin.id,
        value: 'LIKE',
        reason: 'Ótima integração entre os documentos!'
      },
      {
        prId: pr1.id,
        userId: filiado1.id,
        value: 'LIKE',
        reason: 'Apoio totalmente esta mudança.'
      }
    ]
  });

  // 10. Criar Sessões de Votação
  console.log('🗳️ Criando sessões de votação...');
  
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const sessao1 = await prisma.voteSession.create({
    data: {
      orgUnitId: nacional.id,
      title: 'Aprovação do Orçamento 2025',
      scope: 'PROPOSAL',
      subjectId: proposta1.id,
      rule: 'ONE_MEMBER_ONE_VOTE',
      round: 'FIRST_READING',
      startsAt: now,
      endsAt: in7Days,
      createdById: admin.id,
      quorum: 50,
      threshold: 60
    }
  });

  const sessao2 = await prisma.voteSession.create({
    data: {
      orgUnitId: sp.id,
      title: 'Programa de Mobilidade - Primeira Leitura',
      scope: 'PROPOSAL',
      subjectId: proposta2.id,
      rule: 'WEIGHT_BY_ROLE',
      round: 'FIRST_READING',
      startsAt: now,
      endsAt: in14Days,
      createdById: coordSP.id,
      quorum: 40,
      threshold: 50
    }
  });

  // 11. Criar Votos
  console.log('✅ Criando votos...');
  
  await prisma.vote.createMany({
    data: [
      {
        sessionId: sessao1.id,
        userId: admin.id,
        choice: 'YES',
        weight: 1,
        justification: 'Aprovado pela diretoria executiva.'
      },
      {
        sessionId: sessao1.id,
        userId: coordSP.id,
        choice: 'YES',
        weight: 1,
        justification: 'Apoio integral ao orçamento proposto.'
      },
      {
        sessionId: sessao1.id,
        userId: filiado1.id,
        choice: 'YES',
        weight: 1
      },
      {
        sessionId: sessao2.id,
        userId: coordSP.id,
        choice: 'YES',
        weight: 2,
        justification: 'Como autor, defendo esta proposta.'
      },
      {
        sessionId: sessao2.id,
        userId: filiado1.id,
        choice: 'YES',
        weight: 1
      },
      {
        sessionId: sessao2.id,
        userId: filiado2.id,
        choice: 'ABSTAIN',
        weight: 1,
        justification: 'Preciso estudar melhor o impacto financeiro.'
      }
    ]
  });

  // 12. Criar Audit Logs
  console.log('📋 Criando audit logs...');
  
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: 'CREATE_PROPOSAL',
        target: `Proposal:${proposta1.id}`,
        metadata: { title: proposta1.title }
      },
      {
        actorId: coordSP.id,
        action: 'CREATE_PROPOSAL',
        target: `Proposal:${proposta2.id}`,
        metadata: { title: proposta2.title }
      },
      {
        actorId: admin.id,
        action: 'CREATE_VOTE_SESSION',
        target: `VoteSession:${sessao1.id}`,
        metadata: { title: sessao1.title }
      },
      {
        actorId: coordSP.id,
        action: 'CREATE_PULL_REQUEST',
        target: `PullRequest:${pr1.id}`,
        metadata: { title: pr1.title }
      }
    ]
  });

  // 13. Criar Reputações
  console.log('🏆 Criando reputações...');
  
  await prisma.userReputation.createMany({
    data: [
      {
        userId: admin.id,
        points: 890,
        proposalsCreated: 23,
        votesParticipated: 156,
        commentsPosted: 87,
        consensusBuilt: 12
      },
      {
        userId: coordSP.id,
        points: 745,
        proposalsCreated: 18,
        votesParticipated: 142,
        commentsPosted: 65,
        consensusBuilt: 9
      },
      {
        userId: filiado1.id,
        points: 680,
        proposalsCreated: 15,
        votesParticipated: 138,
        commentsPosted: 92,
        consensusBuilt: 7
      }
    ]
  });

  console.log('');
  console.log('✅ Seed completo com sucesso!');
  console.log('');
  console.log('📊 Resumo:');
  console.log(`- ${await prisma.orgUnit.count()} unidades organizacionais`);
  console.log(`- ${await prisma.user.count()} usuários`);
  console.log(`- ${await prisma.proposal.count()} propostas`);
  console.log(`- ${await prisma.issue.count()} issues`);
  console.log(`- ${await prisma.pullRequest.count()} pull requests`);
  console.log(`- ${await prisma.voteSession.count()} sessões de votação`);
  console.log(`- ${await prisma.vote.count()} votos registrados`);
  console.log('');
  console.log('👤 Usuários de teste:');
  console.log('- admin@partido.br (Executivo Nacional)');
  console.log('- coord.sp@partido.br (Coordenador SP)');
  console.log('- coord.rj@partido.br (Coordenadora RJ)');
  console.log('- ana.silva@partido.br (Filiada SP)');
  console.log('- joao.santos@partido.br (Filiado SP Capital)');
  console.log('- maria.costa@partido.br (Filiada Núcleo Ambiental)');
  console.log('');
  console.log('🚀 Sistema pronto para uso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });