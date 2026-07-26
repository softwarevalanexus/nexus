import { test, expect, type Page } from "@playwright/test";
import { MANAGER_CONFIGS } from "../../src/components/managers/managerConfigs";

const MANAGER_IDS = Object.keys(MANAGER_CONFIGS);

async function openDeepLink(page: Page, manager: string, section?: string) {
  const url = section ? `/?m=${manager}&s=${section}` : `/?m=${manager}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
}

test.describe("deep links", () => {
  for (const managerId of MANAGER_IDS) {
    const cfg = MANAGER_CONFIGS[managerId];

    test(`${managerId}: every sub-section is deep-linkable`, async ({ page }) => {
      for (const section of cfg.sections) {
        await openDeepLink(page, managerId, section.id);
        const module = page.getByTestId(`manager-module-${managerId}`);
        await expect(module).toBeVisible();
        await expect(page.getByTestId("manager-section")).toHaveAttribute(
          "data-section-id",
          section.id,
        );
        // The URL survives a reload — shareable / refreshable state.
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page.getByTestId("manager-section")).toHaveAttribute(
          "data-section-id",
          section.id,
        );
      }
    });

    test(`${managerId}: opens from the sidebar and syncs the URL`, async ({ page }) => {
      await page.goto("/", { waitUntil: "load" });
      // Wait for hydration before interacting with the client router.
      await page.getByTestId("sidebar-item-home").click();
      await page.getByTestId(`sidebar-item-${managerId}`).click();

      await expect(page.getByTestId(`manager-module-${managerId}`)).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`[?&]m=${managerId}(&|$)`));

      // Sub-navigation writes the section into the URL.
      const second = cfg.sections[1] ?? cfg.sections[0];
      const slug = second.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await page.getByTestId(`subnav-${slug}`).click();
      await expect(page).toHaveURL(new RegExp(`[?&]s=${second.id}(&|$)`));
      await expect(page.getByTestId("manager-section")).toHaveAttribute(
        "data-section-id",
        second.id,
      );
    });

  }
});

test.describe("production states", () => {
  const managerId = MANAGER_IDS[0];
  const section = MANAGER_CONFIGS[managerId].sections[0];

  test("loading skeleton renders before section content", async ({ page }) => {
    await openDeepLink(page, managerId, section.id);
    await expect(page.getByTestId("manager-section-loading")).toBeVisible();
    await expect(page.getByTestId("manager-section")).toBeVisible();
    await expect(page.getByTestId("manager-section-loading")).toHaveCount(0);
  });

  test("empty state renders when a section has no records", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __SV_TEST__: unknown }).__SV_TEST__ = { emptySection: true };
    });
    await openDeepLink(page, managerId, section.id);
    await expect(page.getByTestId("manager-section-empty")).toBeVisible();
    await expect(page.getByText("No records yet")).toBeVisible();
  });

  test("error state renders with a working retry", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __SV_TEST__: Record<string, boolean> }).__SV_TEST__ = {
        failSection: true,
      };
    });
    await openDeepLink(page, managerId, section.id);
    await expect(page.getByTestId("manager-section-error")).toBeVisible();

    await page.evaluate(() => {
      (window as unknown as { __SV_TEST__: Record<string, boolean> }).__SV_TEST__ = {};
    });
    await page.getByTestId("manager-section-retry").click();
    await expect(page.getByTestId("manager-section")).toBeVisible();
  });
});
