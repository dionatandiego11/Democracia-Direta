export type Role = 'citizen' | 'moderator' | 'maintainer' | 'public_official';

export interface User {
  id: string;
  name: string;
  municipalityCode: string;
  roles: Role[];
  createdAt: string;
}

export type ProposalStatus = 'draft' | 'in_review' | 'voting' | 'merged' | 'archived';

export interface Commit {
  id: string;
  branchId: string;
  parentCommitId?: string;
  message: string;
  readmeMd: string;
  diffSummary: string;
  authorId: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  proposalId: string;
  name: string;
  headCommitId: string;
  createdAt: string;
}

export interface PullRequest {
  id: string;
  proposalId: string;
  fromBranchId: string;
  toBranchId: string;
  title: string;
  description: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
  mergedAt?: string;
}

export interface Issue {
  id: string;
  proposalId: string;
  authorId: string;
  title: string;
  bodyMd: string;
  labels: string[];
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  voterId: string;
  method: 'approval';
  payload: {
    choice: 'yes' | 'no';
  };
  weight: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  slug: string;
  title: string;
  summary: string;
  readmeMd: string;
  tags: string[];
  authorId: string;
  status: ProposalStatus;
  municipalityCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface GovernanceRule {
  id: string;
  scope: 'municipality' | 'proposal';
  jsonConfig: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ProposalDetail extends Proposal {
  branches: Branch[];
  commits: Commit[];
  pullRequests: PullRequest[];
  issues: Issue[];
  votes: Vote[];
}
