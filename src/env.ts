import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z.string().trim().min(1),

  JWT_SECRET: z.string().trim().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    _env.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
