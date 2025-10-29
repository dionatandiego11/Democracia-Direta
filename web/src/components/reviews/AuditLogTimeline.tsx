import { useAuthStore } from '@/state/authStore';
import { useAuditLogs } from '@/lib/api';

interface AuditLogTimelineProps {
  entityType: string;
  entityId: string;
}

export function AuditLogTimeline({ entityType, entityId }: AuditLogTimelineProps) {
  const token = useAuthStore((state) => state.token);
  const { data, error } = useAuditLogs(token, entityType, entityId);

  if (error) {
    return <div className="card">Não foi possível carregar os logs de auditoria.</div>;
  }

  if (!data) {
    return <div className="card">Carregando logs de auditoria...</div>;
  }

  return (
    <div className="card">
      <h2>Auditoria</h2>
      <ul>
        {data.map((log) => (
          <li key={log.id}>
            <strong>{log.action}</strong> por {log.actor}
            <br />
            <small>{new Date(log.timestamp).toLocaleString('pt-BR')}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
