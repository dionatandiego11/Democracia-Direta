import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { OrganizationTree } from '@/components/organization/OrganizationTree';

export default function OrganizationPage() {
  return (
    <ProtectedRoute>
      <main>
        <h1>Árvore organizacional</h1>
        <p>Visualize a estrutura hierárquica e indicadores de cada nível.</p>
        <OrganizationTree />
      </main>
    </ProtectedRoute>
  );
}
