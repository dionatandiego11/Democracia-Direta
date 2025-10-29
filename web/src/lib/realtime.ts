import { useEffect, useState } from 'react';
import { VotingDashboard } from './api';

interface UseVotingStreamParams {
  token: string | null;
}

export function useVotingStream({ token }: UseVotingStreamParams) {
  const [data, setData] = useState<VotingDashboard['liveResults']>([]);

  useEffect(() => {
    if (!token) return;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    const url = new URL('/voting/stream', base);
    if (token) {
      url.searchParams.set('token', token);
    }

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true
    });

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as VotingDashboard['liveResults'];
        setData(payload);
      } catch (error) {
        console.error('Erro ao processar payload de votação em tempo real', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [token]);

  return data;
}
