import type { FastifyInstance } from "fastify";
import type { MediaStatus, MediaType, ProgressUnit } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";

type MediaMetadataInput = {
  author?: string | null;
  year?: number | null;
  platform?: string | null;
  seasonCurrent?: number | null;
  seasonTotalEpisodes?: number | null;
  seriesTotalEpisodes?: number | null;
  chapterTotal?: number | null;
  durationSeconds?: number | null;
};

type ProgressInput = {
  currentValue?: number;
  totalValue?: number | null;
  unit: ProgressUnit;
};

type MediaBody = {
  type: MediaType;
  title: string;
  status?: MediaStatus;
  coverUrl?: string | null;
  genre?: string | null;
  rating?: number | null;
  notes?: string | null;
  metadata?: MediaMetadataInput;
  progress?: ProgressInput;
};

const includeRelations = {
  metadata: true,
  progress: true,
};

// Avaliação vai de 0 (sem nota) a 5 estrelas (seção 6) — validado aqui
// porque a UI usa o valor diretamente em `"★".repeat(rating)`.
function isValidRating(rating: number | null | undefined) {
  return rating == null || (Number.isInteger(rating) && rating >= 0 && rating <= 5);
}

export async function mediaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get<{ Querystring: { type?: MediaType; status?: MediaStatus; search?: string } }>(
    "/api/media",
    async (request) => {
      const { type, status, search } = request.query;

      return prisma.mediaItem.findMany({
        where: {
          userId: request.user!.id,
          ...(type ? { type } : {}),
          ...(status ? { status } : {}),
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { genre: { contains: search, mode: "insensitive" } },
                  { metadata: { is: { author: { contains: search, mode: "insensitive" } } } },
                  { metadata: { is: { platform: { contains: search, mode: "insensitive" } } } },
                ],
              }
            : {}),
        },
        include: includeRelations,
        orderBy: { updatedAt: "desc" },
      });
    },
  );

  app.get<{ Params: { id: string } }>("/api/media/:id", async (request, reply) => {
    const item = await prisma.mediaItem.findFirst({
      where: { id: request.params.id, userId: request.user!.id },
      include: {
        metadata: true,
        progress: true,
        sessions: { orderBy: { date: "desc" } },
        highlights: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!item) return reply.status(404).send({ error: "Não encontrado" });
    return item;
  });

  app.post<{ Body: MediaBody }>("/api/media", async (request, reply) => {
    const body = request.body;
    if (!body?.type || !body?.title?.trim()) {
      return reply.status(400).send({ error: "type e title são obrigatórios" });
    }
    if (!isValidRating(body.rating)) {
      return reply.status(400).send({ error: "rating deve ser um número inteiro de 0 a 5" });
    }

    const item = await prisma.mediaItem.create({
      data: {
        userId: request.user!.id,
        type: body.type,
        title: body.title.trim(),
        status: body.status ?? "want",
        coverUrl: body.coverUrl || null,
        genre: body.genre || null,
        rating: body.rating ?? null,
        notes: body.notes || null,
        metadata: body.metadata ? { create: body.metadata } : undefined,
        progress: body.progress
          ? {
              create: {
                currentValue: body.progress.currentValue ?? 0,
                totalValue: body.progress.totalValue ?? null,
                unit: body.progress.unit,
              },
            }
          : undefined,
      },
      include: includeRelations,
    });

    return reply.status(201).send(item);
  });

  app.patch<{ Params: { id: string }; Body: Partial<MediaBody> }>(
    "/api/media/:id",
    async (request, reply) => {
      const existing = await prisma.mediaItem.findFirst({
        where: { id: request.params.id, userId: request.user!.id },
      });
      if (!existing) return reply.status(404).send({ error: "Não encontrado" });

      const body = request.body;
      if (!isValidRating(body.rating)) {
        return reply.status(400).send({ error: "rating deve ser um número inteiro de 0 a 5" });
      }

      const item = await prisma.mediaItem.update({
        where: { id: existing.id },
        data: {
          title: body.title?.trim(),
          status: body.status,
          coverUrl: body.coverUrl,
          genre: body.genre,
          rating: body.rating,
          notes: body.notes,
          metadata: body.metadata
            ? { upsert: { create: body.metadata, update: body.metadata } }
            : undefined,
          progress: body.progress
            ? {
                upsert: {
                  create: {
                    currentValue: body.progress.currentValue ?? 0,
                    totalValue: body.progress.totalValue ?? null,
                    unit: body.progress.unit,
                  },
                  update: {
                    currentValue: body.progress.currentValue,
                    totalValue: body.progress.totalValue,
                    unit: body.progress.unit,
                  },
                },
              }
            : undefined,
        },
        include: includeRelations,
      });

      return item;
    },
  );

  app.delete<{ Params: { id: string } }>("/api/media/:id", async (request, reply) => {
    const existing = await prisma.mediaItem.findFirst({
      where: { id: request.params.id, userId: request.user!.id },
    });
    if (!existing) return reply.status(404).send({ error: "Não encontrado" });

    await prisma.mediaItem.delete({ where: { id: existing.id } });
    return reply.status(204).send();
  });
}
