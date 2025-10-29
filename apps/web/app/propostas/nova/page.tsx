"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function NovaProposta() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [orgUnitId, setOrgUnitId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`${API}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, orgUnitId, authorId, contentMd }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.error ? JSON.stringify(data.error) : "Falha ao criar proposta");
      } else {
        const created = await res.json();
        window.location.href = `/propostas/${created.id}`;
      }
    } catch (err) {
      setMessage("Erro de rede ao enviar proposta");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Nova proposta</h1>
      <p className="hint">Preencha os campos abaixo e envie.</p>
      <form className="form" onSubmit={onSubmit}>
        <div>
          <label>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título da proposta" />
        </div>
        <div>
          <label>Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="ex: reforma-estatuto" />
        </div>
        <div>
          <label>Org Unit ID</label>
          <input value={orgUnitId} onChange={(e) => setOrgUnitId(e.target.value)} required placeholder="ID da unidade organizacional" />
        </div>
        <div>
          <label>Autor ID</label>
          <input value={authorId} onChange={(e) => setAuthorId(e.target.value)} required placeholder="ID do autor" />
        </div>
        <div>
          <label>Conteúdo (Markdown)</label>
          <textarea value={contentMd} onChange={(e) => setContentMd(e.target.value)} required placeholder="# Título\n\nDescrição..." />
        </div>
        {message && <p className="hint">{message}</p>}
        <div className="actions">
          <button className="btn" type="button" onClick={() => history.back()}>Cancelar</button>
          <button className="btn primary" disabled={submitting}>
            {submitting ? "Enviando..." : "Criar proposta"}
          </button>
        </div>
      </form>
    </section>
  );
}

