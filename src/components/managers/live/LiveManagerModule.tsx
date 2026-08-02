import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Download,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Card, PageHeader, PillButton, StatCard, SubNav } from "../../marketplace-manager/ui";
import { LIVE_MANAGERS, type LiveField, type LiveSection } from "./liveConfig";

type Row = Record<string, unknown>;

/* ------------------------------ formatting ------------------------------- */

const money = (cents: unknown) =>
  typeof cents === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100)
    : "—";

const num = (v: unknown) => (typeof v === "number" ? new Intl.NumberFormat("en-US").format(v) : "—");

function displayValue(field: LiveField, row: Row, refLabels: Record<string, string>): string {
  const raw = row[field.key];
  if (raw === null || raw === undefined || raw === "") return "—";
  switch (field.type) {
    case "money":
      return money(Number(raw));
    case "percent":
      return `${Number(raw)}%`;
    case "number":
      return num(Number(raw));
    case "ref":
      return refLabels[String(raw)] ?? "—";
    default:
      return String(raw);
  }
}

/* -------------------------------- module --------------------------------- */

export function LiveManagerModule({
  managerId,
  sectionId,
  onSectionChange,
}: {
  managerId: string;
  sectionId?: string;
  onSectionChange?: (sectionId: string) => void;
}) {
  const cfg = LIVE_MANAGERS[managerId];
  const [internalId, setInternalId] = useState<string | undefined>(sectionId);
  const activeId = sectionId ?? internalId;
  const section = cfg?.sections.find((s) => s.id === activeId) ?? cfg?.sections[0];

  if (!cfg || !section) {
    return (
      <div className="px-4 py-10 md:px-8" data-testid="manager-module-missing">
        <PageHeader eyebrow="Not Found" title="Manager unavailable" description={`No live configuration for "${managerId}".`} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8" data-testid={`manager-module-${managerId}`}>
      <PageHeader
        eyebrow={cfg.label}
        title={cfg.label.replace(" Manager", "") + " Control Room"}
        description={cfg.tagline}
      />
      <SubNav
        items={cfg.sections.map((s) => s.label)}
        active={section.label}
        onChange={(label) => {
          const next = cfg.sections.find((s) => s.label === label);
          if (!next) return;
          setInternalId(next.id);
          onSectionChange?.(next.id);
        }}
      />
      <LiveSectionView key={`${managerId}:${section.id}`} section={section} />
    </div>
  );
}

/* ------------------------------ section view ----------------------------- */

function LiveSectionView({ section }: { section: LiveSection }) {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const rowsQuery = useQuery({
    queryKey: ["live", section.table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(section.table)
        .select("*")
        .order(section.orderBy.column, { ascending: section.orderBy.ascending ?? true });
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  // Resolve foreign keys to human labels so the table never shows raw ids.
  const refField = section.fields.find((f) => f.type === "ref");
  const refQuery = useQuery({
    queryKey: ["live-ref", refField?.refTable],
    enabled: Boolean(refField?.refTable),
    queryFn: async () => {
      const { data, error } = await supabase
        .from(refField!.refTable!)
        .select(`id, ${refField!.refLabel}`);
      if (error) throw new Error(error.message);
      const map: Record<string, string> = {};
      for (const r of (data ?? []) as Row[]) {
        map[String(r["id"])] = String(r[refField!.refLabel!] ?? "—");
      }
      return map;
    },
  });
  const refLabels = refQuery.data ?? {};

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(section.table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Record deleted");
      qc.invalidateQueries({ queryKey: ["live", section.table] });
    },
    onError: (e: Error) => toast.error(writeError(e)),
  });

  const rows = rowsQuery.data ?? [];

  const filterValues = useMemo(() => {
    if (!section.filterField) return [];
    const set = new Set<string>();
    for (const r of rows) {
      const v = r[section.filterField];
      if (v) set.add(String(v));
    }
    return ["All", ...[...set].sort()];
  }, [rows, section.filterField]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (section.filterField && filter !== "All" && String(r[section.filterField] ?? "") !== filter) return false;
      if (!q) return true;
      return section.fields.some((f) => displayValue(f, r, refLabels).toLowerCase().includes(q));
    });
  }, [rows, query, filter, section, refLabels]);

  const kpis = useMemo(() => {
    return section.kpis.map((k) => {
      let value = "—";
      if (k.kind === "count") value = num(rows.length);
      else if (k.kind === "countWhere")
        value = num(rows.filter((r) => String(r[k.field!] ?? "") === k.match).length);
      else if (k.kind === "sum") {
        const total = rows.reduce((a, r) => a + Number(r[k.field!] ?? 0), 0);
        value = k.format === "money" ? money(total) : num(total);
      } else if (k.kind === "avg") {
        const nums = rows.map((r) => Number(r[k.field!] ?? 0));
        const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
        value =
          k.format === "money" ? money(avg) : k.format === "percent" ? `${avg.toFixed(1)}%` : num(Math.round(avg));
      }
      const tone = k.tone === "up" ? "success" : k.tone === "down" ? "destructive" : "default";
      return { ...k, value, tone: tone as "success" | "destructive" | "default" };
    });
  }, [rows, section.kpis]);

  const exportCsv = () => {
    const header = section.fields.map((f) => f.label).join(",");
    const body = visible
      .map((r) => section.fields.map((f) => `"${displayValue(f, r, refLabels).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${section.table}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${visible.length} rows`);
  };

  const Icon = section.icon;

  return (
    <div className="space-y-6" data-testid="manager-section" data-section-id={section.id}>
      <div className="flex flex-wrap items-start justify-between gap-3">
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
        <div className="flex gap-2">
          <PillButton variant="ghost" onClick={() => rowsQuery.refetch()}>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${rowsQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
            </span>
          </PillButton>
          <PillButton variant="primary" onClick={() => setCreating(true)}>
            <span className="inline-flex items-center gap-1.5" data-testid="live-create">
              <Plus className="h-3.5 w-3.5" /> {section.primaryAction}
            </span>
          </PillButton>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} tone={k.tone} icon={<k.icon className="h-3.5 w-3.5" />} />
        ))}
      </div>

      {filterValues.length > 1 && (
        <div className="scroll-row -mx-1 flex gap-1.5 overflow-x-auto px-1">
          {filterValues.map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                v === filter
                  ? "border-transparent bg-gradient-to-r from-primary to-accent text-primary-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${section.title.toLowerCase()}…`}
              aria-label={`Search ${section.title}`}
              className="flex-1 bg-transparent text-xs focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {visible.length} of {rows.length}
          </span>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </Card>

      <Card className="p-0">
        {rowsQuery.isLoading ? (
          <div className="px-4 py-12 text-center text-xs text-muted-foreground" data-testid="manager-section-loading">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-accent" />
            <p className="mt-3">Loading live records…</p>
          </div>
        ) : rowsQuery.isError ? (
          <div className="px-4 py-12 text-center" data-testid="manager-section-error">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-destructive">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">Could not load this section</h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{(rowsQuery.error as Error).message}</p>
            <button
              onClick={() => rowsQuery.refetch()}
              data-testid="manager-section-retry"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="px-4 py-12 text-center" data-testid="manager-section-empty">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-muted-foreground">
              <Inbox className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-foreground">No records yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
              Nothing matches the current view in {section.title.toLowerCase()}.
            </p>
            <button
              onClick={() => setCreating(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> {section.primaryAction}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-background/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {section.fields.map((f) => (
                    <th key={f.key} className="px-4 py-3 font-semibold">{f.label}</th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={String(r["id"])} className="border-b border-border/60 last:border-0 hover:bg-background/40">
                    {section.fields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-foreground/90">{displayValue(f, r, refLabels)}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditing(r)}
                          data-testid="live-edit"
                          aria-label="Edit record"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this record permanently?")) remove.mutate(String(r["id"]));
                          }}
                          data-testid="live-delete"
                          aria-label="Delete record"
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] text-destructive hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <span className="hidden text-muted-foreground sm:inline">
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(creating || editing) && (
        <RecordDialog
          section={section}
          row={editing}
          refLabels={refLabels}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------ record dialog ---------------------------- */

function writeError(e: Error) {
  if (/row-level security|permission|JWT|denied/i.test(e.message)) {
    return "Sign in as an operator to change channel records.";
  }
  return e.message;
}

function RecordDialog({
  section,
  row,
  refLabels,
  onClose,
}: {
  section: LiveSection;
  row: Row | null;
  refLabels: Record<string, string>;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of section.fields) {
      const raw = row ? row[f.key] : f.default;
      init[f.key] = raw === null || raw === undefined ? "" : String(raw);
    }
    return init;
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      for (const f of section.fields) {
        const v = values[f.key];
        if (v === "" || v === undefined) {
          payload[f.key] = f.type === "ref" || f.type === "date" ? null : undefined;
          continue;
        }
        payload[f.key] =
          f.type === "money" || f.type === "number" || f.type === "percent" ? Number(v) : v;
      }
      for (const k of Object.keys(payload)) if (payload[k] === undefined) delete payload[k];

      if (row) {
        const { error } = await supabase.from(section.table).update(payload).eq("id", String(row["id"]));
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from(section.table).insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success(row ? "Record updated" : "Record created");
      qc.invalidateQueries({ queryKey: ["live", section.table] });
      onClose();
    },
    onError: (e: Error) => toast.error(writeError(e)),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${row ? "Edit" : "Create"} ${section.title}`}
        data-testid="live-dialog"
        className="glass max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{section.eyebrow}</div>
            <h3 className="text-lg font-bold text-foreground">
              {row ? `Edit ${section.title}` : section.primaryAction}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg border border-border bg-background/60 p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          {section.fields.map((f) => (
            <label key={f.key} className="block text-xs">
              <span className="mb-1 block font-semibold text-muted-foreground">
                {f.label}
                {f.required && <span className="text-destructive"> *</span>}
                {f.type === "money" && <span className="ml-1 font-normal">(cents)</span>}
              </span>
              {f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  required={f.required}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="">—</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : f.type === "ref" ? (
                <select
                  value={values[f.key] ?? ""}
                  required={f.required}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="">—</option>
                  {Object.entries(refLabels).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={values[f.key] ?? ""}
                  required={f.required}
                  type={f.type === "date" ? "date" : f.type === "text" ? "text" : "number"}
                  step={f.type === "percent" ? "0.1" : undefined}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              )}
            </label>
          ))}

          <div className="sm:col-span-2 mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              data-testid="live-save"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {row ? "Save changes" : "Create record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
