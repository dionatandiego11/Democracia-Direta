import { Router } from "express";

export const authRouter = Router();

// Placeholder endpoints — pluggable with gov.br / OIDC later
authRouter.post("/login", async (req, res) => {
  const { identifier } = req.body ?? {};
  if (!identifier) return res.status(400).json({ error: "identifier required" });
  // TODO: validate with party ID or e-CPF, issue JWT
  return res.json({ token: "dev-token", user: { id: "demo", name: "Demo" } });
});

authRouter.post("/logout", async (_req, res) => {
  return res.json({ ok: true });
});

