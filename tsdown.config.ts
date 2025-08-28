import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  minify: true,
  clean: true,
  platform: "node",
  target: "es2022",
});
