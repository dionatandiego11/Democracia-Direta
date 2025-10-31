import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RealtimeVotingDashboard } from '@/components/voting/RealtimeVotingDashboard';

export default function VotingPage() {
  return (
    <ProtectedRoute>
      <main>
        <RealtimeVotingDashboard />
      </main>
    </ProtectedRoute>
  );
}
