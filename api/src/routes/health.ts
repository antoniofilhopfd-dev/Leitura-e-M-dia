import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/api/health", async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({ status: "ok", database: "connected" });
    } catch (error) {
      app.log.error(error, "health check falhou ao conectar no banco");
      return reply.status(503).send({ status: "error", database: "unreachable" });
    }
  });
}
