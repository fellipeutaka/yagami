import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import type { Environment } from "vitest/environments";
import { env } from "~/env";

const prisma = new PrismaClient();

function generateDatabaseUrl(schema: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

const environment: Environment = {
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = crypto.randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    process.env.DATABASE_URL = databaseUrl;

    execSync("pnpm db:migrate:deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};

export default environment;
