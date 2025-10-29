import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <header className="site-header">
          <a href="/" className="brand">Democracia-Direta</a>
          <nav className="nav">
            <a href="/propostas">Propostas</a>
            <a href="/votacoes">Votações</a>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}

