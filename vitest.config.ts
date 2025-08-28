import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/app",
          include: ["**/*.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          include: ["src/**/*.e2e.spec.ts"],
          environment: "./prisma/test-environment.ts",
        },
      },
    ],
  },
});
