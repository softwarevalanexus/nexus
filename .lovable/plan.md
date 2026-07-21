
## Scope

The uploaded `sapphire-cockpit-main` archive contains ~25 Manager modules and ~25 Dashboard modules. I will port every **Manager** module (per your "all manager only" instruction) into our Boss Panel as first-class modules, restyled to our Midnight Sapphire + Champagne Gold palette and our existing UI primitives (glass cards, PillButton, PageHeader, SubNav, StatCard, SectionRow).

## Managers to port (17 total)

From `src/components/*-manager/` and `src/pages/*Manager.tsx`:

1. HR Manager
2. Finance Manager (pro-accounting/pro-manager)
3. Marketing Manager
4. Lead Manager (CRM)
5. Sales Support Manager
6. Legal Compliance Manager
7. Performance Manager
8. Task Manager
9. SEO Manager
10. Influencer Manager
11. Reseller Manager
12. Franchise Manager
13. Product Demo Manager
14. API / AI Manager
15. Server Manager
16. Dev Manager
17. Assist Manager

(Marketplace Manager is already integrated — skipping.)

## Approach — same pattern as AMS + Marketplace Manager

For each manager:

1. Read the source folder in the archive, extract its section list, KPIs, tabs, sub-sections, and end-to-end flow (list → detail → drawer/modal).
2. Create `src/components/managers/<slug>/` with:
   - `<Name>Module.tsx` — stateful container mirroring the source's section navigation
   - `sections/` — one file per section, rebuilt with our `Card`, `PageHeader`, `SubNav`, `StatCard`, `PillButton`, `SectionRow` primitives from `src/components/marketplace-manager/ui.tsx` (extracted to a shared `src/components/managers/ui.tsx`)
3. Wire it into `src/routes/index.tsx` `ModuleShell` so clicking the manager in the Boss sidebar opens the full workspace (pixel-parity of structure, not raw source markup).
4. Reuse our tokens (`--primary`, `--accent`, `text-gradient`, `glass`, `glow-primary`) — never import the source's `index.css` variables.

## Restyle rules (non-negotiable)

- No source colours, no source Tailwind config. Use only our tokens.
- No `react-router-dom` — internal nav via local `useState` section switcher like `MarketplaceManagerModule`.
- No new deps. If a source module uses a lib we don't have (recharts, etc.), replace with our inline SVG mini-charts.
- Every module gets: PageHeader (eyebrow + title + description + actions), SubNav for sections, KPI strip (StatCard grid), main content, Suspense/Error boundary wrapper.

## Delivery order (batched for reviewability)

- **Batch 1** — Shared `managers/ui.tsx` + HR, Finance, Marketing, Lead, Sales Support
- **Batch 2** — Legal, Performance, Task, SEO, Influencer
- **Batch 3** — Reseller, Franchise, Product Demo, API/AI, Server, Dev, Assist
- Final — wire all 17 into Boss sidebar, verify typecheck, spot-check nav via Playwright

## Confirm before I start

1. Do you want **all 17 managers** in one plan-approved run, or start with Batch 1 only and iterate? (One run = large single delivery.)
2. Dashboards (HR/Franchise/Reseller/SEO/etc.) — port these too, or truly "managers only"?
3. Any manager to **drop or prioritize first**?
