import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import { mediaRoutes } from "./routes/media";
import { sessionRoutes } from "./routes/sessions";
import { highlightRoutes } from "./routes/highlights";
import { statsRoutes } from "./routes/stats";

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.register(cookie);

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(mediaRoutes);
  app.register(sessionRoutes);
  app.register(highlightRoutes);
  app.register(statsRoutes);

  return app;
}
