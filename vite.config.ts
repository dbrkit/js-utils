import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    tsConfigPaths(),
    dts({
      // include: ["./src"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve("./src", "index.ts"),
      name: "JsUtils",
      formats: ["cjs", "es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
  },
}));
