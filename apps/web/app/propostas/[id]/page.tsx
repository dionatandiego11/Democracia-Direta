type Proposal = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  versions?: { version: number; contentMd: string }[];
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchProposal(id: string): Promise<Proposal | null> {
  try {
    const res = await fetch(`${API}/proposals/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ProposalPage({ params }: { params: { id: string } }) {
  const data = await fetchProposal(params.id);
  if (!data) {
    return (
      <section>
        <h1>Proposta</h1>
        <p className="hint">Proposta não encontrada.</p>
      </section>
    );
  }

  const latest = data.versions?.[0];

  return (
    <section>
      <h1>{data.title}</h1>
      <p className="hint">Status: {data.status}</p>
      {latest ? (
        <article className="card" style={{ whiteSpace: 'pre-wrap' }}>
          {latest.contentMd}
        </article>
      ) : (
        <p className="hint">Sem conteúdo.</p>
      )}
    </section>
  );
}

