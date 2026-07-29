import { test, expect, type Page } from "@playwright/test";

const TABS = [
  "all-demos", "live", "sandbox", "mobile", "offline",
  "credentials", "reset-expiry", "demo-seo", "health",
];

async function openDemo(page: Page, tab?: string) {
  await page.goto(`/?m=marketplace&s=demo${tab ? `&t=${tab}` : ""}`);
  await page.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Demo URL Command Center" })).toBeVisible();
}

/** Focus ring must be visible (non-zero outline or box-shadow ring) on the focused element. */
async function hasVisibleFocusRing(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return false;
    const cs = getComputedStyle(el);
    const outline = parseFloat(cs.outlineWidth || "0") > 0 && cs.outlineStyle !== "none";
    const shadow = cs.boxShadow && cs.boxShadow !== "none";
    return Boolean(outline || shadow);
  });
}

test.describe("Marketplace Manager accessibility — demo & SEO controls", () => {
  test("tab strip is a keyboard-operable tablist with arrow-key navigation", async ({ page }) => {
    await openDemo(page);
    const tablist = page.getByRole("tablist", { name: "Demo system tabs" });
    await expect(tablist).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(TABS.length);

    const active = page.getByTestId("subnav-all-demos");
    await expect(active).toHaveAttribute("aria-selected", "true");
    await expect(active).toHaveAttribute("tabindex", "0");
    // inactive tabs are removed from the tab sequence (roving tabindex)
    await expect(page.getByTestId("subnav-health")).toHaveAttribute("tabindex", "-1");

    await active.focus();
    expect(await hasVisibleFocusRing(page)).toBeTruthy();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByTestId("subnav-live")).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("subnav-all-demos")).toHaveAttribute("aria-selected", "true");
  });

  test("every surface action is reachable by keyboard and shows a focus ring", async ({ page }) => {
    await openDemo(page);
    for (const id of ["demo-open-live", "demo-copy-live", "demo-qr-live", "demo-reset-btn-live", "demo-toggle-live"]) {
      await page.getByTestId(id).focus();
      await expect(page.getByTestId(id)).toBeFocused();
      expect(await hasVisibleFocusRing(page)).toBeTruthy();
    }
    // Enter activates the focused control
    await page.getByTestId("demo-reset-btn-live").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("demo-reset-live")).toContainText("1 total");
  });

  test("focus order follows the visual order across the surface card", async ({ page }) => {
    await openDemo(page, "offline");
    await page.getByTestId("demo-open-offline").focus();
    const order: string[] = [];
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Tab");
      order.push(await page.evaluate(() => document.activeElement?.getAttribute("data-testid") ?? ""));
    }
    expect(order).toEqual([
      "demo-copy-offline",
      "demo-qr-offline",
      "demo-reset-btn-offline",
      "demo-toggle-offline",
    ]);
  });

  test("SEO guard toggles expose switch semantics and toggle with the keyboard", async ({ page }) => {
    await openDemo(page, "demo-seo");
    const switches = page.getByRole("switch");
    expect(await switches.count()).toBeGreaterThanOrEqual(6);
    const noindex = page.getByTestId("seo-noindex");
    await noindex.focus();
    expect(await hasVisibleFocusRing(page)).toBeTruthy();
    await expect(noindex).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Enter");
    await expect(noindex).toHaveAttribute("aria-checked", "false");
    await page.keyboard.press("Enter");
    await expect(noindex).toHaveAttribute("aria-checked", "true");
  });

  test("credential controls have accessible names and a live status region", async ({ page }) => {
    await openDemo(page, "credentials");
    await expect(page.getByRole("button", { name: "One-click login as Admin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy Admin credentials" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Rotate all" })).toBeVisible();
    const status = page.getByTestId("demo-status");
    await expect(status).toHaveAttribute("aria-live", "polite");
    await page.getByRole("button", { name: "One-click login as Admin" }).focus();
    expect(await hasVisibleFocusRing(page)).toBeTruthy();
    await page.keyboard.press("Enter");
    await expect(status).toContainText("One-click login issued for Admin");
  });

  test("QR dialog is announced as a modal dialog with an accessible name", async ({ page }) => {
    await openDemo(page);
    await page.getByTestId("demo-qr-admin").click();
    const dialog = page.getByRole("dialog", { name: /QR code for Admin Demo/i });
    await expect(dialog).toBeVisible();
    await page.getByRole("button", { name: "Close QR" }).focus();
    expect(await hasVisibleFocusRing(page)).toBeTruthy();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
  });

  test("no interactive control in demo/SEO tabs is missing an accessible name", async ({ page }) => {
    for (const tab of TABS) {
      await openDemo(page, tab);
      const unnamed = await page.evaluate(() => {
        const els = Array.from(
          document.querySelectorAll<HTMLElement>("button, a[href], [role='switch'], [role='tab']"),
        );
        return els
          .filter((el) => {
            const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || "").trim();
            return name.length === 0;
          })
          .map((el) => el.outerHTML.slice(0, 120));
      });
      expect(unnamed, `unnamed controls on tab ${tab}`).toEqual([]);
    }
  });
});
