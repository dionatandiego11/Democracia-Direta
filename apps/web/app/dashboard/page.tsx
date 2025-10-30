import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2dd4bf', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardGovernanca() {
  const [metrics, setMetrics] = useState({
    proposalsOpen: 0,
    proposalsMerged: 0,
    activeVotes: 0,
    membersActive: 0,
    participationRate: 0,
    consensusAvg: 0
  });

  const [proposalsByStatus, setProposalsByStatus] = useState([]);
  const [participationTrend, setParticipationTrend] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [voteDistribution, setVoteDistribution] = useState([]);

  useEffect(() => {
    // Simulação de dados - substituir por chamadas API reais
    setMetrics({
      proposalsOpen: 42,
      proposalsMerged: 127,
      activeVotes: 8,
      membersActive: 356,
      participationRate: 67.5,
      consensusAvg: 0.72
    });

    setProposalsByStatus([
      { name: 'Abertas', value: 42, color: '#2dd4bf' },
      { name: 'Mescladas', value: 127, color: '#10b981' },
      { name: 'Rejeitadas', value: 23, color: '#ef4444' },
      { name: 'Rascunho', value: 15, color: '#6b7280' }
    ]);

    setParticipationTrend([
      { mes: 'Jun', participacao: 52, propostas: 18 },
      { mes: 'Jul', participacao: 58, propostas: 22 },
      { mes: 'Ago', participacao: 63, propostas: 28 },
      { mes: 'Set', participacao: 65, propostas: 31 },
      { mes: 'Out', participacao: 67.5, propostas: 35 }
    ]);

    setTopContributors([
      { name: 'Ana Silva', propostas: 23, votos: 156, pontos: 890 },
      { name: 'João Santos', propostas: 18, votos: 142, pontos: 745 },
      { name: 'Maria Costa', propostas: 15, votos: 138, pontos: 680 },
      { name: 'Pedro Lima', propostas: 12, votos: 125, pontos: 590 },
      { name: 'Clara Souza', propostas: 11, votos: 118, pontos: 565 }
    ]);

    setVoteDistribution([
      { name: 'Sim', value: 62 },
      { name: 'Não', value: 23 },
      { name: 'Abstenção', value: 15 }
    ]);
  }, []);

  return (
    <div style={{ padding: '24px', background: '#0b0c10', minHeight: '100vh', color: '#e8eaed' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 700 }}>
          Painel de Governança
        </h1>
        <p style={{ color: '#9aa0a6', marginBottom: '32px' }}>
          Visão geral da participação e atividade democrática
        </p>

        {/* Cards de Métricas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <MetricCard 
            title="Propostas Abertas" 
            value={metrics.proposalsOpen}
            icon="📝"
            trend="+12%"
          />
          <MetricCard 
            title="Propostas Aprovadas" 
            value={metrics.proposalsMerged}
            icon="✅"
            trend="+8%"
          />
          <MetricCard 
            title="Votações Ativas" 
            value={metrics.activeVotes}
            icon="🗳️"
          />
          <MetricCard 
            title="Membros Ativos" 
            value={metrics.membersActive}
            icon="👥"
            trend="+15%"
          />
          <MetricCard 
            title="Taxa de Participação" 
            value={`${metrics.participationRate}%`}
            icon="📊"
            trend="+5%"
          />
          <MetricCard 
            title="Consenso Médio" 
            value={`${(metrics.consensusAvg * 100).toFixed(0)}%`}
            icon="🤝"
          />
        </div>

        {/* Gráficos */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px'
        }}>
          {/* Tendência de Participação */}
          <ChartCard title="Tendência de Participação">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={participationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21242b" />
                <XAxis dataKey="mes" stroke="#9aa0a6" />
                <YAxis stroke="#9aa0a6" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111318', 
                    border: '1px solid #21242b',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="participacao" 
                  stroke="#2dd4bf" 
                  name="Participação (%)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="propostas" 
                  stroke="#f59e0b" 
                  name="Propostas"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Status das Propostas */}
          <ChartCard title="Status das Propostas">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={proposalsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {proposalsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#111318', 
                    border: '1px solid #21242b',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Contribuidores */}
          <ChartCard title="Top Contribuidores">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topContributors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#21242b" />
                <XAxis type="number" stroke="#9aa0a6" />
                <YAxis dataKey="name" type="category" stroke="#9aa0a6" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#111318', 
                    border: '1px solid #21242b',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="pontos" fill="#2dd4bf" name="Pontos" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Distribuição de Votos */}
          <ChartCard title="Distribuição de Votos (Média)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={voteDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {voteDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#111318', 
                    border: '1px solid #21242b',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Atividade Recente */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>
            Atividade Recente
          </h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid #21242b',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {[
              { user: 'Ana Silva', action: 'criou proposta', target: 'Reforma do Estatuto Cap. 3', time: '2h atrás', icon: '📝' },
              { user: 'João Santos', action: 'votou em', target: 'Sessão: Orçamento 2025', time: '3h atrás', icon: '🗳️' },
              { user: 'Maria Costa', action: 'comentou em', target: 'Issue #42: Regras de delegação', time: '5h atrás', icon: '💬' },
              { user: 'Pedro Lima', action: 'criou PR', target: 'Ajustes no programa ambiental', time: '6h atrás', icon: '🔀' },
              { user: 'Clara Souza', action: 'aprovou PR', target: 'Programa de educação', time: '8h atrás', icon: '✅' }
            ].map((activity, i) => (
              <div 
                key={i}
                style={{
                  padding: '16px 20px',
                  borderBottom: i < 4 ? '1px solid #21242b' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div>
                    <strong>{activity.user}</strong> {activity.action}{' '}
                    <span style={{ color: '#2dd4bf' }}>{activity.target}</span>
                  </div>
                  <div style={{ color: '#9aa0a6', fontSize: '0.9rem' }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid #21242b',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#9aa0a6' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.5rem' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>
        {value}
      </div>
      {trend && (
        <div style={{ 
          fontSize: '0.85rem', 
          color: trend.startsWith('+') ? '#10b981' : '#ef4444'
        }}>
          {trend} vs. mês anterior
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid #21242b',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        marginBottom: '20px',
        fontWeight: 600
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}