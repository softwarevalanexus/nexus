import { test, expect, type Page } from "@playwright/test";

const SURFACES = [
  "live", "frontend", "backend", "admin", "customer", "vendor",
  "author", "mobile", "apk", "desktop", "offline", "sandbox",
];

async function openDemo(page: Page, tab?: string) {
  const url = `/?m=marketplace&s=demo${tab ? `&t=${tab}` : ""}`;
  await page.goto(url);
  await page.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Demo URL Command Center" })).toBeVisible();
}

test.describe("Demo URL Command Center — surface actions", () => {
  test("every surface exposes open/copy/qr/reset/disable and a resolved URL", async ({ page }) => {
    await openDemo(page);
    for (const key of SURFACES) {
      await expect(page.getByTestId(`demo-surface-${key}`)).toBeVisible();
      const url = (await page.getByTestId(`demo-url-${key}`).innerText()).trim();
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toContain("{slug}");
      await expect(page.getByTestId(`demo-open-${key}`)).toHaveAttribute("href", url);
      await expect(page.getByTestId(`demo-open-${key}`)).toHaveAttribute("target", "_blank");
      for (const action of ["copy", "qr", "reset-btn", "toggle"]) {
        await expect(page.getByTestId(`demo-${action}-${key}`)).toBeEnabled();
      }
    }
  });

  test("copy writes the demo URL to the clipboard and announces it", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openDemo(page);
    const url = (await page.getByTestId("demo-url-admin").innerText()).trim();
    await page.getByTestId("demo-copy-admin").click();
    await expect(page.getByTestId("demo-status")).toContainText("Copied Admin Demo URL");
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(url);
  });

  test("QR dialog opens with the surface URL and closes", async ({ page }) => {
    await openDemo(page);
    await page.getByTestId("demo-qr-sandbox").click();
    const dialog = page.getByTestId("demo-qr-dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId("demo-qr-url")).toHaveText(
      (await page.getByTestId("demo-url-sandbox").innerText()).trim(),
    );
    await page.getByTestId("demo-qr-close").click();
    await expect(dialog).toBeHidden();
  });

  test("disable then enable flips surface state and blocks opening while disabled", async ({ page }) => {
    await openDemo(page);
    await expect(page.getByTestId("demo-state-live")).toHaveText("Enabled");
    await page.getByTestId("demo-toggle-live").click();
    await expect(page.getByTestId("demo-state-live")).toHaveText("Disabled");
    await expect(page.getByTestId("demo-open-live")).toHaveAttribute("aria-disabled", "true");
    await page.getByTestId("demo-open-live").click();
    await expect(page.getByTestId("demo-status")).toContainText("disabled");
    expect(page.url()).toContain("m=marketplace");
    await page.getByTestId("demo-toggle-live").click();
    await expect(page.getByTestId("demo-state-live")).toHaveText("Enabled");
  });

  test("reset increments the reset counter for a surface", async ({ page }) => {
    await openDemo(page);
    await expect(page.getByTestId("demo-reset-backend")).toContainText("No reset");
    await page.getByTestId("demo-reset-btn-backend").click();
    await expect(page.getByTestId("demo-reset-backend")).toContainText("1 total");
    await page.getByTestId("demo-reset-btn-backend").click();
    await expect(page.getByTestId("demo-reset-backend")).toContainText("2 total");
    await expect(page.getByTestId("demo-status")).toContainText("snapshot restore #2");
  });

  test("filter tabs scope the surface matrix", async ({ page }) => {
    await openDemo(page);
    await page.getByTestId("subnav-offline").click();
    await expect(page.getByTestId("demo-surface-offline")).toBeVisible();
    await expect(page.getByTestId("demo-surface-admin")).toHaveCount(0);
    await page.getByTestId("subnav-mobile").click();
    await expect(page.getByTestId("demo-surface-apk")).toBeVisible();
    await expect(page.getByTestId("demo-surface-offline")).toHaveCount(0);
  });
});

