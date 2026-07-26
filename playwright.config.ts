import { defineConfig, devices } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";

/** Reuse a Chromium already present in the environment (CI sandboxes ship one). */
function findChromium(): string | undefined {
  if (process.env.E2E_CHROMIUM) return process.env.E2E_CHROMIUM;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || "/";
  try {
    for (const dir of readdirSync(root)) {
      if (!dir.startsWith("chromium-")) continue;
      const bin = `${root.replace(/\/$/, "")}/${dir}/chrome-linux/chrome`;
      if (existsSync(bin)) return bin;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:8080",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: { executablePath: findChromium() },
      },
    },
  ],
});

