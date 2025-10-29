import axios from 'axios';
import useSWR from 'swr';
import { User } from '@/state/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
});

const authHeader = (token: string | null) => ({
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined
  }
});

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  return data as { token: string };
}

export async function logout(token: string) {
  await api.post('/auth/logout', null, authHeader(token));
}

export async function fetchCurrentUser(token: string) {
  const { data } = await api.get('/auth/me', authHeader(token));
  return data as User;
}

export function useDashboardMetrics(token: string | null) {
  return useSWR(token ? ['metrics', token] : null, async () => {
    const { data } = await api.get('/metrics/participation', authHeader(token));
    return data as {
      activeMembers: number;
      proposals: number;
      approvals: number;
      turnout: number;
    };
  });
}

export function useOrganizationTree(token: string | null) {
  return useSWR(token ? ['organization', token] : null, async () => {
    const { data } = await api.get('/organization/tree', authHeader(token));
    return data as OrganizationNode;
  });
}

export function useProposals(token: string | null) {
  return useSWR(token ? ['proposals', token] : null, async () => {
    const { data } = await api.get('/proposals', authHeader(token));
    return data as ProposalSummary[];
  });
}

export function useProposalDetails(token: string | null, id: string | undefined) {
  return useSWR(id && token ? ['proposals', id, token] : null, async () => {
    const { data } = await api.get(`/proposals/${id}`, authHeader(token));
    return data as ProposalDetail;
  });
}

export function useProposalHistory(token: string | null, id: string | undefined) {
  return useSWR(id && token ? ['proposal-history', id, token] : null, async () => {
    const { data } = await api.get(`/proposals/${id}/history`, authHeader(token));
    return data as ProposalHistory[];
  });
}

export async function createAmendment(token: string, payload: AmendmentPayload) {
  const { data } = await api.post('/amendments', payload, authHeader(token));
  return data as Amendment;
}

export function useVotingDashboard(token: string | null) {
  return useSWR(token ? ['voting-dashboard', token] : null, async () => {
    const { data } = await api.get('/voting/dashboard', authHeader(token));
    return data as VotingDashboard;
  });
}

export async function exportVotingData(token: string) {
  const { data } = await api.get('/voting/export', {
    ...authHeader(token),
    responseType: 'blob'
  });
  return data as Blob;
}

export function useReviews(token: string | null, proposalId: string) {
  return useSWR(token ? ['reviews', proposalId, token] : null, async () => {
    const { data } = await api.get(`/proposals/${proposalId}/reviews`, authHeader(token));
    return data as Review[];
  });
}

export async function submitReview(token: string, proposalId: string, payload: ReviewPayload) {
  const { data } = await api.post(`/proposals/${proposalId}/reviews`, payload, authHeader(token));
  return data as Review;
}

export async function updateReviewStatus(token: string, proposalId: string, reviewId: string, status: 'approved' | 'rejected') {
  const { data } = await api.post(
    `/proposals/${proposalId}/reviews/${reviewId}/status`,
    { status },
    authHeader(token)
  );
  return data as Review;
}

export function useAuditLogs(token: string | null, entityType: string, entityId: string) {
  return useSWR(token ? ['audit-logs', entityType, entityId, token] : null, async () => {
    const { data } = await api.get(`/audit/${entityType}/${entityId}`, authHeader(token));
    return data as AuditLog[];
  });
}

export interface OrganizationNode {
  id: string;
  name: string;
  level: 'nacional' | 'estadual' | 'municipal';
  metrics: {
    members: number;
    proposals: number;
    turnout: number;
  };
  children?: OrganizationNode[];
}

export interface ProposalSummary {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'voting' | 'approved' | 'rejected';
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalHistory {
  id: string;
  type: 'commit' | 'issue' | 'comment';
  author: string;
  message: string;
  createdAt: string;
}

export interface ProposalDetail extends ProposalSummary {
  description: string;
  history: ProposalHistory[];
  relatedIssues: {
    id: string;
    title: string;
    status: string;
  }[];
  commits: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
  }[];
}

export interface AmendmentPayload {
  proposalId: string;
  summary: string;
  diff: string;
  justification: string;
}

export interface Amendment extends AmendmentPayload {
  id: string;
  status: 'pending' | 'merged' | 'rejected';
  createdAt: string;
}

export interface VotingDashboard {
  activeSessions: number;
  participationRate: number;
  liveResults: Array<{
    proposalId: string;
    proposalTitle: string;
    yes: number;
    no: number;
    abstain: number;
  }>;
}

export interface Review {
  id: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  createdAt: string;
}

export interface ReviewPayload {
  comment: string;
  status: 'approved' | 'rejected' | 'pending';
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export default api;
