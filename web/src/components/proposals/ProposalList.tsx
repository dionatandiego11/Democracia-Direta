import Link from 'next/link';
import { useAuthStore } from '@/state/authStore';
import { useProposals } from '@/lib/api';

export function ProposalList() {
  const token = useAuthStore((state) => state.token);
  const { data, error } = useProposals(token);

  if (error) {
    return <div className="card">Erro ao carregar propostas.</div>;
  }

  if (!data) {
    return <div className="card">Carregando propostas...</div>;
  }

  return (
    <div className="card">
      <h2>Propostas</h2>
      <table className="table" data-testid="proposal-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Autor</th>
            <th>Atualizado em</th>
          </tr>
        </thead>
        <tbody>
          {data.map((proposal) => (
            <tr key={proposal.id}>
              <td>
                <Link href={`/proposals/${proposal.id}`}>{proposal.title}</Link>
              </td>
              <td>
                <span className="tag">{proposal.status}</span>
              </td>
              <td>{proposal.author}</td>
              <td>{new Date(proposal.updatedAt).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
