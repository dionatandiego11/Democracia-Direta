import { useState } from 'react';

// Função simples para calcular diff linha por linha
function computeDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const diff = [];
  
  let i = 0, j = 0;
  
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      diff.push({ type: 'unchanged', content: oldLines[i], oldLine: i + 1, newLine: j + 1 });
      i++;
      j++;
    } else if (i < oldLines.length && (j >= newLines.length || oldLines[i] !== newLines[j])) {
      diff.push({ type: 'removed', content: oldLines[i], oldLine: i + 1 });
      i++;
    } else if (j < newLines.length) {
      diff.push({ type: 'added', content: newLines[j], newLine: j + 1 });
      j++;
    }
  }
  
  return diff;
}

export default function DiffViewer() {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'unified'
  
  // Exemplo de conteúdo
  const oldVersion = `# Proposta de Reforma Estatutária

## Artigo 3º - Dos Direitos dos Filiados

Todo filiado tem direito a:
- Participar de decisões internas
- Votar em consultas
- Apresentar propostas

## Artigo 4º - Dos Deveres

São deveres do filiado:
- Respeitar o estatuto
- Contribuir com a organização`;

  const newVersion = `# Proposta de Reforma Estatutária

## Artigo 3º - Dos Direitos dos Filiados

Todo filiado tem direito a:
- Participar de decisões internas
- Votar em consultas e votações
- Apresentar propostas e emendas
- Delegar seu voto quando ausente

## Artigo 4º - Dos Deveres

São deveres do filiado:
- Respeitar o estatuto e código de conduta
- Contribuir com a organização
- Participar ativamente das deliberações`;

  const diff = computeDiff(oldVersion, newVersion);
  
  const stats = {
    additions: diff.filter(d => d.type === 'added').length,
    deletions: diff.filter(d => d.type === 'removed').length,
    unchanged: diff.filter(d => d.type === 'unchanged').length
  };

  return (
    <div style={{ 
      padding: '24px', 
      background: '#0b0c10', 
      minHeight: '100vh', 
      color: '#e8eaed',
      fontFamily: 'ui-monospace, monospace'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: 700 }}>
            Comparação de Versões
          </h1>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            color: '#9aa0a6',
            fontSize: '0.95rem'
          }}>
            <span>Versão 2 ← Versão 3</span>
            <span>|</span>
            <span style={{ color: '#10b981' }}>+{stats.additions} adições</span>
            <span style={{ color: '#ef4444' }}>-{stats.deletions} remoções</span>
          </div>
        </div>

        {/* Controles */}
        <div style={{ 
          marginBottom: '16px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => setViewMode('split')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'split' ? '#2dd4bf' : 'rgba(255,255,255,0.05)',
              color: viewMode === 'split' ? '#0b0c10' : '#e8eaed',
              border: '1px solid #21242b',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('unified')}
            style={{
              padding: '8px 16px',
              background: viewMode === 'unified' ? '#2dd4bf' : 'rgba(255,255,255,0.05)',
              color: viewMode === 'unified' ? '#0b0c10' : '#e8eaed',
              border: '1px solid #21242b',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Unified View
          </button>
        </div>

        {/* Diff Viewer */}
        {viewMode === 'split' ? (
          <SplitView diff={diff} />
        ) : (
          <UnifiedView diff={diff} />
        )}
      </div>
    </div>
  );
}

function SplitView({ diff }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2px',
      background: '#21242b',
      border: '1px solid #21242b',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Coluna Antiga */}
      <div style={{ background: '#0b0c10' }}>
        <div style={{ 
          padding: '12px 16px', 
          background: 'rgba(239, 68, 68, 0.1)',
          borderBottom: '1px solid #21242b',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          Versão 2 (Antiga)
        </div>
        <div>
          {diff.filter(d => d.type !== 'added').map((line, i) => (
            <DiffLine key={i} line={line} side="old" />
          ))}
        </div>
      </div>

      {/* Coluna Nova */}
      <div style={{ background: '#0b0c10' }}>
        <div style={{ 
          padding: '12px 16px', 
          background: 'rgba(16, 185, 129, 0.1)',
          borderBottom: '1px solid #21242b',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          Versão 3 (Nova)
        </div>
        <div>
          {diff.filter(d => d.type !== 'removed').map((line, i) => (
            <DiffLine key={i} line={line} side="new" />
          ))}
        </div>
      </div>
    </div>
  );
}

function UnifiedView({ diff }) {
  return (
    <div style={{
      background: '#0b0c10',
      border: '1px solid #21242b',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '12px 16px', 
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid #21242b',
        fontWeight: 600,
        fontSize: '0.9rem'
      }}>
        Alterações
      </div>
      <div>
        {diff.map((line, i) => (
          <DiffLine key={i} line={line} side="unified" />
        ))}
      </div>
    </div>
  );
}

function DiffLine({ line, side }) {
  let bgColor = 'transparent';
  let textColor = '#e8eaed';
  let symbol = ' ';
  let lineNumber = '';

  if (line.type === 'removed') {
    bgColor = 'rgba(239, 68, 68, 0.15)';
    textColor = '#fca5a5';
    symbol = '-';
    lineNumber = line.oldLine;
  } else if (line.type === 'added') {
    bgColor = 'rgba(16, 185, 129, 0.15)';
    textColor = '#6ee7b7';
    symbol = '+';
    lineNumber = line.newLine;
  } else {
    lineNumber = side === 'old' ? line.oldLine : line.newLine;
  }

  return (
    <div style={{
      display: 'flex',
      background: bgColor,
      padding: '2px 0',
      fontSize: '0.85rem',
      lineHeight: '1.5',
      borderLeft: line.type !== 'unchanged' ? `3px solid ${line.type === 'removed' ? '#ef4444' : '#10b981'}` : '3px solid transparent'
    }}>
      <div style={{
        minWidth: '40px',
        padding: '0 8px',
        color: '#6b7280',
        textAlign: 'right',
        userSelect: 'none'
      }}>
        {lineNumber}
      </div>
      <div style={{
        minWidth: '20px',
        padding: '0 8px',
        color: textColor,
        fontWeight: 600,
        userSelect: 'none'
      }}>
        {symbol}
      </div>
      <div style={{ 
        flex: 1, 
        padding: '0 12px',
        color: textColor,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        {line.content}
      </div>
    </div>
  );
}