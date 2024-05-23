import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environmentMatchGlobs: [["src/http/**", "./prisma/test-environment.ts"]],
  },
  plugins: [tsconfigPaths()],
});
