import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Static single-page build used ONLY for the Android (Capacitor) app.
 * The normal web/Vercel build keeps using vite.config.ts.
 *
 *   npm run build:android   ->   dist-android/  (index.html + assets)
 *
 * The practice app is fully client-side (questions are bundled, progress lives
 * in localStorage), so no server is needed inside the APK.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: { outputPath: "/index.html", crawlLinks: false },
      },
    }),
    viteReact(),
  ],
});
