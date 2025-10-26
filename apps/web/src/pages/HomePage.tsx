import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Pill } from '@democracia/ui';
import { fetchProposals, setUser } from '../lib/api.ts';
import { useEffect } from 'react';

const DEFAULT_USER_ID = 'u-maria';

export default function HomePage () {
  useEffect(() => {
    setUser(DEFAULT_USER_ID);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: fetchProposals
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-emerald-400">Propostas em destaque</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Explore propostas cívicas ativas no município. Forke ideias, envie PRs e participe das votações comunitárias.
        </p>
      </header>

      {isLoading && <p>Carregando propostas...</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((proposal) => (
          <Link key={proposal.id} to={`/propostas/${proposal.slug}`} className="card space-y-3 transition hover:border-emerald-500 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <Pill>{proposal.status}</Pill>
              <time className="text-xs text-slate-400">Atualizado em {new Date(proposal.updatedAt).toLocaleDateString('pt-BR')}</time>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">{proposal.title}</h2>
              <p className="text-sm text-slate-300">{proposal.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {proposal.tags.map(tag => (
                <Pill key={tag}>#{tag}</Pill>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
