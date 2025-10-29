async function fetchProposals() {
  // In dev, this will fail if API not running; leaving as placeholder
  try {
    const res = await fetch("http://localhost:4000/proposals", { cache: "no-store" });
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
      {proposals.length === 0 ? (
        <p>Nenhuma proposta carregada. Certifique-se de rodar a API.</p>
      ) : (
        <ul>
          {proposals.map((p: any) => (
            <li key={p.id}>
              <strong>{p.title}</strong> <small>({p.status})</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

