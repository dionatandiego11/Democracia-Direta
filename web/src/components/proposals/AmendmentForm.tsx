import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AmendmentPayload, createAmendment } from '@/lib/api';

interface AmendmentFormProps {
  onSuccess?: () => void;
}

export function AmendmentForm({ onSuccess }: AmendmentFormProps) {
  const { token } = useAuth();
  const [form, setForm] = useState<AmendmentPayload>({
    proposalId: '',
    summary: '',
    diff: '',
    justification: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);
    try {
      await createAmendment(token, form);
      setSuccess(true);
      setForm({ proposalId: '', summary: '', diff: '', justification: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar a emenda');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h1>Nova emenda</h1>
      <label htmlFor="proposalId">Proposta</label>
      <input
        id="proposalId"
        value={form.proposalId}
        onChange={(event) => setForm((prev) => ({ ...prev, proposalId: event.target.value }))}
        placeholder="ID da proposta"
        required
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      <label htmlFor="summary">Resumo</label>
      <input
        id="summary"
        value={form.summary}
        onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
        required
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      <label htmlFor="diff">Diff (formato patch)</label>
      <textarea
        id="diff"
        value={form.diff}
        onChange={(event) => setForm((prev) => ({ ...prev, diff: event.target.value }))}
        required
        rows={6}
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      <label htmlFor="justification">Justificativa</label>
      <textarea
        id="justification"
        value={form.justification}
        onChange={(event) => setForm((prev) => ({ ...prev, justification: event.target.value }))}
        required
        rows={4}
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Emenda criada com sucesso!</p>}
      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Criar emenda'}
      </button>
    </form>
  );
}
