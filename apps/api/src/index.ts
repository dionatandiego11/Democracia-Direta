import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { z } from 'zod';
import {
  createBranch,
  createCommit,
  createIssue,
  createProposal,
  createPullRequest,
  getAuditLogs,
  getProposalBySlug,
  getUserById,
  listGovernanceRules,
  listProposals,
  listUsers,
  mergePullRequest,
  registerVote,
  toProposalDetail
} from './store.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = process.env.PORT ?? 3333;

interface AuthedRequest extends Request {
  userId?: string;
}

app.use((req: AuthedRequest, _res: Response, next: NextFunction) => {
  const userId = req.header('x-user-id');
  if (userId != null) {
    req.userId = userId;
  }
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/auth/login', (req, res) => {
  const bodySchema = z.object({ userId: z.string() });
  const { userId } = bodySchema.parse(req.body);
  const user = getUserById(userId);
  if (user == null) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json({ token: user.id, user });
});

app.get('/users', (_req, res) => {
  res.json({ users: listUsers() });
});

app.get('/governance/rules', (_req, res) => {
  res.json({ rules: listGovernanceRules() });
});

app.get('/proposals', (req, res) => {
  const querySchema = z.object({
    status: z.string().optional(),
    tag: z.string().optional(),
    q: z.string().optional(),
    municipalityCode: z.string().optional()
  });
  const filters = querySchema.parse(req.query);
  const proposals = listProposals(filters);
  res.json({ proposals });
});

app.post('/proposals', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para criar proposta' });
  }
  const bodySchema = z.object({
    title: z.string().min(3),
    summary: z.string().min(10),
    readmeMd: z.string().min(10),
    tags: z.array(z.string()).default([]),
    municipalityCode: z.string().min(1)
  });
  const payload = bodySchema.parse(req.body);
  const slug = slugify(payload.title);
  const proposal = createProposal({
    slug,
    title: payload.title,
    summary: payload.summary,
    readmeMd: payload.readmeMd,
    tags: payload.tags,
    authorId: req.userId,
    municipalityCode: payload.municipalityCode
  });
  res.status(201).json({ proposal: toProposalDetail(proposal) });
});

app.get('/proposals/:slug', (req, res) => {
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  res.json({ proposal: toProposalDetail(proposal) });
});

app.post('/proposals/:slug/fork', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para forkar' });
  }
  const bodySchema = z.object({
    name: z.string().min(1),
    fromBranchId: z.string().optional()
  });
  const payload = bodySchema.parse(req.body);
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  const branch = createBranch(proposal, payload.name, req.userId, payload.fromBranchId);
  res.status(201).json({ branch });
});

app.post('/proposals/:slug/pull-requests', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para PR' });
  }
  const bodySchema = z.object({
    fromBranchId: z.string(),
    toBranchId: z.string(),
    title: z.string().min(5),
    description: z.string().min(10),
    message: z.string().min(3),
    readmeMd: z.string().min(10)
  });
  const payload = bodySchema.parse(req.body);
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  const commit = createCommit(proposal, payload.fromBranchId, req.userId, payload.message, payload.readmeMd);
  const pr = createPullRequest(proposal, {
    fromBranchId: payload.fromBranchId,
    toBranchId: payload.toBranchId,
    title: payload.title,
    description: payload.description,
    actorId: req.userId
  });
  res.status(201).json({ pullRequest: pr, commit });
});

app.post('/proposals/:slug/pull-requests/:id/merge', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para merge' });
  }
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  try {
    const pr = mergePullRequest(proposal, req.params.id, req.userId);
    res.json({ pullRequest: pr });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao mesclar PR' });
  }
});

app.post('/proposals/:slug/issues', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para abrir issue' });
  }
  const bodySchema = z.object({
    title: z.string().min(3),
    bodyMd: z.string().min(10),
    labels: z.array(z.string()).default([])
  });
  const payload = bodySchema.parse(req.body);
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  const issue = createIssue(proposal, {
    authorId: req.userId,
    title: payload.title,
    bodyMd: payload.bodyMd,
    labels: payload.labels
  });
  res.status(201).json({ issue });
});

app.post('/proposals/:slug/vote', (req: AuthedRequest, res) => {
  if (req.userId == null) {
    return res.status(401).json({ error: 'Cabeçalho x-user-id obrigatório para votar' });
  }
  const bodySchema = z.object({
    choice: z.enum(['yes', 'no']),
    weight: z.number().optional()
  });
  const payload = bodySchema.parse(req.body);
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  const vote = registerVote(proposal, {
    voterId: req.userId,
    choice: payload.choice,
    weight: payload.weight
  });
  res.status(201).json({ vote });
});

app.get('/proposals/:slug/diff', (req, res) => {
  const querySchema = z.object({ from: z.string(), to: z.string() });
  const { from, to } = querySchema.parse(req.query);
  const proposal = getProposalBySlug(req.params.slug);
  if (proposal == null) {
    return res.status(404).json({ error: 'Proposta não encontrada' });
  }
  const fromCommit = proposal.commits.find((commit) => commit.id === from);
  const toCommit = proposal.commits.find((commit) => commit.id === to);
  if (fromCommit == null || toCommit == null) {
    return res.status(404).json({ error: 'Commit não encontrado' });
  }
  res.json({
    diff: {
      from: { id: fromCommit.id, readmeMd: fromCommit.readmeMd },
      to: { id: toCommit.id, readmeMd: toCommit.readmeMd }
    }
  });
});

app.get('/audit', (req, res) => {
  const querySchema = z.object({
    entity: z.string().optional(),
    entityId: z.string().optional()
  });
  const filters = querySchema.parse(req.query);
  const items = getAuditLogs().filter((log) => {
    if (filters.entity != null && log.entity !== filters.entity) return false;
    if (filters.entityId != null && log.entityId !== filters.entityId) return false;
    return true;
  });
  res.json({ audit: items });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Payload inválido', details: err.flatten() });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro inesperado' });
});

app.listen(PORT, () => {
  console.log(`API Democracia Direta ouvindo na porta ${PORT}`);
});

function slugify (value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
