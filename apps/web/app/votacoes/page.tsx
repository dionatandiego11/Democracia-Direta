const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchSessions() {
  try {
    const res = await fetch(`${API}/votes/sessions`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Votacoes() {
  const sessions = await fetchSessions();
  return (
    <section>
      <h1>Votações</h1>
      {sessions.length === 0 ? (
        <p className="hint">Nenhuma sessão encontrada. Certifique-se de rodar a API.</p>
      ) : (
        <ul className="list">
          {sessions.map((s: any) => (
            <li key={s.id}>
              <div>
                <strong>{s.title}</strong>
                <div className="muted">
                  {new Date(s.startsAt).toLocaleString()} → {new Date(s.endsAt).toLocaleString()}
                </div>
              </div>
              <span className="muted">regra: {s.rule}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

