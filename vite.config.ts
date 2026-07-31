import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";
import flowbiteReact from "flowbite-react/plugin/vite";
import babel from "@rolldown/plugin-babel";

type BabelPluginOptions = Parameters<typeof babel>[0];

// Vitest sets process.env.VITEST to the literal string "true" (checked with
// strict equality, not Boolean(), so a stray unrelated env var can't match).
// None of these build/dev-only plugins matter for jsdom+RTL assertions:
// - flowbiteReact()'s class-list scanner keeps a handle open that delays
//   every test run's exit by ~10s;
// - the React Compiler babel pass and Tailwind's JIT scan add real per-file
//   transform cost with nothing for RTL's DOM assertions to observe.
const isTest = process.env.VITEST === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(isTest
      ? []
      : [
          babel({ presets: [reactCompilerPreset()] } as BabelPluginOptions),
          tailwindcss(),
          flowbiteReact(),
        ]),
  ],
  // devtools: {
  //   enabled: true,
  // },
  server: {
    forwardConsole: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: [...configDefaults.exclude, "tests/**"],
    restoreMocks: true,
  },
});
