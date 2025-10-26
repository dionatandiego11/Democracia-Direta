import { nanoid } from 'nanoid';
import type {
  AuditLog,
  Branch,
  Commit,
  GovernanceRule,
  Issue,
  Proposal,
  ProposalDetail,
  PullRequest,
  User,
  Vote
} from './types.js';

interface ProposalCollections {
  proposal: Proposal;
  branches: Branch[];
  commits: Commit[];
  pullRequests: PullRequest[];
  issues: Issue[];
  votes: Vote[];
}

interface SeedData {
  users: User[];
  proposals: ProposalCollections[];
  governanceRules: GovernanceRule[];
}

const seedReadme = `# Programa Ruas Vivas\n\n## Objetivo\nReduzir velocidades em vias centrais e ampliar áreas de convivência.\n\n## Medidas\n- Implantar ciclofaixas temporárias\n- Criar parklets\n- Fiscalização compartilhada\n\n## Indicadores\n- Variação no número de acidentes\n- Percepção de segurança via pesquisa com moradores`;

const seedData: SeedData = {
  users: [
    {
      id: 'u-maria',
      name: 'Maria Silva',
      municipalityCode: '3550308',
      roles: ['citizen'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'u-joao',
      name: 'João Souza',
      municipalityCode: '3550308',
      roles: ['citizen', 'maintainer'],
      createdAt: new Date().toISOString()
    }
  ],
  proposals: [],
  governanceRules: [
    {
      id: 'rule-municipal-default',
      scope: 'municipality',
      jsonConfig: {
        municipalityCode: '3550308',
        quorum: 0.1,
        votingWindowDays: 7,
        votingMethod: 'approval'
      }
    }
  ]
};

const collections = seedData.proposals;
const auditLogs: AuditLog[] = [];

function createAuditLog (actorId: string, action: string, entity: string, entityId: string, metadata: Record<string, unknown> = {}): void {
  auditLogs.push({
    id: nanoid(),
    actorId,
    action,
    entity,
    entityId,
    metadata,
    createdAt: new Date().toISOString()
  });
}

function createProposalInternal (proposalInput: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'> & { authorId: string }): ProposalCollections {
  const now = new Date().toISOString();
  const proposal: Proposal = {
    ...proposalInput,
    id: nanoid(),
    createdAt: now,
    updatedAt: now
  };
  const branch: Branch = {
    id: nanoid(),
    proposalId: proposal.id,
    name: 'main',
    headCommitId: '',
    createdAt: now
  };
  const commit: Commit = {
    id: nanoid(),
    branchId: branch.id,
    message: 'Versão inicial',
    parentCommitId: undefined,
    readmeMd: proposal.readmeMd,
    diffSummary: 'Criação da proposta',
    authorId: proposal.authorId,
    createdAt: now
  };
  branch.headCommitId = commit.id;
  const collection: ProposalCollections = {
    proposal,
    branches: [branch],
    commits: [commit],
    pullRequests: [],
    issues: [],
    votes: []
  };
  collections.push(collection);
  createAuditLog(proposal.authorId, 'proposal.created', 'proposal', proposal.id, { title: proposal.title });
  return collection;
}

if (collections.length === 0) {
  createProposalInternal({
    slug: 'programa-ruas-vivas',
    title: 'Programa Ruas Vivas',
    summary: 'Plano de mobilidade ativa para o centro da cidade',
    readmeMd: seedReadme,
    tags: ['mobilidade', 'seguranca'],
    authorId: 'u-maria',
    status: 'voting',
    municipalityCode: '3550308'
  });
}

export function listProposals (filters: { status?: string; tag?: string; q?: string; municipalityCode?: string }): Proposal[] {
  return collections
    .filter(({ proposal }) => {
      if (filters.status != null && proposal.status !== filters.status) return false;
      if (filters.tag != null && !proposal.tags.includes(filters.tag)) return false;
      if (filters.municipalityCode != null && proposal.municipalityCode !== filters.municipalityCode) return false;
      if (filters.q != null && !proposal.title.toLowerCase().includes(filters.q.toLowerCase()) && !proposal.summary.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    })
    .map(({ proposal }) => proposal);
}

export function getProposalBySlug (slug: string): ProposalCollections | undefined {
  return collections.find(({ proposal }) => proposal.slug === slug);
}

export function createProposal (input: { slug: string; title: string; summary: string; readmeMd: string; tags: string[]; authorId: string; municipalityCode: string }): ProposalCollections {
  const collection = createProposalInternal({
    ...input,
    status: 'draft'
  });
  return collection;
}

export function createBranch (proposal: ProposalCollections, name: string, actorId: string, fromBranchId?: string): Branch {
  const now = new Date().toISOString();
  const baseBranch = fromBranchId != null
    ? proposal.branches.find((branch) => branch.id === fromBranchId)
    : proposal.branches.find((branch) => branch.name === 'main');
  if (baseBranch == null) {
    throw new Error('Branch base não encontrada');
  }
  const branch: Branch = {
    id: nanoid(),
    proposalId: proposal.proposal.id,
    name,
    headCommitId: baseBranch.headCommitId,
    createdAt: now
  };
  proposal.branches.push(branch);
  createAuditLog(actorId, 'branch.created', 'branch', branch.id, { name, fromBranchId: baseBranch.id });
  return branch;
}

export function createCommit (proposal: ProposalCollections, branchId: string, authorId: string, message: string, readmeMd: string): Commit {
  const branch = proposal.branches.find((b) => b.id === branchId);
  if (branch == null) {
    throw new Error('Branch não encontrada');
  }
  const now = new Date().toISOString();
  const parentCommit = proposal.commits.find((commit) => commit.id === branch.headCommitId);
  const commit: Commit = {
    id: nanoid(),
    branchId,
    parentCommitId: parentCommit?.id,
    message,
    readmeMd,
    diffSummary: summarizeDiff(parentCommit?.readmeMd ?? '', readmeMd),
    authorId,
    createdAt: now
  };
  proposal.commits.push(commit);
  branch.headCommitId = commit.id;
  proposal.proposal.updatedAt = now;
  createAuditLog(authorId, 'commit.created', 'commit', commit.id, { proposalId: proposal.proposal.id, branchId });
  return commit;
}

function summarizeDiff (before: string, after: string): string {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const added = afterLines.filter(line => !beforeLines.includes(line)).length;
  const removed = beforeLines.filter(line => !afterLines.includes(line)).length;
  const parts: string[] = [];
  if (added > 0) parts.push(`+${added}`);
  if (removed > 0) parts.push(`-${removed}`);
  return parts.join(' ');
}

export function createPullRequest (proposal: ProposalCollections, input: { fromBranchId: string; toBranchId: string; title: string; description: string; actorId: string }): PullRequest {
  const now = new Date().toISOString();
  const pr: PullRequest = {
    id: nanoid(),
    proposalId: proposal.proposal.id,
    fromBranchId: input.fromBranchId,
    toBranchId: input.toBranchId,
    title: input.title,
    description: input.description,
    status: 'open',
    createdAt: now
  };
  proposal.pullRequests.push(pr);
  createAuditLog(input.actorId, 'pull_request.opened', 'pull_request', pr.id, { title: pr.title });
  return pr;
}

export function mergePullRequest (proposal: ProposalCollections, pullRequestId: string, actorId: string): PullRequest {
  const pr = proposal.pullRequests.find((item) => item.id === pullRequestId);
  if (pr == null) throw new Error('Pull request não encontrado');
  if (pr.status !== 'open') throw new Error('Pull request não está aberto');

  const fromBranch = proposal.branches.find((b) => b.id === pr.fromBranchId);
  const toBranch = proposal.branches.find((b) => b.id === pr.toBranchId);
  if (fromBranch == null || toBranch == null) throw new Error('Branches inválidas');

  toBranch.headCommitId = fromBranch.headCommitId;
  pr.status = 'merged';
  pr.mergedAt = new Date().toISOString();
  createAuditLog(actorId, 'pull_request.merged', 'pull_request', pr.id, {});
  proposal.proposal.readmeMd = proposal.commits.find((commit) => commit.id === toBranch.headCommitId)?.readmeMd ?? proposal.proposal.readmeMd;
  proposal.proposal.updatedAt = new Date().toISOString();
  return pr;
}

export function createIssue (proposal: ProposalCollections, input: { authorId: string; title: string; bodyMd: string; labels: string[] }): Issue {
  const now = new Date().toISOString();
  const issue: Issue = {
    id: nanoid(),
    proposalId: proposal.proposal.id,
    authorId: input.authorId,
    title: input.title,
    bodyMd: input.bodyMd,
    labels: input.labels,
    status: 'open',
    createdAt: now
  };
  proposal.issues.push(issue);
  createAuditLog(input.authorId, 'issue.created', 'issue', issue.id, { title: issue.title });
  return issue;
}

export function registerVote (proposal: ProposalCollections, input: { voterId: string; choice: 'yes' | 'no'; weight?: number }): Vote {
  const now = new Date().toISOString();
  const existing = proposal.votes.find((vote) => vote.voterId === input.voterId);
  if (existing != null) {
    existing.payload.choice = input.choice;
    existing.weight = input.weight ?? 1;
    existing.createdAt = now;
    createAuditLog(input.voterId, 'vote.updated', 'vote', existing.id, { choice: input.choice });
    return existing;
  }
  const vote: Vote = {
    id: nanoid(),
    proposalId: proposal.proposal.id,
    voterId: input.voterId,
    method: 'approval',
    payload: { choice: input.choice },
    weight: input.weight ?? 1,
    createdAt: now
  };
  proposal.votes.push(vote);
  createAuditLog(input.voterId, 'vote.created', 'vote', vote.id, { choice: input.choice });
  return vote;
}

export function getAuditLogs (): AuditLog[] {
  return auditLogs;
}

export function toProposalDetail (collection: ProposalCollections): ProposalDetail {
  return {
    ...collection.proposal,
    branches: collection.branches,
    commits: collection.commits,
    pullRequests: collection.pullRequests,
    issues: collection.issues,
    votes: collection.votes
  };
}

export function listUsers (): User[] {
  return seedData.users;
}

export function getUserById (id: string): User | undefined {
  return seedData.users.find((user) => user.id === id);
}

export function listGovernanceRules (): GovernanceRule[] {
  return seedData.governanceRules;
}
