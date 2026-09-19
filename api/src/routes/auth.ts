import type { FastifyInstance } from "fastify";
import { createSession, destroySession, verifyPassword } from "../lib/auth";
import { SESSION_COOKIE_NAME, isProduction } from "../lib/config";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../plugins/requireAuth";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: LoginBody }>(
    "/api/auth/login",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 minute",
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body ?? {};

      if (!email || !password) {
        return reply.status(400).send({ error: "Informe e-mail e senha" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      const valid = user ? await verifyPassword(password, user.passwordHash) : false;

      if (!user || !valid) {
        return reply.status(401).send({ error: "E-mail ou senha inválidos" });
      }

      const { token, expiresAt } = await createSession(user.id);

      reply.setCookie(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
      });

      return reply.send({ user: { id: user.id, name: user.name, email: user.email } });
    },
  );

  app.post("/api/auth/logout", async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE_NAME];
    if (token) {
      await destroySession(token);
    }
    reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
    return reply.status(204).send();
  });

  app.get("/api/auth/me", { preHandler: requireAuth }, async (request, reply) => {
    return reply.send({ user: request.user });
  });
}
