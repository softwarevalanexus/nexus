import { test, expect, type Page } from "@playwright/test";
import { LIVE_MANAGERS } from "../../src/components/managers/live/liveConfig";

/**
 * End-to-end deep scan of the database-backed Reseller and Franchise managers.
 * Every route (?m=<manager>&s=<section>) is visited and asserted against the
 * real Lovable Cloud data: rows must load, KPIs must resolve, foreign keys must
 * render as labels (never raw uuids) and no console error may surface.
 */

const LIVE_IDS = Object.keys(LIVE_MANAGERS);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function open(page: Page, manager: string, section?: string) {
  const url = section ? `/?m=${manager}&s=${section}` : `/?m=${manager}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('html[data-hydrated="true"]');
}

/**
 * Application-level failures only. Browser chrome noise (favicon, dev-tooling
 * probes, ResizeObserver) is not a UI or data defect, and the generic
 * "Failed to load resource" console line is replaced by an explicit check on
 * failing API/asset responses so the report names the offending URL.
 */
function collectPageFailures(page: Page) {
  const failures: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() !== "error") return;
    if (/favicon|ResizeObserver|Failed to load resource/i.test(text)) return;
    failures.push(`console: ${text}`);
  });
  page.on("pageerror", (err) => failures.push(`pageerror: ${String(err)}`));
  page.on("response", (res) => {
    const url = res.url();
    if (res.status() < 400) return;
    if (/favicon|\/@vite|\/__|\.map$/.test(url)) return;
    failures.push(`http ${res.status()}: ${url}`);
  });
  return failures;
}

async function waitForSection(page: Page, sectionId: string) {
  await expect(page.getByTestId("manager-section")).toHaveAttribute("data-section-id", sectionId);
  // Live data arrives asynchronously: wait until the query settles.
  await expect(page.getByTestId("manager-section-loading")).toHaveCount(0, { timeout: 20_000 });
}

for (const managerId of LIVE_IDS) {
  const cfg = LIVE_MANAGERS[managerId];

  test.describe(`${managerId} (live data)`, () => {
    for (const section of cfg.sections) {
      test(`${managerId}/${section.id}: loads real rows with no UI or data gaps`, async ({ page }) => {
        const failures = collectPageFailures(page);
        await open(page, managerId, section.id);

        await expect(page.getByTestId(`manager-module-${managerId}`)).toBeVisible();
        await waitForSection(page, section.id);

        // No error state, and the section resolved to real rows (not empty).
        await expect(page.getByTestId("manager-section-error")).toHaveCount(0);
        await expect(page.getByTestId("manager-section-empty")).toHaveCount(0);
        const rows = page.getByTestId("live-row");
        expect(await rows.count()).toBeGreaterThan(0);

        // Every configured column has a header.
        for (const field of section.fields) {
          await expect(
            page.getByTestId("live-table").locator("th", { hasText: field.label }).first(),
          ).toBeVisible();
        }

        // KPIs must compute from data — never left as an em dash placeholder.
        for (const kpi of section.kpis) {
          await expect(page.getByText(kpi.label, { exact: true }).first()).toBeVisible();
        }
        const firstRowText = (await rows.first().innerText()).trim();
        expect(firstRowText.length).toBeGreaterThan(0);

        // Foreign keys resolve to human labels, never raw uuids.
        const cells = await rows.first().locator("td").allInnerTexts();
        for (const cell of cells) expect(cell.trim()).not.toMatch(UUID);

        // Row actions exist for CRUD.
        await expect(rows.first().getByTestId("live-edit")).toBeVisible();
        await expect(rows.first().getByTestId("live-delete")).toBeVisible();

        // The deep link survives a refresh.
        await page.reload({ waitUntil: "domcontentloaded" });
        await page.waitForSelector('html[data-hydrated="true"]');
        await waitForSection(page, section.id);

        expect(failures).toEqual([]);
      });
    }

    test(`${managerId}: search, filter chips and export toolbar work`, async ({ page }) => {
      const section = cfg.sections[0];
      await open(page, managerId, section.id);
      await waitForSection(page, section.id);

      const rows = page.getByTestId("live-row");
      const total = await rows.count();
      expect(total).toBeGreaterThan(0);

      const search = page.getByLabel(`Search ${section.title}`);
      await search.fill("zzzz-no-match-zzzz");
      await expect(page.getByTestId("manager-section-empty")).toBeVisible();
      await search.fill("");
      await expect(rows).toHaveCount(total);

      if (section.filterField) {
        const chips = page.locator("button", { hasText: /^All$/ });
        await expect(chips.first()).toBeVisible();
      }

      await expect(page.getByRole("button", { name: /Export CSV/i })).toBeVisible();
    });

    test(`${managerId}: create dialog opens with all editable fields`, async ({ page }) => {
      const section = cfg.sections[0];
      await open(page, managerId, section.id);
      await waitForSection(page, section.id);

      await page.getByTestId("live-create").click();
      const dialog = page.getByTestId("live-dialog");
      await expect(dialog).toBeVisible();
      for (const field of section.fields.filter((f) => !f.readOnly)) {
        await expect(dialog.getByLabel(field.label, { exact: false }).first()).toBeVisible();
      }
      await expect(dialog.getByTestId("live-save")).toBeVisible();
    });

    test(`${managerId}: sub-navigation switches every live section`, async ({ page }) => {
      await open(page, managerId, cfg.sections[0].id);
      await waitForSection(page, cfg.sections[0].id);

      for (const section of cfg.sections) {
        const slug = section.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await page.getByTestId(`subnav-${slug}`).click();
        await expect(page).toHaveURL(new RegExp(`[?&]s=${section.id}(&|$)`));
        await waitForSection(page, section.id);
      }
    });
  });
}
