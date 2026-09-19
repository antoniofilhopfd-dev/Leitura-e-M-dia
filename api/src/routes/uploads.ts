import path from "node:path";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";
import { UPLOADS_DIR } from "../lib/config";

// Upload manual de capa (seção 28 da especificação) — a busca automática
// por API externa fica para uma versão futura.
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/api/uploads", async (request, reply) => {
    const file = await request.file();
    if (!file) return reply.status(400).send({ error: "Nenhum arquivo enviado" });

    if (!ALLOWED_MIME.has(file.mimetype)) {
      return reply.status(400).send({ error: "Formato de imagem não suportado (use JPG, PNG, WEBP ou GIF)" });
    }

    const buffer = await file.toBuffer();
    const ext = path.extname(file.filename) || ".jpg";
    const filename = `${randomBytes(16).toString("hex")}${ext}`;

    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(path.join(UPLOADS_DIR, filename), buffer);

    const url = `/uploads/${filename}`;

    await prisma.upload.create({
      data: { userId: request.user!.id, url, kind: "cover" },
    });

    return reply.status(201).send({ url });
  });
}
