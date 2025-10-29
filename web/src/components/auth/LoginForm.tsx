import { FormEvent, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setFormError(err?.message ?? 'Erro ao autenticar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h1>Democracia Direta</h1>
      <p>Acesse sua conta para continuar.</p>
      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      <label htmlFor="password">Senha</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', marginBottom: '1rem' }}
      />
      {(error || formError) && <p style={{ color: 'red' }}>{error ?? formError}</p>}
      <button type="submit" className="button" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
