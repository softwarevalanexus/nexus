import { test, expect } from "@playwright/test";
import { MANAGER_CONFIGS } from "../../src/components/managers/managerConfigs";

const MANAGER_IDS = Object.keys(MANAGER_CONFIGS);
const managerId = MANAGER_IDS[0];
const cfg = MANAGER_CONFIGS[managerId];
const firstSection = cfg.sections[0];
const secondSection = cfg.sections[1] ?? cfg.sections[0];

test.describe("invalid URL params", () => {
  test("unknown manager id falls back to the home dashboard", async ({ page }) => {
    await page.goto("/?m=not-a-real-manager", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(`sidebar-item-${managerId}`)).toBeVisible();
    await expect(page.getByTestId("manager-section")).toHaveCount(0);
    await expect(page.getByTestId("manager-module-missing")).toHaveCount(0);
  });

  test("unknown section id falls back to the manager's first section", async ({ page }) => {
    await page.goto(`/?m=${managerId}&s=nope-not-here`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(`manager-module-${managerId}`)).toBeVisible();
    await expect(page.getByTestId("manager-section")).toHaveAttribute(
      "data-section-id",
      firstSection.id,
    );
  });

  test("section id from a different manager falls back safely", async ({ page }) => {
    const otherManager = MANAGER_IDS[1] ?? managerId;
    const foreignSection = MANAGER_CONFIGS[otherManager].sections.at(-1)!;
    await page.goto(`/?m=${managerId}&s=${foreignSection.id}`, { waitUntil: "domcontentloaded" });
    const sectionEl = page.getByTestId("manager-section");
    await expect(sectionEl).toBeVisible();
    const rendered = await sectionEl.getAttribute("data-section-id");
    expect(cfg.sections.map((s) => s.id)).toContain(rendered);
  });

  test("empty and malformed params are ignored", async ({ page }) => {
    for (const url of ["/?m=", "/?m=&s=", `/?s=${firstSection.id}`, "/?m=%20&s=%20"]) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId(`sidebar-item-${managerId}`)).toBeVisible();
      await expect(page.getByTestId("manager-section-error")).toHaveCount(0);
    }
  });

  test("extraneous unknown query params do not break the workspace", async ({ page }) => {
    await page.goto(`/?m=${managerId}&s=${secondSection.id}&foo=bar&page=99`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByTestId("manager-section")).toHaveAttribute(
      "data-section-id",
      secondSection.id,
    );
  });
});

test.describe("404 handling", () => {
  const badPaths = ["/definitely-not-a-route", "/marketplace/product/does-not-exist-xyz", "/a/b/c"];

  test("unmatched routes render the 404 page with a working home link", async ({ page }) => {
    await page.goto("/definitely-not-a-route", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByText("Page not found")).toBeVisible();

    await page.getByRole("link", { name: "Go home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByTestId(`sidebar-item-${managerId}`)).toBeVisible();
  });

  test("unmatched routes stay 404 after a refresh (shareable)", async ({ page }) => {
    for (const path of badPaths) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(500);
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.getByText(/404|not found/i).first()).toBeVisible();
    }
  });

  test("unknown product id renders a page instead of crashing", async ({ page }) => {
    const response = await page.goto("/marketplace/product/does-not-exist-xyz", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(500);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toBeVisible();
  });
});


test.describe("refresh and share of valid states", () => {
  test("manager state survives refresh and a fresh share-link visit", async ({ page, context }) => {
    await page.goto(`/?m=${managerId}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(`manager-module-${managerId}`)).toBeVisible();

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(`manager-module-${managerId}`)).toBeVisible();

    const shared = page.url();
    const fresh = await context.newPage();
    await fresh.goto(shared, { waitUntil: "domcontentloaded" });
    await expect(fresh.getByTestId(`manager-module-${managerId}`)).toBeVisible();
    await fresh.close();
  });

  test("sub-section state survives refresh, back/forward and sharing", async ({ page, context }) => {
    await page.goto(`/?m=${managerId}&s=${firstSection.id}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("manager-section")).toHaveAttribute(
      "data-section-id",
      firstSection.id,
    );

    const slug = secondSection.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await expect(async () => {
      await page.getByTestId(`subnav-${slug}`).click();
      await expect(page).toHaveURL(new RegExp(`[?&]s=${secondSection.id}(&|$)`), { timeout: 1000 });
    }).toPass({ timeout: 15_000 });

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("manager-section")).toHaveAttribute(
      "data-section-id",
      secondSection.id,
    );

    const shared = page.url();
    const fresh = await context.newPage();
    await fresh.goto(shared, { waitUntil: "domcontentloaded" });
    await expect(fresh.getByTestId("manager-section")).toHaveAttribute(
      "data-section-id",
      secondSection.id,
    );
    await fresh.close();
  });
});
