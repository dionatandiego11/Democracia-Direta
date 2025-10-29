import { useRouter } from 'next/router';
import { useAuthStore } from '@/state/authStore';
import { useProposalDetails, useProposalHistory } from '@/lib/api';
import { ReviewPanel } from '@/components/reviews/ReviewPanel';
import { AuditLogTimeline } from '@/components/reviews/AuditLogTimeline';

export function ProposalDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const token = useAuthStore((state) => state.token);
  const { data, error } = useProposalDetails(token, id);
  const { data: history } = useProposalHistory(token, id);

  if (error) {
    return <div className="card">Erro ao carregar detalhes da proposta.</div>;
  }

  if (!data) {
    return <div className="card">Carregando detalhes...</div>;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <section>
        <div className="card">
          <h1>{data.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <span className="tag">Status: {data.status}</span>
            <span className="tag">Autor: {data.author}</span>
          </div>
          <p>{data.description}</p>
        </div>
        <div className="card">
          <h2>Commits vinculados</h2>
          <ul>
            {data.commits.map((commit) => (
              <li key={commit.id}>
                <strong>{commit.title}</strong>
                <p>{commit.summary}</p>
                <small>{new Date(commit.createdAt).toLocaleString('pt-BR')}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Issues relacionadas</h2>
          <ul>
            {data.relatedIssues.map((issue) => (
              <li key={issue.id}>
                <strong>{issue.title}</strong> — <span className="tag">{issue.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Histórico</h2>
          <ul>
            {history?.map((item) => (
              <li key={item.id}>
                <strong>{item.type}</strong> por {item.author} — {item.message}
                <br />
                <small>{new Date(item.createdAt).toLocaleString('pt-BR')}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <aside className="grid" style={{ gap: '1rem' }}>
        <ReviewPanel proposalId={data.id} />
        <AuditLogTimeline entityType="proposal" entityId={data.id} />
      </aside>
    </div>
  );
}
