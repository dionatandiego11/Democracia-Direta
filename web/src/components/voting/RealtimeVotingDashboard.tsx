import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useVotingDashboard, exportVotingData } from '@/lib/api';
import { useVotingStream } from '@/lib/realtime';

export function RealtimeVotingDashboard() {
  const { token } = useAuth();
  const { data, error } = useVotingDashboard(token ?? null);
  const liveResults = useVotingStream({ token: token ?? null });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!token) return;
    setIsExporting(true);
    try {
      const blob = await exportVotingData(token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'votacao.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return <div className="card">Erro ao carregar painel de votação.</div>;
  }

  if (!data) {
    return <div className="card">Carregando informações de votação...</div>;
  }

  const aggregatedResults = liveResults.length ? liveResults : data.liveResults;

  return (
    <div className="card">
      <h1>Módulo de votação</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <strong>Sessões ativas:</strong>
          <p>{data.activeSessions}</p>
        </div>
        <div>
          <strong>Participação:</strong>
          <p>{(data.participationRate * 100).toFixed(1)}%</p>
        </div>
        <button className="button" onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </div>
      <div className="grid" style={{ marginTop: '2rem' }}>
        {aggregatedResults.map((result) => {
          const total = result.yes + result.no + result.abstain;
          const yesPercent = total ? (result.yes / total) * 100 : 0;
          const noPercent = total ? (result.no / total) * 100 : 0;
          const abstainPercent = total ? (result.abstain / total) * 100 : 0;
          return (
            <div key={result.proposalId} className="card">
              <h3>{result.proposalTitle}</h3>
              <p>Sim: {result.yes} ({yesPercent.toFixed(1)}%)</p>
              <p>Não: {result.no} ({noPercent.toFixed(1)}%)</p>
              <p>Abstenções: {result.abstain} ({abstainPercent.toFixed(1)}%)</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
