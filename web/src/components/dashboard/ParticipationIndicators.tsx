import { useAuthStore } from '@/state/authStore';
import { useDashboardMetrics } from '@/lib/api';

export function ParticipationIndicators() {
  const token = useAuthStore((state) => state.token);
  const { data, error } = useDashboardMetrics(token);

  if (error) {
    return <div className="card">Erro ao carregar indicadores.</div>;
  }

  if (!data) {
    return <div className="card">Carregando indicadores de participação...</div>;
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <div className="card">
        <h3>Membros ativos</h3>
        <strong>{data.activeMembers}</strong>
      </div>
      <div className="card">
        <h3>Propostas em andamento</h3>
        <strong>{data.proposals}</strong>
      </div>
      <div className="card">
        <h3>Aprovações recentes</h3>
        <strong>{data.approvals}</strong>
      </div>
      <div className="card">
        <h3>Participação média</h3>
        <strong>{(data.turnout * 100).toFixed(1)}%</strong>
      </div>
    </div>
  );
}
