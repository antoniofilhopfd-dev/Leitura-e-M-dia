import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";

export async function statsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/api/stats", async (request) => {
    const userId = request.user!.id;

    const items = await prisma.mediaItem.findMany({
      where: { userId },
      select: { type: true, status: true },
    });

    const totalByType: Record<string, number> = {};
    const completedByType: Record<string, number> = {};
    let inProgress = 0;
    let completed = 0;
    let wanted = 0;

    for (const item of items) {
      totalByType[item.type] = (totalByType[item.type] ?? 0) + 1;
      if (item.status === "completed") {
        completed += 1;
        completedByType[item.type] = (completedByType[item.type] ?? 0) + 1;
      }
      if (item.status === "in_progress") inProgress += 1;
      if (item.status === "want") wanted += 1;
    }

    const sessions = await prisma.activitySession.findMany({
      where: { media: { userId } },
      select: { quantity: true, media: { select: { progress: { select: { unit: true } } } } },
    });

    let pagesRead = 0;
    for (const session of sessions) {
      if (session.media.progress?.unit === "page") {
        pagesRead += session.quantity ?? 0;
      }
    }

    return {
      totalItems: items.length,
      inProgress,
      completed,
      wanted,
      totalByType,
      completedByType,
      pagesRead,
      sessionsCount: sessions.length,
    };
  });
}