test.describe("Credentials tab", () => {
  test("per-role one-click login issues a session token", async ({ page }) => {
    await openDemo(page, "credentials");
    await expect(page.getByTestId("demo-session-count")).toContainText("0");
    for (const role of ["admin", "customer", "vendor", "author", "support"]) {
      await expect(page.getByTestId(`demo-cred-${role}`)).toBeVisible();
      await page.getByTestId(`demo-login-${role}`).click();
    }
    await expect(page.getByTestId("demo-session-count")).toContainText("5");
    await expect(page.getByTestId("demo-status")).toContainText("TTL 15 min");
  });

  test("rotate all changes every credential fingerprint and revokes sessions", async ({ page }) => {
    await openDemo(page, "credentials");
    const before: string[] = [];
    for (const role of ["admin", "vendor", "support"]) {
      before.push((await page.getByTestId(`demo-pass-${role}`).innerText()).trim());
    }
    await page.getByTestId("demo-login-admin").click();
    await expect(page.getByTestId("demo-session-count")).toContainText("1");

    await page.getByTestId("demo-rotate-all").click();
    await expect(page.getByTestId("demo-rotation-count")).toContainText("1");
    await expect(page.getByTestId("demo-session-count")).toContainText("0");
    for (const [i, role] of ["admin", "vendor", "support"].entries()) {
      await expect(page.getByTestId(`demo-pass-${role}`)).not.toHaveText(before[i]);
    }
    await expect(page.getByTestId("demo-status")).toContainText("rotated");
  });

  test("guardrail disables one-click login for every role", async ({ page }) => {
    await openDemo(page, "credentials");
    const guard = page.getByTestId("guard-one-click");
    await expect(guard).toHaveAttribute("aria-checked", "true");
    await guard.click();
    await expect(guard).toHaveAttribute("aria-checked", "false");
    for (const role of ["admin", "customer", "vendor", "author", "support"]) {
      await expect(page.getByTestId(`demo-login-${role}`)).toBeDisabled();
    }
    await expect(page.getByTestId("demo-session-count")).toContainText("0");
    await guard.click();
    await expect(page.getByTestId("demo-login-admin")).toBeEnabled();
  });
});

test.describe("Demo SEO head tags", () => {
  const readHead = (page: Page) =>
    page.evaluate(() => ({
      robots: document.querySelector('meta[name="robots"][data-demo-seo]')?.getAttribute("content") ?? null,
      canonical: document.querySelector('link[rel="canonical"][data-demo-seo]')?.getAttribute("href") ?? null,
      robotsTxt: document.querySelector('meta[name="demo-robots-txt"]')?.getAttribute("content") ?? null,
      xRobots: document.querySelector('meta[name="x-robots-tag"]')?.getAttribute("content") ?? null,
      sitemap: document.querySelector('meta[name="demo-sitemap-exclude"]')?.getAttribute("content") ?? null,
      ai: document.querySelector('meta[name="demo-ai-crawlers"]')?.getAttribute("content") ?? null,
    }));

  test("emits noindex, canonical, robots, x-robots and sitemap exclusion", async ({ page }) => {
    await openDemo(page, "demo-seo");
    await expect(page.getByTestId("seo-emitted-head")).toContainText("noindex, nofollow, noarchive");
    const head = await readHead(page);
    expect(head.robots).toBe("noindex, nofollow, noarchive");
    expect(head.canonical).toContain("https://softwarewala.net/software/");
    expect(head.robotsTxt).toContain("Disallow: /");
    expect(head.xRobots).toBe("noindex, nofollow");
    expect(head.sitemap).toBe("true");
    expect(head.ai).toBe("blocked");
  });

  test("head tags persist after refresh and when the URL is shared", async ({ page, context }) => {
    await openDemo(page, "demo-seo");
    await page.reload();
    await page.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
    await expect(page.getByTestId("seo-emitted-head")).toBeVisible();
    expect((await readHead(page)).robots).toBe("noindex, nofollow, noarchive");

    const shared = await context.newPage();
    await shared.goto(page.url());
    await shared.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
    await expect(shared.getByTestId("seo-emitted-head")).toBeVisible();
    const head = await readHead(shared);
    expect(head.robots).toBe("noindex, nofollow, noarchive");
    expect(head.canonical).toContain("https://softwarewala.net/software/");
    await shared.close();
  });

  test("turning a guard off removes its tag from the document head", async ({ page }) => {
    await openDemo(page, "demo-seo");
    await page.getByTestId("seo-canonical").click();
    await expect(page.getByTestId("seo-canonical")).toHaveAttribute("aria-checked", "false");
    expect((await readHead(page)).canonical).toBeNull();
    await expect(page.getByTestId("seo-emitted-head")).not.toContainText("rel=\"canonical\"");

    await page.getByTestId("seo-noindex").click();
    expect((await readHead(page)).robots).toBeNull();
    await page.getByTestId("seo-noindex").click();
    expect((await readHead(page)).robots).toBe("noindex, nofollow, noarchive");
  });

  test("leaving the Demo SEO tab clears the demo head tags", async ({ page }) => {
    await openDemo(page, "demo-seo");
    expect((await readHead(page)).robots).not.toBeNull();
    await page.getByTestId("subnav-health").click();
    await expect(page.getByText("Uptime Monitors")).toBeVisible();
    expect((await readHead(page)).robots).toBeNull();
  });
});

test.describe("Deep links", () => {
  for (const tab of ["credentials", "reset-expiry", "demo-seo", "health"]) {
    test(`tab "${tab}" survives refresh`, async ({ page }) => {
      await openDemo(page, tab);
      await page.reload();
      await page.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
    await page.waitForSelector('html[data-hydrated="true"]', { timeout: 30_000 });
      await expect(page.getByTestId(`subnav-${tab}`)).toHaveAttribute("aria-selected", "true");
    });
  }

  test("unknown tab param falls back to the default tab", async ({ page }) => {
    await openDemo(page, "not-a-tab");
    await expect(page.getByTestId("subnav-all-demos")).toHaveAttribute("aria-selected", "true");
  });
});
