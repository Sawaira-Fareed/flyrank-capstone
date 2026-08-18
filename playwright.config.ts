import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  testIgnore: ["**/*.spec.tsx", "**/tests/**", "src/**"],
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
  },
});