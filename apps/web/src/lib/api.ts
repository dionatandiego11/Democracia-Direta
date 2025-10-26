import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export function setUser (userId: string) {
  api.defaults.headers.common['x-user-id'] = userId;
}

export interface ProposalSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  status: string;
  municipalityCode: string;
  updatedAt: string;
}

export interface ProposalDetail extends ProposalSummary {
  readmeMd: string;
  branches: Array<{ id: string; name: string; headCommitId: string }>;
  commits: Array<{ id: string; message: string; createdAt: string; diffSummary: string; branchId: string }>;
  pullRequests: Array<{ id: string; title: string; status: string; createdAt: string; fromBranchId: string; toBranchId: string }>;
  issues: Array<{ id: string; title: string; status: string; labels: string[]; createdAt: string }>;
  votes: Array<{ id: string; voterId: string; payload: { choice: 'yes' | 'no' }; weight: number }>;
}

export interface VotePayload {
  choice: 'yes' | 'no';
}

export async function fetchProposals () {
  const { data } = await api.get<{ proposals: ProposalSummary[] }>('/proposals');
  return data.proposals;
}

export async function fetchProposal (slug: string) {
  const { data } = await api.get<{ proposal: ProposalDetail }>(`/proposals/${slug}`);
  return data.proposal;
}

export async function sendVote (slug: string, payload: VotePayload) {
  const { data } = await api.post(`/proposals/${slug}/vote`, payload);
  return data.vote;
}

export async function createIssue (slug: string, input: { title: string; bodyMd: string; labels: string[] }) {
  const { data } = await api.post(`/proposals/${slug}/issues`, input);
  return data.issue;
}
