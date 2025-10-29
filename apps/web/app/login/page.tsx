"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage("Falha no login");
      localStorage.setItem("token", data.token);
      setMessage("Login realizado");
    } catch {
      setMessage("Erro de rede");
    }
  }

  return (
    <section>
      <h1>Login</h1>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <label>Identificador</label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="CPF, matrícula, etc." />
        </div>
        {message && <p className="hint">{message}</p>}
        <div className="actions">
          <button className="btn primary">Entrar</button>
        </div>
      </form>
    </section>
  );
}

