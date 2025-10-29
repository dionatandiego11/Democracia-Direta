export default function Home() {
  return (
    <section>
      <h1>Bem-vindo à Democracia‑Direta</h1>
      <p>Colabore como em um repositório: proponha, debata, versione e vote.</p>
      <div className="grid">
        <a className="card" href="/propostas">
          <h2>Explorar propostas →</h2>
          <p>Veja propostas abertas e acompanhamentos.</p>
        </a>
        <a className="card" href="/votacoes">
          <h2>Ver votações →</h2>
          <p>Acompanhe sessões de votação ativas e encerradas.</p>
        </a>
        <a className="card" href="/propostas/nova">
          <h2>Criar proposta →</h2>
          <p>Submeta uma nova proposta para discussão.</p>
        </a>
      </div>
    </section>
  );
}

