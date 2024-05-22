import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  splitting: true,
  minify: true,
  clean: true,
});
