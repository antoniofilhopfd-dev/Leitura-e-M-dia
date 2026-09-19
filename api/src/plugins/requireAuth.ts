import type { FastifyReply, FastifyRequest } from "fastify";
import { getUserForSessionToken } from "../lib/auth";
import { SESSION_COOKIE_NAME } from "../lib/config";

export type AuthenticatedUser = { id: string; name: string; email: string };

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies[SESSION_COOKIE_NAME];
  if (!token) {
    return reply.status(401).send({ error: "Não autenticado" });
  }

  const user = await getUserForSessionToken(token);
  if (!user) {
    reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return reply.status(401).send({ error: "Sessão inválida ou expirada" });
  }

  request.user = { id: user.id, name: user.name, email: user.email };
}
