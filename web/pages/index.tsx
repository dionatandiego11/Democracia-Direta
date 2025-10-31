import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ParticipationIndicators } from '@/components/dashboard/ParticipationIndicators';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <main>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Painel geral</h1>
            <p>Bem-vindo(a), {user?.name}!</p>
          </div>
          <button className="button secondary" onClick={() => logout()}>
            Sair
          </button>
        </header>
        <ParticipationIndicators />
        <div className="grid" style={{ marginTop: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <Link href="/organization" className="card">
            <h3>Organização</h3>
            <p>Explore a árvore organizacional nacional, estadual e municipal.</p>
          </Link>
          <Link href="/proposals" className="card">
            <h3>Propostas</h3>
            <p>Listagem completa das propostas e histórico de contribuições.</p>
          </Link>
          <Link href="/amendments/create" className="card">
            <h3>Nova emenda</h3>
            <p>Envie uma sugestão de alteração com justificativa detalhada.</p>
          </Link>
          <Link href="/voting" className="card">
            <h3>Votação</h3>
            <p>Acompanhe resultados em tempo real e exporte relatórios.</p>
          </Link>
        </div>
      </main>
    </ProtectedRoute>
  );
}
