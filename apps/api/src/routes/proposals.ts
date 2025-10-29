import { Router } from "express";
import { prisma } from "@dd/db";
import { z } from "zod";

export const proposalsRouter = Router();

proposalsRouter.get("/", async (req, res) => {
  const { org } = req.query as { org?: string };
  const proposals = await prisma.proposal.findMany({
    where: org ? { orgUnit: { slug: String(org) } } : undefined,
    select: { id: true, title: true, slug: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(proposals);
});

proposalsRouter.post("/", async (req, res) => {
  const schema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
    orgUnitId: z.string(),
    authorId: z.string(),
    contentMd: z.string().min(1),
  });
  const input = schema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ error: input.error.flatten() });

  const { title, slug, orgUnitId, authorId, contentMd } = input.data;
  const created = await prisma.proposal.create({
    data: {
      title,
      slug,
      orgUnitId,
      authorId,
      versions: { create: { version: 1, contentMd, createdById: authorId } },
    },
    include: { versions: true },
  });
  res.status(201).json(created);
});

proposalsRouter.get('/:id', async (req, res) => {
  const id = String(req.params.id);
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      versions: { orderBy: { version: 'desc' }, take: 1 },
    }
  });
  if (!proposal) return res.status(404).json({ error: 'not found' });
  res.json(proposal);
});

