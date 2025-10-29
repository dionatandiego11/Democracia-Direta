import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { submitReview, updateReviewStatus, useReviews } from '@/lib/api';

interface ReviewPanelProps {
  proposalId: string;
}

export function ReviewPanel({ proposalId }: ReviewPanelProps) {
  const { token } = useAuth();
  const { data, mutate } = useReviews(token ?? null, proposalId);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'approved' | 'rejected' | 'pending'>('pending');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await submitReview(token, proposalId, { comment, status });
      setComment('');
      setStatus('pending');
      await mutate();
    } catch (err: any) {
      setError(err?.message ?? 'Falha ao registrar revisão');
    }
  };

  const handleStatusUpdate = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    if (!token) return;
    try {
      await updateReviewStatus(token, proposalId, reviewId, newStatus);
      await mutate();
    } catch (err: any) {
      setError(err?.message ?? 'Falha ao atualizar status');
    }
  };

  return (
    <div className="card" data-testid="review-panel">
      <h2>Revisões</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Deixe seu feedback"
          required
          rows={3}
          style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', marginBottom: '0.75rem' }}
        />
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #d1d5db', marginBottom: '0.75rem' }}
        >
          <option value="pending">Em análise</option>
          <option value="approved">Aprovar</option>
          <option value="rejected">Rejeitar</option>
        </select>
        <button className="button" type="submit">
          Registrar revisão
        </button>
      </form>
      <ul>
        {data?.map((review) => (
          <li key={review.id} style={{ marginBottom: '0.75rem' }}>
            <strong>{review.reviewer}</strong>
            <p>{review.comment}</p>
            <span className="tag">{review.status}</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" className="button" onClick={() => handleStatusUpdate(review.id, 'approved')}>
                Aprovar
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => handleStatusUpdate(review.id, 'rejected')}
              >
                Rejeitar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
