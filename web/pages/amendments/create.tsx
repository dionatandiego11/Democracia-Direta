import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AmendmentForm } from '@/components/proposals/AmendmentForm';

export default function CreateAmendmentPage() {
  return (
    <ProtectedRoute>
      <main>
        <AmendmentForm />
      </main>
    </ProtectedRoute>
  );
}
