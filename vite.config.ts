import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  base: "/saude_data_warehouse/",
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "next/link": fileURLToPath(new URL("./src/compat/next-link.tsx", import.meta.url)),
      "next/navigation": fileURLToPath(new URL("./src/compat/next-navigation.ts", import.meta.url)),
      "next/image": fileURLToPath(new URL("./src/compat/next-image.tsx", import.meta.url)),
    },
  },
})
