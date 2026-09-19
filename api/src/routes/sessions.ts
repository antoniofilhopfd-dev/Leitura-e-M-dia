import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";

type SessionBody = {
  mediaId: string;
  quantity: number;
  date?: string;
};

const mediaSelect = {
  id: true,
  title: true,
  type: true,
  progress: { select: { unit: true } },
} as const;

export async function sessionRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/api/sessions", async (request) => {
    return prisma.activitySession.findMany({
      where: { media: { userId: request.user!.id } },
      include: { media: { select: mediaSelect } },
      orderBy: { date: "desc" },
      take: 200,
    });
  });

  app.post<{ Body: SessionBody }>("/api/sessions", async (request, reply) => {
    const { mediaId, quantity, date } = request.body ?? {};
    if (!mediaId || !quantity || quantity <= 0) {
      return reply.status(400).send({ error: "mediaId e quantity (> 0) são obrigatórios" });
    }

    const media = await prisma.mediaItem.findFirst({
      where: { id: mediaId, userId: request.user!.id },
      include: { progress: true },
    });
    if (!media) return reply.status(404).send({ error: "Não encontrado" });

    const startValue = media.progress?.currentValue ?? 0;
    const rawEndValue = startValue + quantity;
    const endValue = media.progress?.totalValue ? Math.min(rawEndValue, media.progress.totalValue) : rawEndValue;

    const session = await prisma.activitySession.create({
      data: {
        mediaId,
        date: date ? new Date(date) : new Date(),
        startValue,
        endValue,
        quantity,
      },
      include: { media: { select: mediaSelect } },
    });

    const updatedMedia = await prisma.mediaItem.update({
      where: { id: mediaId },
      data: {
        status: media.status === "want" ? "in_progress" : media.status,
        progress: media.progress ? { update: { currentValue: endValue } } : undefined,
      },
      include: { metadata: true, progress: true },
    });

    return reply.status(201).send({ session, media: updatedMedia });
  });

  app.delete<{ Params: { id: string } }>("/api/sessions/:id", async (request, reply) => {
    const session = await prisma.activitySession.findFirst({
      where: { id: request.params.id, media: { userId: request.user!.id } },
    });
    if (!session) return reply.status(404).send({ error: "Não encontrado" });

    await prisma.activitySession.delete({ where: { id: session.id } });
    return reply.status(204).send();
  });
}
