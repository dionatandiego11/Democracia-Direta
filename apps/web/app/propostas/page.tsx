const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchProposals() {
  try {
    const res = await fetch(`${API}/proposals`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Propostas() {
  const proposals = await fetchProposals();
  return (
    <section>
      <h1>Propostas</h1>
      <p className="hint">
        <a href="/propostas/nova">Criar proposta</a>
      </p>
      {proposals.length === 0 ? (
        <p className="hint">Nenhuma proposta carregada. Certifique-se de rodar a API.</p>
      ) : (
        <ul className="list">
          {proposals.map((p: any) => (
            <li key={p.id}>
              <a href={`/propostas/${p.id}`}><strong>{p.title}</strong></a>
              <span className="muted">{p.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

