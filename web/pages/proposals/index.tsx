import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProposalList } from '@/components/proposals/ProposalList';

export default function ProposalsPage() {
  return (
    <ProtectedRoute>
      <main>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Propostas</h1>
            <p>Pesquise e acompanhe propostas legislativas.</p>
          </div>
          <Link href="/amendments/create" className="button">
            Criar emenda
          </Link>
        </header>
        <ProposalList />
      </main>
    </ProtectedRoute>
  );
}
