import { resolve } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "packages/template/*"],
    setupFiles: ["./tests/setup.ts"],
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "./src/index.ts"),
      name: "Cycle API Client",
      // the proper extensions will be added
      fileName: "index",
    },
  },
});
