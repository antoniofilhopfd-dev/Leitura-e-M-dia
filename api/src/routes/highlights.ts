import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";

type HighlightBody = {
  mediaId: string;
  text: string;
  page?: number | null;
};

export async function highlightRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get<{ Querystring: { mediaId?: string } }>("/api/highlights", async (request) => {
    return prisma.highlight.findMany({
      where: {
        media: { userId: request.user!.id },
        ...(request.query.mediaId ? { mediaId: request.query.mediaId } : {}),
      },
      include: { media: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
  });

  app.post<{ Body: HighlightBody }>("/api/highlights", async (request, reply) => {
    const { mediaId, text, page } = request.body ?? {};
    if (!mediaId || !text?.trim()) {
      return reply.status(400).send({ error: "mediaId e text são obrigatórios" });
    }

    const media = await prisma.mediaItem.findFirst({ where: { id: mediaId, userId: request.user!.id } });
    if (!media) return reply.status(404).send({ error: "Não encontrado" });

    const highlight = await prisma.highlight.create({
      data: { mediaId, text: text.trim(), page: page ?? null },
      include: { media: { select: { id: true, title: true } } },
    });

    return reply.status(201).send(highlight);
  });

  app.delete<{ Params: { id: string } }>("/api/highlights/:id", async (request, reply) => {
    const highlight = await prisma.highlight.findFirst({
      where: { id: request.params.id, media: { userId: request.user!.id } },
    });
    if (!highlight) return reply.status(404).send({ error: "Não encontrado" });

    await prisma.highlight.delete({ where: { id: highlight.id } });
    return reply.status(204).send();
  });
}
