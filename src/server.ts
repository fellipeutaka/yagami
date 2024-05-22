import { app } from "./app";
import { env } from "./env";

await app.listen({
  port: env.PORT,
  host: "0.0.0.0",
});

console.info("🚀 HTTP Server Running!");
