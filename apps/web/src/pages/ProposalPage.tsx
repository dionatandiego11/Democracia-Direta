import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Button, Pill } from '@democracia/ui';
import { createIssue, fetchProposal, sendVote } from '../lib/api.ts';
import { useMemo, useState } from 'react';

export default function ProposalPage () {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [issueFormOpen, setIssueFormOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueBody, setIssueBody] = useState('');

  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposal', slug],
    queryFn: async () => {
      if (slug == null) throw new Error('Slug não informado');
      return await fetchProposal(slug);
    }
  });

  const voteMutation = useMutation({
    mutationFn: async (choice: 'yes' | 'no') => {
      if (slug == null) throw new Error('Slug não informado');
      return await sendVote(slug, { choice });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['proposal', slug] });
    }
  });

  const issueMutation = useMutation({
    mutationFn: async () => {
      if (slug == null) throw new Error('Slug não informado');
      await createIssue(slug, { title: issueTitle, bodyMd: issueBody, labels: ['debate'] });
    },
    onSuccess: async () => {
      setIssueFormOpen(false);
      setIssueTitle('');
      setIssueBody('');
      await queryClient.invalidateQueries({ queryKey: ['proposal', slug] });
    }
  });

  const voteStats = useMemo(() => {
    if (proposal == null) return { yes: 0, no: 0 };
    return proposal.votes.reduce(
      (acc, vote) => {
        if (vote.payload.choice === 'yes') acc.yes += vote.weight;
        if (vote.payload.choice === 'no') acc.no += vote.weight;
        return acc;
      },
      { yes: 0, no: 0 }
    );
  }, [proposal]);

  if (isLoading) {
    return <p className="px-4">Carregando proposta...</p>;
  }

  if (proposal == null) {
    return <p className="px-4">Proposta não encontrada.</p>;
  }

  return (
    <article className="space-y-8">
      <section className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-semibold text-emerald-400">{proposal.title}</h1>
            <p className="text-sm text-slate-300">{proposal.summary}</p>
          </div>
          <Pill>Status: {proposal.status}</Pill>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span>Município: {proposal.municipalityCode}</span>
          <span>Última atualização: {new Date(proposal.updatedAt).toLocaleString('pt-BR')}</span>
          <span>Branches: {proposal.branches.length}</span>
          <span>PRs abertos: {proposal.pullRequests.filter((pr) => pr.status === 'open').length}</span>
        </div>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{proposal.readmeMd}</ReactMarkdown>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-100">Linha do tempo de commits</h2>
          <ol className="space-y-3 text-sm text-slate-300">
            {proposal.commits.map((commit) => (
              <li key={commit.id} className="rounded-md border border-slate-800 p-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Commit {commit.id.slice(0, 8)}</span>
                  <time>{new Date(commit.createdAt).toLocaleString('pt-BR')}</time>
                </div>
                <p className="font-medium text-slate-100">{commit.message}</p>
                <p className="text-xs">Diff: {commit.diffSummary || 'sem alterações'}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">Votação</h2>
          <p className="text-sm text-slate-300">Método: aprovação simples</p>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <p className="text-emerald-300 text-lg font-bold">{voteStats.yes}</p>
              <span className="text-xs text-slate-400">Aprovação</span>
            </div>
            <div>
              <p className="text-rose-300 text-lg font-bold">{voteStats.no}</p>
              <span className="text-xs text-slate-400">Reprovação</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => voteMutation.mutate('yes')} disabled={voteMutation.isLoading}>
              Votar SIM
            </Button>
            <Button variant="secondary" onClick={() => voteMutation.mutate('no')} disabled={voteMutation.isLoading}>
              Votar NÃO
            </Button>
          </div>
          {voteMutation.isSuccess && <p className="text-xs text-emerald-300">Voto registrado com sucesso!</p>}
        </div>
      </section>

      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Issues em debate</h2>
          <Button variant="secondary" onClick={() => setIssueFormOpen((state) => !state)}>
            {issueFormOpen ? 'Cancelar' : 'Nova issue'}
          </Button>
        </div>
        {issueFormOpen && (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              issueMutation.mutate();
            }}
          >
            <div className="space-y-1 text-sm">
              <label className="text-slate-300">Título</label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                value={issueTitle}
                onChange={(event) => setIssueTitle(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1 text-sm">
              <label className="text-slate-300">Descrição</label>
              <textarea
                className="h-32 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
                value={issueBody}
                onChange={(event) => setIssueBody(event.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={issueMutation.isLoading}>
              Publicar issue
            </Button>
          </form>
        )}
        <ul className="space-y-3 text-sm text-slate-300">
          {proposal.issues.map((issue) => (
            <li key={issue.id} className="rounded-md border border-slate-800 p-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <Pill>{issue.status}</Pill>
                <time>{new Date(issue.createdAt).toLocaleString('pt-BR')}</time>
              </div>
              <p className="font-medium text-slate-100">{issue.title}</p>
              <p className="text-xs text-slate-400">Labels: {issue.labels.join(', ') || 'sem labels'}</p>
            </li>
          ))}
          {proposal.issues.length === 0 && <li className="text-xs text-slate-500">Ainda não há issues abertas.</li>}
        </ul>
      </section>
    </article>
  );
}
