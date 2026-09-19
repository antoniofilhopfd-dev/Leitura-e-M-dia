import "dotenv/config";
import { buildServer } from "./server";

const port = Number(process.env.PORT ?? 3333);
const app = buildServer();

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
