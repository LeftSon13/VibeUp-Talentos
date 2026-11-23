import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "vibeup-talentos",
    compatibilityDate: "2026-11-23",
    workersDev: true,
    observability: {
      enabled: true,
    },
    assets: {
      notFoundHandling: "single-page-application",
    },
  },
});
