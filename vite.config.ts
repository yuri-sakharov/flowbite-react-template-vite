import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import babel from "@rolldown/plugin-babel";

type BabelPluginOptions = Parameters<typeof babel>[0];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] } as BabelPluginOptions),
    tailwindcss(),
    flowbiteReact(),
  ],
  // devtools: {
  //   enabled: true,
  // },
  server: {
    forwardConsole: true,
  }
});
