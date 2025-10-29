export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <a href="/" style={{ fontWeight: 700 }}>Democracia-Direta</a>
          <nav style={{ float: 'right' }}>
            <a href="/propostas" style={{ marginRight: 12 }}>Propostas</a>
            <a href="/votacoes">Votações</a>
          </nav>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}

