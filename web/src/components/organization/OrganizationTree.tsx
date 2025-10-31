import { useMemo } from 'react';
import { useAuthStore } from '@/state/authStore';
import { OrganizationNode, useOrganizationTree } from '@/lib/api';

interface TreeNodeProps {
  node: OrganizationNode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const indent = depth * 16;
  const colorMap: Record<OrganizationNode['level'], string> = {
    nacional: '#1a73e8',
    estadual: '#34a853',
    municipal: '#fbbc05'
  };

  return (
    <div style={{ marginLeft: indent, borderLeft: depth ? '2px solid #e5e7eb' : undefined, paddingLeft: depth ? 12 : 0 }}>
      <div className="card" style={{ borderLeft: `6px solid ${colorMap[node.level]}` }}>
        <h3>{node.name}</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className="tag">Membros: {node.metrics.members}</span>
          <span className="tag">Propostas: {node.metrics.proposals}</span>
          <span className="tag">Participação: {(node.metrics.turnout * 100).toFixed(1)}%</span>
        </div>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function OrganizationTree() {
  const token = useAuthStore((state) => state.token);
  const { data, error } = useOrganizationTree(token);

  const content = useMemo(() => {
    if (error) {
      return <div className="card">Erro ao carregar estrutura organizacional.</div>;
    }

    if (!data) {
      return <div className="card">Carregando árvore organizacional...</div>;
    }

    return <TreeNode node={data} />;
  }, [data, error]);

  return <div>{content}</div>;
}
