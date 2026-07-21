import { useState } from "react";
import { ArrowUpRight, Download, Filter, Plus, Search } from "lucide-react";
import { Card, PageHeader, PillButton, StatCard, SubNav } from "../marketplace-manager/ui";
import { MANAGER_CONFIGS, type ManagerConfig, type Section } from "./managerConfigs";

export function GenericManagerModule({ managerId }: { managerId: string }) {
  const cfg: ManagerConfig | undefined = MANAGER_CONFIGS[managerId];
  if (!cfg) {
    return (
      <div className="px-4 py-10 md:px-8">
        <PageHeader eyebrow="Not Found" title="Manager unavailable" description={`No configuration for "${managerId}".`} />
      </div>
    );
  }

  const [activeId, setActiveId] = useState(cfg.sections[0].id);
  const section = cfg.sections.find((s) => s.id === activeId) ?? cfg.sections[0];

  return (
    <div className="px-4 py-8 md:px-8">
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
          if (next) setActiveId(next.id);
        }}
      />

      <SectionView section={section} />
    </div>
  );
}

function SectionView({ section }: { section: Section }) {
  const Icon = section.icon;
  return (
    <div className="space-y-6">
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
              {section.rows.map((r, i) => (
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
              {section.rows.length === 0 && (
                <tr>
                  <td colSpan={section.columns.length + 1} className="px-4 py-10 text-center text-xs text-muted-foreground">
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
