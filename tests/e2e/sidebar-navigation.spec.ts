import { expect, test, type Page } from "@playwright/test";
import { MANAGER_CONFIGS } from "../../src/components/managers/managerConfigs";
import { LIVE_MANAGERS } from "../../src/components/managers/live/liveConfig";
import { SECTION_GROUPS } from "../../src/components/marketplace-manager/TopBar";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/marketplace",
  "/marketplace/categories",
  "/marketplace/category/education",
  "/marketplace/industry/medical",
  "/marketplace/partner/reseller",
  "/marketplace/product/edu-pro",
  "/marketplace/vendor/vala",
];

async function expectNoTopBar(page: Page) {
  await expect(page.locator('[data-testid*="topbar" i], header.fixed, header.sticky')).toHaveCount(0);
}

async function expectHydrated(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true");
}

test.describe("single-sidebar navigation contract", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} does not render a top bar`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expectNoTopBar(page);
    });
  }

  test("every Boss manager route keeps the Boss sidebar", async ({ page }) => {
    const managerIds = new Set([
      "blackbox",
      "marketplace",
      "ams",
      ...Object.keys(MANAGER_CONFIGS),
      ...Object.keys(LIVE_MANAGERS),
    ]);

    for (const managerId of managerIds) {
      await page.goto(`/?m=${managerId}`, { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId("boss-sidebar")).toBeVisible();
      await expect(page.getByTestId(`sidebar-item-${managerId}`)).toHaveAttribute("aria-label", /.+/);
      await expectNoTopBar(page);
    }
  });

  test("Black Box exposes all grouped walls in its left sidebar", async ({ page }) => {
    await page.goto("/?m=blackbox", { waitUntil: "domcontentloaded" });
    await expectHydrated(page);
    await expect(page.getByTestId("blackbox-sidebar")).toBeVisible();

    const groups = {
      technology: ["api-ai", "alerts", "killswitch"],
      governance: ["roles", "approvals", "licenses", "security"],
      operations: ["banners", "decisions", "operational", "bi"],
      intelligence: ["knowledge", "register", "assistant"],
    } as const;

    for (const [group, modules] of Object.entries(groups)) {
      await expect(page.getByTestId(`blackbox-group-${group}`)).toBeVisible();
      for (const moduleId of modules) {
        const item = page.getByTestId(`blackbox-module-${moduleId}`);
        await expect(item).toBeVisible();
        await item.click();
        await expect(item).toHaveAttribute("aria-current", "page");
      }
    }
  });

  test("Marketplace Manager sidebar contains every configured section", async ({ page }) => {
    await page.goto("/?m=marketplace", { waitUntil: "domcontentloaded" });
    const sidebar = page.getByTestId("marketplace-manager-sidebar");
    await expect(sidebar).toBeVisible();
    for (const group of SECTION_GROUPS) {
      for (const section of group.items) {
        await expect(sidebar.getByRole("button", { name: section.label, exact: true })).toBeVisible();
      }
    }
    await expectNoTopBar(page);
  });

  test("AMS sidebar contains every grouped screen", async ({ page }) => {
    await page.goto("/?m=ams", { waitUntil: "domcontentloaded" });
    const sidebar = page.getByTestId("ams-sidebar");
    await expect(sidebar).toBeVisible();
    for (const group of ["Identity", "Recognition", "Progress", "Community", "Collections", "Analytics", "Settings"]) {
      await expect(sidebar.getByRole("heading", { name: group, exact: true })).toBeVisible();
    }
    await expectNoTopBar(page);
  });

  test("every storefront route shows module and library sidebar sections", async ({ page }) => {
    for (const route of PUBLIC_ROUTES.filter((path) => path.startsWith("/marketplace"))) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const sidebar = page.getByTestId("marketplace-sidebar");
      await expect(sidebar).toBeVisible();
      await expect(sidebar.getByTitle("Marketplace")).toBeVisible();
      await expect(sidebar.getByTitle("Home")).toBeVisible();
      await expectNoTopBar(page);
    }
  });
});