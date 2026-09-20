import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Android app wrapper. The web app is built as a static single-page bundle
 * (see vite.config.android.ts) and loaded inside the Android WebView, so it
 * works offline.
 *
 * NOTE: `appId` is the permanent Android package name. Change it now if you
 * want a different one — it cannot be changed after publishing to Play Store.
 */
const config: CapacitorConfig = {
  appId: "com.orbit.cbsepractice",
  appName: "Orbit",
  webDir: "dist/client",
};

export default config;
