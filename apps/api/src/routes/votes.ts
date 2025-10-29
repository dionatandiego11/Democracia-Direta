import { Router } from "express";
import { prisma } from "@dd/db";
import { z } from "zod";

export const votesRouter = Router();

votesRouter.get("/sessions", async (_req, res) => {
  const sessions = await prisma.voteSession.findMany({
    orderBy: { startsAt: "desc" },
    take: 50,
  });
  res.json(sessions);
});

votesRouter.post("/sessions", async (req, res) => {
  const schema = z.object({
    orgUnitId: z.string(),
    title: z.string().min(3),
    scope: z.string(),
    subjectId: z.string(),
    rule: z.nativeEnum((await import("@prisma/client")).VoteRule),
    startsAt: z.string().transform((v) => new Date(v)),
    endsAt: z.string().transform((v) => new Date(v)),
    createdById: z.string(),
  });
  const parsed = await schema.safeParseAsync(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const created = await prisma.voteSession.create({ data: parsed.data });
  res.status(201).json(created);
});

