import { Component, useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, Download, Filter, Inbox, Plus, RefreshCw, Search, TriangleAlert } from "lucide-react";
import { Card, PageHeader, PillButton, StatCard, SubNav } from "../marketplace-manager/ui";
import { MANAGER_CONFIGS, type ManagerConfig, type Section } from "./managerConfigs";

export function GenericManagerModule({
  managerId,
  sectionId,
  onSectionChange,
}: {
  managerId: string;
  sectionId?: string;
  onSectionChange?: (sectionId: string) => void;
}) {
  const cfg: ManagerConfig | undefined = MANAGER_CONFIGS[managerId];
  const [internalId, setInternalId] = useState<string | undefined>(sectionId);

  const activeId = sectionId ?? internalId;
  const section =
    cfg?.sections.find((s) => s.id === activeId) ?? cfg?.sections[0];

  const selectSection = (id: string) => {
    setInternalId(id);
    onSectionChange?.(id);
  };

  if (!cfg || !section) {
    return (
      <div className="px-4 py-10 md:px-8" data-testid="manager-module-missing">
        <PageHeader eyebrow="Not Found" title="Manager unavailable" description={`No configuration for "${managerId}".`} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8" data-testid={`manager-module-${managerId}`}>
      <PageHeader
        eyebrow={cfg.label}
        title={cfg.label.replace(" Manager", "") + " Control Room"}
        description={cfg.tagline}
        actions={
          <>
            <PillButton variant="ghost">
              <span className="inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> Export</span>
            </PillButton>
            <PillButton variant="primary">
              <span className="inline-flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> {section.primaryAction ?? "New"}
              </span>
            </PillButton>
          </>
        }
      />

      <SubNav
        items={cfg.sections.map((s) => s.label)}
        active={section.label}
        onChange={(label) => {
          const next = cfg.sections.find((s) => s.label === label);
          if (next) selectSection(next.id);
        }}
      />

      <SectionBoundary key={`${managerId}:${section.id}`}>
        <SectionLoader section={section} />
      </SectionBoundary>
    </div>
  );
}

/* ------------------------- Loading / Error states ------------------------ */

// Automation hooks used by the Playwright suite to exercise the empty and
// error branches of a section without mutating real data.
type TestFlags = { emptySection?: boolean; failSection?: boolean };
function testFlags(): TestFlags {
  if (typeof window === "undefined") return {};
  return ((window as unknown as { __SV_TEST__?: TestFlags }).__SV_TEST__) ?? {};
}

function SectionLoader({ section }: { section: Section }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const t = setTimeout(() => setReady(true), 180);
    return () => clearTimeout(t);
  }, [section.id]);

  if (!ready) return <SectionSkeleton />;
  if (testFlags().failSection) throw new Error("Forced section failure (automation hook).");
  return <SectionView section={section} />;
}


function SectionSkeleton() {
  return (
    <div className="space-y-6" data-testid="manager-section-loading" aria-busy="true">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-foreground/10" />
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-foreground/10" />
          <div className="h-5 w-56 animate-pulse rounded bg-foreground/10" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-foreground/5" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-border bg-foreground/5" />
    </div>
  );
}

class SectionBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Card className="p-10 text-center" data-testid="manager-section-error">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-destructive">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">This section failed to load</h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            {this.state.error.message || "An unexpected error occurred while rendering this workspace."}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            data-testid="manager-section-retry"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </Card>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------ Section view ----------------------------- */

function SectionView({ section }: { section: Section }) {
  const Icon = section.icon;
  const rows = testFlags().emptySection ? [] : section.rows;

  return (
    <div className="space-y-6" data-testid="manager-section" data-section-id={section.id}>
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{section.eyebrow}</div>
          <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{section.description}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {section.kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} delta={k.delta} tone={k.tone} icon={<k.icon className="h-3.5 w-3.5" />} />
        ))}
      </div>

      {/* Chips */}
      {section.chips && (
        <div className="scroll-row -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {section.chips.map((c, i) => (
            <button
              key={c}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors ${
                i === 0
                  ? "border-transparent bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder={`Search ${section.title.toLowerCase()}…`} className="flex-1 bg-transparent text-xs focus:outline-none" />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0">
        {rows.length === 0 ? (
          <div className="px-4 py-12 text-center" data-testid="manager-section-empty">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">No records yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              Nothing has been captured in {section.title.toLowerCase()} so far. Create the first entry to get started.
            </p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Plus className="h-3.5 w-3.5" /> {section.primaryAction ?? "New record"}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {section.columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-background/40">
                    {section.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-foreground/90">{r[c.key]}</td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                        Open <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
