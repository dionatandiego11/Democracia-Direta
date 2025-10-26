import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout () {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            Democracia Direta
          </NavLink>
          <nav className="flex gap-4 text-sm text-slate-300">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-emerald-400' : ''}>
              Propostas
            </NavLink>
            <a href="https://creativecommons.org/licenses/by/4.0/" className="hover:text-emerald-300" target="_blank" rel="noreferrer">
              Licença CC-BY 4.0
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Democracia Direta</span>
          <span>Código sob AGPL-3.0</span>
        </div>
      </footer>
    </div>
  );
}
