import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    alias: {
      "./_generated/api": path.resolve(__dirname, "./convex/_generated/api"),
    },
  },
});
