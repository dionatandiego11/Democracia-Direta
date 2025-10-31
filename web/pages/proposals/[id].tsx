import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProposalDetail } from '@/components/proposals/ProposalDetail';

export default function ProposalDetailPage() {
  return (
    <ProtectedRoute>
      <main>
        <ProposalDetail />
      </main>
    </ProtectedRoute>
  );
}
