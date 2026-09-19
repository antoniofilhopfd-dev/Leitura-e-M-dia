import path from "node:path";

export const SESSION_COOKIE_NAME = "leitura_media_session";

export const isProduction = process.env.NODE_ENV === "production";

export const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR ?? "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
