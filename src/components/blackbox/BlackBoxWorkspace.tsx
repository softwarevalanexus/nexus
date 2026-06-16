import { useMemo, useState } from "react";
import {
  Package, Cpu, BellRing, Power, ShieldCheck, CheckCircle2, KeyRound, Lock,
  Megaphone, Compass, Activity, BrainCircuit, BookLock, ScrollText, Bot,
  Inbox, ArrowUpRight, Search, Plus, Filter, Download, RefreshCw, ChevronRight,
  AlertTriangle, Clock, Eye, Globe, Smartphone, MonitorSmartphone, Fingerprint,
  FileCheck2, GitBranch, Users2, ShieldAlert, Network, X,
} from "lucide-react";

type ModuleId =
  | "api-ai" | "alerts" | "killswitch" | "roles" | "approvals" | "licenses"
  | "security" | "banners" | "decisions" | "operational" | "bi" | "knowledge"
  | "register" | "assistant";

type ModuleDef = {
  id: ModuleId;
  num: number;
  label: string;
  short: string;
  icon: React.ComponentType<{ className?: string }>;
  grad: string;
  purpose: string;
  reference: string;
  capabilities: string[];
  emptyTitle: string;
  emptyHint: string;
  primaryAction: string;
  deep?: boolean;
};

const MODULES: ModuleDef[] = [
  { id: "api-ai", num: 1, label: "API / AI / Extension Command Center", short: "API & AI", icon: Cpu, grad: "var(--grad-cyan)",
    purpose: "Global technology control — AI providers, models, agents, extensions, keys, usage and cost.",
    reference: "Postman · Kong · OpenAI Platform · LangSmith · Vercel Integrations",
    capabilities: ["AI Providers", "API Gateway", "Models", "Agents", "Extensions", "Webhooks", "Secrets", "Usage & Cost", "Audit"],
    emptyTitle: "No providers configured",
    emptyHint: "Connect your first AI provider, API gateway or extension to begin governing the technology layer.",
    primaryAction: "Connect provider" },
  { id: "alerts", num: 2, label: "Alert & Notification Command Center", short: "Alerts", icon: BellRing, grad: "var(--grad-rose)",
    purpose: "Global communication — alerts, notifications, emergency broadcasts, priority routing.",
    reference: "PagerDuty · Opsgenie · Slack Alerting",
    capabilities: ["Alert Rules", "Channels", "Escalation Policies", "Broadcasts", "Role Routing", "Department Routing", "Quiet Hours"],
    emptyTitle: "No alert channels configured",
    emptyHint: "Define your first channel and escalation policy to start receiving global alerts.",
    primaryAction: "Create channel" },
  { id: "killswitch", num: 3, label: "Kill Switch Command Center", short: "Kill Switch", icon: Power, grad: "var(--grad-rose)",
    purpose: "Emergency control — marketplace, AI, API, communication, user, security and global lockdown.",
    reference: "Cloudflare Emergency Controls · AWS Control Tower",
    capabilities: ["Marketplace Shutdown", "AI Shutdown", "API Shutdown", "Communication Shutdown", "User Shutdown", "Security Lockdown", "Global Lockdown"],
    emptyTitle: "All systems operational",
    emptyHint: "Kill switches are armed but inactive. Any trigger is logged and requires founder override.",
    primaryAction: "Review safeguards" },
  { id: "roles", num: 4, label: "Role & Permission Matrix", short: "Roles", icon: ShieldCheck, grad: "var(--grad-indigo)",
    purpose: "Global access layer — roles, permissions, module rights, approval rights, visibility and restriction rules.",
    reference: "Auth0 · Clerk · Keycloak · Supabase Auth",
    capabilities: ["Roles", "Permissions", "Access Rights", "Manager Rights", "Module Rights", "Approval Rights", "Visibility Rules", "Restriction Rules"],
    emptyTitle: "Role matrix not initialised",
    emptyHint: "Define your first role to begin assigning permissions across the platform.",
    primaryAction: "Create role", deep: true },
  { id: "approvals", num: 5, label: "Approval Engine", short: "Approvals", icon: CheckCircle2, grad: "var(--grad-cyan)",
    purpose: "Global approval layer — products, payments, licenses, security, legal, managers, escalations.",
    reference: "ServiceNow · Jira Workflow · Zoho Approvals",
    capabilities: ["Approval Flows", "SLA", "Quorum Rules", "Delegations", "Escalations", "Audit Trail"],
    emptyTitle: "No approval flows defined",
    emptyHint: "Create your first workflow to route product, payment, license, security or legal approvals.",
    primaryAction: "Create workflow", deep: true },
  { id: "licenses", num: 6, label: "License Command Center", short: "Licenses", icon: KeyRound, grad: "var(--grad-amber)",
    purpose: "Global license layer — generation, activation, binding, renewal, transfer, revocation, device mapping.",
    reference: "WHMCS · Keygen.sh · Cryptlex",
    capabilities: ["Generation", "Activation", "Binding", "Renewal", "Transfer", "Revocation", "Blocking", "Device Mapping", "License Analytics"],
    emptyTitle: "No licenses issued",
    emptyHint: "Define a license plan and issue your first activation key to begin tracking compliance.",
    primaryAction: "Define plan", deep: true },
  { id: "security", num: 7, label: "Security Center", short: "Security", icon: Lock, grad: "var(--grad-magenta)",
    purpose: "Global security layer — sessions, devices, IPs, threats, violations, lockdowns, audits.",
    reference: "Cloudflare Dashboard · CrowdStrike · Microsoft Defender",
    capabilities: ["Sessions", "Devices", "IP Controls", "Threats", "Violations", "Security Events", "Access Audits"],
    emptyTitle: "No security signals yet",
    emptyHint: "Connect identity, network and endpoint sources to begin streaming security telemetry.",
    primaryAction: "Connect source", deep: true },
  { id: "banners", num: 8, label: "Banner Management Center", short: "Banners", icon: Megaphone, grad: "var(--grad-violet)",
    purpose: "Global communication control across every dashboard and surface.",
    reference: "Shopify Announcements · Intercom · OneSignal",
    capabilities: ["Boss Panel", "Marketplace", "Reseller", "Developer", "Support", "CRM", "Franchise", "Role Based", "Country Based", "Emergency"],
    emptyTitle: "No active banners",
    emptyHint: "Compose a banner and target one or more dashboards to broadcast across the platform.",
    primaryAction: "Compose banner" },
  { id: "decisions", num: 9, label: "Decision Center", short: "Decisions", icon: Compass, grad: "var(--grad-violet)",
    purpose: "Founder decision layer — strategic, financial, operational, product and growth decisions.",
    reference: "Productboard · Linear · Notion Projects",
    capabilities: ["Strategic", "Financial", "Operational", "Product", "Growth", "Approval", "Company"],
    emptyTitle: "No decisions logged",
    emptyHint: "Capture your first founder decision to begin building the decision history.",
    primaryAction: "Log decision" },
  { id: "operational", num: 10, label: "Operational Center", short: "Operations", icon: Activity, grad: "var(--grad-emerald)",
    purpose: "Company command layer — marketplace, sales, CRM, development, support, marketing, security, finance.",
    reference: "Monday · ClickUp Operations · Asana Portfolio",
    capabilities: ["Marketplace", "Sales", "CRM", "Development", "Support", "Marketing", "Security", "Finance"],
    emptyTitle: "No operational signals yet",
    emptyHint: "Operational telemetry will appear here once managers begin reporting status.",
    primaryAction: "Configure status" },
  { id: "bi", num: 11, label: "Business Intelligence", short: "BI", icon: BrainCircuit, grad: "var(--grad-magenta)",
    purpose: "Executive insight — top products, markets, customers, countries, revenue, resellers, partners, opportunities.",
    reference: "Power BI · Looker · Tableau",
    capabilities: ["Top Products", "Top Markets", "Top Customers", "Top Countries", "Top Revenue", "Top Resellers", "Top Partners", "Opportunities"],
    emptyTitle: "No insights computed yet",
    emptyHint: "Insights are derived from connected revenue, marketplace and partner data.",
    primaryAction: "Connect sources" },
  { id: "knowledge", num: 12, label: "Knowledge Vault", short: "Knowledge", icon: BookLock, grad: "var(--grad-indigo)",
    purpose: "Company knowledge — SOPs, policies, guides, procedures, training, documentation.",
    reference: "Notion · Confluence · Obsidian",
    capabilities: ["SOPs", "Policies", "Guides", "Procedures", "Training", "Documentation", "Knowledge Articles"],
    emptyTitle: "Knowledge vault is empty",
    emptyHint: "Publish your first SOP, policy or guide to begin building the company brain.",
    primaryAction: "Create article" },
  { id: "register", num: 13, label: "Founder Decision Register", short: "Register", icon: ScrollText, grad: "var(--grad-emerald)",
    purpose: "Permanent company memory — decision, reason, impact, outcome, history, reference, audit.",
    reference: "Decision Logs · Executive Records",
    capabilities: ["Decision", "Reason", "Impact", "Outcome", "History", "Reference", "Audit"],
    emptyTitle: "Register is empty",
    emptyHint: "Once founder decisions are logged, they become a permanent, auditable record here.",
    primaryAction: "Open decisions" },
  { id: "assistant", num: 14, label: "Boss Assistant", short: "Assistant", icon: Bot, grad: "var(--grad-magenta)",
    purpose: "Founder operating assistant — what changed, needs approval, delayed, expiring, attention, decision.",
    reference: "Notion AI Home · Motion Briefing",
    capabilities: ["What Changed Today", "Needs Approval", "Delayed", "Expiring", "Attention", "Decisions", "Executive Summary", "Quick Actions"],
    emptyTitle: "Assistant is standing by",
    emptyHint: "Once data flows into Black Box, the assistant will summarise what needs your attention.",
    primaryAction: "Ask assistant" },
];

export function BlackBoxWorkspace() {
  const [activeId, setActiveId] = useState<ModuleId>(MODULES[0].id);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODULES;
    return MODULES.filter((m) => m.label.toLowerCase().includes(q) || m.short.toLowerCase().includes(q));
  }, [query]);

  const active = MODULES.find((m) => m.id === activeId) ?? MODULES[0];

  return (
    <div className="flex min-h-full flex-col">
      {/* Module Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <div className="absolute inset-0" style={{ background: "var(--grad-cyan)" }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 80% at 85% 50%, oklch(1 0 0 / 0.18), transparent 60%), linear-gradient(180deg, oklch(0 0 0 / 0.25), oklch(0 0 0 / 0.65))",
        }} />
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]" aria-hidden>
          <defs>
            <pattern id="bb-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bb-grid)" />
        </svg>

        <div className="relative flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-8 md:py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  Founder Control Tower
                </span>
                <span className="text-[11px] text-white/80">14 walls · global ownership</span>
              </div>
              <h1 className="mt-1.5 text-xl font-semibold text-white md:text-2xl">Black Box</h1>
              <p className="mt-0.5 max-w-xl text-[12px] text-white/85">
                The global control tower of the Software Vala ecosystem — every critical, sensitive, strategic and security-related system starts and ends here.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
              <Search className="h-3.5 w-3.5 text-white/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find wall…"
                className="w-44 bg-transparent text-[12px] text-white outline-none placeholder:text-white/60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Bar Module Nav */}
      <nav className="mt-3 rounded-2xl border border-border bg-[color:var(--surface)]/70 backdrop-blur-xl" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin px-2 py-2">
          {filtered.map((m) => {
            const Icon = m.icon;
            const isActive = m.id === active.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveId(m.id)}
                className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${
                  isActive
                    ? "bg-[color:var(--surface-3)] text-foreground ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-2)]"
                }`}
                title={m.label}
              >
                <span className="grid h-5 w-5 place-items-center rounded-md ring-1 ring-white/10" style={{ background: m.grad }}>
                  <Icon className="h-3 w-3 text-white" />
                </span>
                <span className="tabular-nums text-[10px] text-muted-foreground">{String(m.num).padStart(2, "0")}</span>
                <span className="whitespace-nowrap">{m.short}</span>
                {isActive && <span className="absolute -bottom-[9px] left-3 right-3 h-[2px] rounded-full" style={{ background: m.grad }} />}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-[12px] text-muted-foreground">No walls match "{query}"</div>
          )}
        </div>
      </nav>

      {/* Module Body */}
      <ModulePanel mod={active} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Module Panel Shell

function ModulePanel({ mod }: { mod: ModuleDef }) {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[color:var(--surface)]" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: mod.grad }} />
        <ModuleHeader mod={mod} />
        <CapabilityChips mod={mod} />
        {mod.deep ? <DeepPanel mod={mod} /> : <ShellEmptyState mod={mod} />}
      </div>
      <SideMetadata mod={mod} />
    </section>
  );
}

function ModuleHeader({ mod }: { mod: ModuleDef }) {
  const Icon = mod.icon;
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10" style={{ background: mod.grad }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="tabular-nums text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Wall {String(mod.num).padStart(2, "0")}
          </span>
          <h2 className="mt-0.5 text-base font-semibold">{mod.label}</h2>
          <p className="mt-0.5 max-w-2xl text-[12px] text-muted-foreground">{mod.purpose}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[color:var(--surface-2)] px-2.5 py-1 text-[10px] text-muted-foreground ring-1 ring-border">
          Reference · {mod.reference}
        </span>
      </div>
    </div>
  );
}

function CapabilityChips({ mod }: { mod: ModuleDef }) {
  return (
    <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
      {mod.capabilities.map((c) => (
        <span key={c} className="rounded-md bg-[color:var(--surface-2)] px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
          {c}
        </span>
      ))}
    </div>
  );
}

function ShellEmptyState({ mod }: { mod: ModuleDef }) {
  const Icon = mod.icon;
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl ring-1 ring-white/10" style={{ background: mod.grad }}>
        <Icon className="h-7 w-7 text-white" />
        <span className="absolute inset-0 rounded-2xl opacity-50 blur-xl" style={{ background: mod.grad }} />
      </div>
      <h3 className="text-base font-semibold">{mod.emptyTitle}</h3>
      <p className="mt-1.5 max-w-md text-[12px] text-muted-foreground">{mod.emptyHint}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> {mod.primaryAction}
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[color:var(--surface-2)] px-4 py-2 text-[12px] font-semibold text-foreground hover:bg-[color:var(--surface-3)]">
          Documentation <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function SideMetadata({ mod }: { mod: ModuleDef }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-2xl border border-border bg-[color:var(--surface)] p-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ownership</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ background: mod.grad }}>BB</div>
          <div className="leading-tight">
            <div className="text-[12px] font-semibold">Black Box</div>
            <div className="text-[10px] text-muted-foreground">Founder Control Tower</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <Stat n={0} label="Records" />
          <Stat n={0} label="Alerts" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-[color:var(--surface)] p-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Posture</div>
        <ul className="mt-2 space-y-1.5 text-[12px]">
          <li className="flex items-center justify-between"><span className="text-muted-foreground">Production grade</span><span className="text-[color:var(--success)]">Ready</span></li>
          <li className="flex items-center justify-between"><span className="text-muted-foreground">Audit trail</span><span className="text-[color:var(--success)]">Enabled</span></li>
          <li className="flex items-center justify-between"><span className="text-muted-foreground">Permissions</span><span className="text-muted-foreground">Founder · Admin</span></li>
          <li className="flex items-center justify-between"><span className="text-muted-foreground">Region</span><span className="text-muted-foreground">Global</span></li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-[color:var(--surface)] p-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recent activity</div>
        <div className="mt-3 flex flex-col items-center justify-center py-4 text-center">
          <Inbox className="h-5 w-5 text-muted-foreground" />
          <div className="mt-1.5 text-[12px] text-muted-foreground">No activity yet</div>
        </div>
      </div>
    </aside>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg bg-[color:var(--surface-2)] py-2 ring-1 ring-border">
      <div className="text-sm font-semibold tabular-nums">{n}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Deep panel dispatcher

function DeepPanel({ mod }: { mod: ModuleDef }) {
  switch (mod.id) {
    case "roles": return <RolesPanel mod={mod} />;
    case "approvals": return <ApprovalsPanel mod={mod} />;
    case "licenses": return <LicensesPanel mod={mod} />;
    case "security": return <SecurityPanel mod={mod} />;
    default: return <ShellEmptyState mod={mod} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared deep-panel primitives

function TabBar<T extends string>({
  tabs, value, onChange,
}: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-border px-3 py-2">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition ${
              active ? "bg-[color:var(--surface-2)] text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="rounded-full bg-[color:var(--surface-3)] px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground ring-1 ring-border">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Toolbar({
  placeholder, onPrimary, primaryLabel,
}: { placeholder: string; onPrimary: () => void; primaryLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
      <div className="flex flex-1 items-center gap-2 rounded-lg bg-[color:var(--surface-2)] px-3 py-2 ring-1 ring-border">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <input placeholder={placeholder} className="w-full bg-transparent text-[12px] outline-none placeholder:text-muted-foreground" />
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--surface-2)] px-3 py-2 text-[12px] text-muted-foreground ring-1 ring-border hover:text-foreground">
        <Filter className="h-3.5 w-3.5" /> Filter
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--surface-2)] px-3 py-2 text-[12px] text-muted-foreground ring-1 ring-border hover:text-foreground">
        <Download className="h-3.5 w-3.5" /> Export
      </button>
      <button className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--surface-2)] px-3 py-2 text-[12px] text-muted-foreground ring-1 ring-border hover:text-foreground">
        <RefreshCw className="h-3.5 w-3.5" /> Refresh
      </button>
      <button
        onClick={onPrimary}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground hover:opacity-90"
      >
        <Plus className="h-3.5 w-3.5" /> {primaryLabel}
      </button>
    </div>
  );
}

function KpiStrip({ items }: { items: { label: string; value: string; tone?: "ok" | "warn" | "danger" | "muted" }[] }) {
  const tone = (t?: string) =>
    t === "ok" ? "text-[color:var(--success)]" :
    t === "warn" ? "text-[color:var(--warning)]" :
    t === "danger" ? "text-[color:var(--destructive)]" :
    "text-foreground";
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border px-5 py-3 sm:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-lg bg-[color:var(--surface-2)] px-3 py-2 ring-1 ring-border">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
          <div className={`mt-0.5 text-sm font-semibold tabular-nums ${tone(k.tone)}`}>{k.value}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyRow({ icon: Icon, title, hint, action, onAction }: {
  icon: React.ComponentType<{ className?: string }>; title: string; hint: string; action?: string; onAction?: () => void;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--surface-2)] ring-1 ring-border">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h4 className="mt-3 text-sm font-semibold">{title}</h4>
      <p className="mt-1 max-w-md text-[12px] text-muted-foreground">{hint}</p>
      {action && (
        <button onClick={onAction} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> {action}
        </button>
      )}
    </div>
  );
}

function DrawerForm({
  open, onClose, title, subtitle, children, onSubmit, submitLabel,
}: {
  open: boolean; onClose: () => void; title: string; subtitle: string;
  children: React.ReactNode; onSubmit: () => void; submitLabel: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/55 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-md flex-col border-l border-border bg-[color:var(--surface)] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">New record</div>
            <h4 className="mt-0.5 text-sm font-semibold">{title}</h4>
            <p className="mt-0.5 text-[12px] text-muted-foreground">{subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-[color:var(--surface-2)] hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <button onClick={onClose} className="rounded-lg bg-[color:var(--surface-2)] px-3 py-2 text-[12px] text-muted-foreground ring-1 ring-border hover:text-foreground">
            Cancel
          </button>
          <button onClick={onSubmit} className="rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground hover:opacity-90">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </label>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-[color:var(--surface-2)] px-3 py-2 text-[12px] outline-none focus:ring-2 focus:ring-primary/50";

// ─────────────────────────────────────────────────────────────────────────────
// WALL 04 — Role & Permission Matrix

function RolesPanel({ mod }: { mod: ModuleDef }) {
  const [tab, setTab] = useState<"roles" | "permissions" | "matrix" | "delegations" | "audit">("roles");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <KpiStrip items={[
        { label: "Roles", value: "0" }, { label: "Permissions", value: "0" },
        { label: "Active members", value: "0" }, { label: "Pending delegations", value: "0", tone: "muted" },
      ]} />
      <TabBar
        value={tab} onChange={setTab}
        tabs={[
          { id: "roles", label: "Roles", count: 0 },
          { id: "permissions", label: "Permissions", count: 0 },
          { id: "matrix", label: "Access matrix" },
          { id: "delegations", label: "Delegations", count: 0 },
          { id: "audit", label: "Policy audit" },
        ]}
      />
      <Toolbar placeholder="Search roles, permissions, members…" onPrimary={() => setOpen(true)} primaryLabel={mod.primaryAction} />
      {tab === "matrix" ? (
        <EmptyRow icon={Network} title="Access matrix is empty"
          hint="The matrix renders once at least one role and one permission have been defined."
          action="Create role" onAction={() => setOpen(true)} />
      ) : tab === "audit" ? (
        <EmptyRow icon={FileCheck2} title="No policy changes yet"
          hint="Every role, permission and delegation change is recorded here with actor, timestamp and diff." />
      ) : tab === "delegations" ? (
        <EmptyRow icon={Users2} title="No active delegations"
          hint="Delegate scoped permissions to managers for a fixed window with full audit." action="New delegation" onAction={() => setOpen(true)} />
      ) : tab === "permissions" ? (
        <EmptyRow icon={ShieldCheck} title="No permissions defined"
          hint="Permissions group scopes (read · write · approve · revoke) per module." action="Define permission" onAction={() => setOpen(true)} />
      ) : (
        <EmptyRow icon={ShieldCheck} title={mod.emptyTitle} hint={mod.emptyHint} action={mod.primaryAction} onAction={() => setOpen(true)} />
      )}

      <DrawerForm open={open} onClose={() => setOpen(false)}
        title="Create role" subtitle="Define a role and the scopes it grants. Founder approval required to publish."
        submitLabel="Save draft" onSubmit={() => setOpen(false)}>
        <Field label="Role name"><input className={inputCls} placeholder="e.g. Marketplace Manager" /></Field>
        <Field label="Tier">
          <select className={inputCls} defaultValue="manager">
            <option value="founder">Founder</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="partner">Partner</option>
          </select>
        </Field>
        <Field label="Scope visibility" hint="Controls which dashboards this role can see.">
          <div className="grid grid-cols-2 gap-1.5 text-[12px]">
            {["Boss Panel","Marketplace","Reseller","Developer","Support","CRM","Franchise","Finance"].map((s) => (
              <label key={s} className="flex items-center gap-2 rounded-md bg-[color:var(--surface-2)] px-2 py-1.5 ring-1 ring-border">
                <input type="checkbox" className="accent-[color:var(--primary)]" /> {s}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Approval rights">
          <select className={inputCls}>
            <option>None</option><option>Recommend</option><option>Approve</option><option>Final approver</option>
          </select>
        </Field>
        <Field label="Restriction rules" hint="Comma-separated. e.g. no-revenue-export, no-license-revoke">
          <input className={inputCls} placeholder="no-export · no-revoke" />
        </Field>
      </DrawerForm>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WALL 05 — Approval Engine

function ApprovalsPanel({ mod }: { mod: ModuleDef }) {
  const [tab, setTab] = useState<"pending" | "flows" | "sla" | "escalations" | "audit">("pending");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <KpiStrip items={[
        { label: "Pending", value: "0" }, { label: "Approved (30d)", value: "0", tone: "ok" },
        { label: "Rejected (30d)", value: "0", tone: "muted" }, { label: "SLA breach", value: "0", tone: "muted" },
      ]} />
      <TabBar
        value={tab} onChange={setTab}
        tabs={[
          { id: "pending", label: "Pending queue", count: 0 },
          { id: "flows", label: "Workflows", count: 0 },
          { id: "sla", label: "SLA & Quorum" },
          { id: "escalations", label: "Escalations", count: 0 },
          { id: "audit", label: "Audit trail" },
        ]}
      />
      <Toolbar placeholder="Search requests, workflows, approvers…" onPrimary={() => setOpen(true)} primaryLabel={mod.primaryAction} />
      {tab === "pending" ? (
        <EmptyRow icon={Clock} title="Approval queue is clear" hint="New product, payment, license, security or legal approvals will appear here." />
      ) : tab === "flows" ? (
        <EmptyRow icon={GitBranch} title="No workflows defined"
          hint="A workflow routes a request through approvers with quorum, SLA and escalation rules." action="Create workflow" onAction={() => setOpen(true)} />
      ) : tab === "sla" ? (
        <EmptyRow icon={Clock} title="No SLA policies" hint="Define SLA windows and quorum thresholds per workflow." action="Add SLA policy" onAction={() => setOpen(true)} />
      ) : tab === "escalations" ? (
        <EmptyRow icon={AlertTriangle} title="No escalation paths" hint="Escalations trigger when SLA breaches or quorum is not met." action="Add escalation" onAction={() => setOpen(true)} />
      ) : (
        <EmptyRow icon={FileCheck2} title="No audit history" hint="Every decision is recorded with approver, reason, attached evidence and timestamp." />
      )}

      <DrawerForm open={open} onClose={() => setOpen(false)}
        title="Create approval workflow" subtitle="Define the request type, approvers, quorum and SLA. Founder is final approver by default."
        submitLabel="Save workflow" onSubmit={() => setOpen(false)}>
        <Field label="Workflow name"><input className={inputCls} placeholder="e.g. Product Publish · Pro Tier" /></Field>
        <Field label="Request type">
          <select className={inputCls}>
            <option>Product publish</option><option>Payment release</option><option>License issue</option>
            <option>License revoke</option><option>Security exception</option><option>Legal review</option>
          </select>
        </Field>
        <Field label="Approval chain" hint="Approvers run sequentially. Quorum applies within each step.">
          <textarea rows={3} className={inputCls} placeholder="Step 1: Manager · Step 2: Admin · Step 3: Founder" />
        </Field>
        <Field label="Quorum">
          <select className={inputCls}>
            <option>All approvers</option><option>Majority</option><option>Any one approver</option>
          </select>
        </Field>
        <Field label="SLA window"><input className={inputCls} placeholder="e.g. 24h" /></Field>
        <Field label="On SLA breach">
          <select className={inputCls}>
            <option>Escalate to founder</option><option>Auto-reject</option><option>Notify admin</option>
          </select>
        </Field>
      </DrawerForm>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WALL 06 — License Command Center

function LicensesPanel({ mod }: { mod: ModuleDef }) {
  const [tab, setTab] = useState<"licenses" | "plans" | "activations" | "devices" | "revoked" | "analytics">("licenses");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <KpiStrip items={[
        { label: "Active licenses", value: "0" }, { label: "Expiring 30d", value: "0", tone: "muted" },
        { label: "Bound devices", value: "0" }, { label: "Revoked", value: "0", tone: "muted" },
      ]} />
      <TabBar
        value={tab} onChange={setTab}
        tabs={[
          { id: "licenses", label: "Licenses", count: 0 },
          { id: "plans", label: "Plans", count: 0 },
          { id: "activations", label: "Activations", count: 0 },
          { id: "devices", label: "Devices", count: 0 },
          { id: "revoked", label: "Revoked", count: 0 },
          { id: "analytics", label: "Analytics" },
        ]}
      />
      <Toolbar placeholder="Search license keys, plans, customers, devices…" onPrimary={() => setOpen(true)} primaryLabel={mod.primaryAction} />
      {tab === "plans" ? (
        <EmptyRow icon={KeyRound} title="No license plans" hint="A plan defines duration, seat count, binding rules and renewal policy." action="Define plan" onAction={() => setOpen(true)} />
      ) : tab === "activations" ? (
        <EmptyRow icon={Fingerprint} title="No activations yet" hint="Activation events appear here with device fingerprint, IP and timestamp." />
      ) : tab === "devices" ? (
        <EmptyRow icon={MonitorSmartphone} title="No bound devices" hint="Each license can be bound to one or more devices based on plan policy." />
      ) : tab === "revoked" ? (
        <EmptyRow icon={ShieldAlert} title="No revoked licenses" hint="Revocations require approval and produce an immutable audit record." />
      ) : tab === "analytics" ? (
        <EmptyRow icon={BrainCircuit} title="License analytics unavailable" hint="Charts populate once activations, renewals and revocations have occurred." />
      ) : (
        <EmptyRow icon={KeyRound} title={mod.emptyTitle} hint={mod.emptyHint} action={mod.primaryAction} onAction={() => setOpen(true)} />
      )}

      <DrawerForm open={open} onClose={() => setOpen(false)}
        title="Define license plan" subtitle="Plans govern how license keys generate, bind, renew, transfer and revoke."
        submitLabel="Save plan" onSubmit={() => setOpen(false)}>
        <Field label="Plan name"><input className={inputCls} placeholder="e.g. Enterprise Annual · 50 seats" /></Field>
        <Field label="Product"><input className={inputCls} placeholder="Linked product / SKU" /></Field>
        <Field label="Duration">
          <select className={inputCls}>
            <option>Lifetime</option><option>1 year</option><option>6 months</option><option>3 months</option><option>1 month</option>
          </select>
        </Field>
        <Field label="Seat count"><input className={inputCls} placeholder="e.g. 50" /></Field>
        <Field label="Device binding">
          <select className={inputCls}>
            <option>Hardware fingerprint (1 device)</option><option>Up to N devices</option><option>Floating (concurrent)</option><option>No binding</option>
          </select>
        </Field>
        <Field label="Renewal policy">
          <select className={inputCls}>
            <option>Manual renewal</option><option>Auto-renew with approval</option><option>Auto-renew silent</option>
          </select>
        </Field>
        <Field label="On expiry">
          <select className={inputCls}>
            <option>Block activation</option><option>Read-only mode</option><option>Grace period 14d</option>
          </select>
        </Field>
      </DrawerForm>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WALL 07 — Security Center

function SecurityPanel({ mod }: { mod: ModuleDef }) {
  const [tab, setTab] = useState<"sessions" | "devices" | "ips" | "threats" | "violations" | "audit">("sessions");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <KpiStrip items={[
        { label: "Active sessions", value: "0" }, { label: "Threats (24h)", value: "0", tone: "ok" },
        { label: "Blocked IPs", value: "0", tone: "muted" }, { label: "Violations (24h)", value: "0", tone: "muted" },
      ]} />
      <TabBar
        value={tab} onChange={setTab}
        tabs={[
          { id: "sessions", label: "Sessions", count: 0 },
          { id: "devices", label: "Devices", count: 0 },
          { id: "ips", label: "IP controls", count: 0 },
          { id: "threats", label: "Threats", count: 0 },
          { id: "violations", label: "Violations", count: 0 },
          { id: "audit", label: "Access audit" },
        ]}
      />
      <Toolbar placeholder="Search sessions, devices, IPs, events…" onPrimary={() => setOpen(true)} primaryLabel="Add IP rule" />
      {tab === "sessions" ? (
        <EmptyRow icon={Eye} title="No active sessions" hint="Live user sessions across web, mobile and API appear here in real time." />
      ) : tab === "devices" ? (
        <EmptyRow icon={Smartphone} title="No registered devices" hint="Trusted device list with last-seen, fingerprint and risk score." />
      ) : tab === "ips" ? (
        <EmptyRow icon={Globe} title="No IP rules configured" hint="Allow, block and geo-rules for inbound traffic across all dashboards." action="Add IP rule" onAction={() => setOpen(true)} />
      ) : tab === "threats" ? (
        <EmptyRow icon={ShieldAlert} title="No threats detected" hint="Brute force, anomalous logins, token theft and exfiltration signals stream here." />
      ) : tab === "violations" ? (
        <EmptyRow icon={AlertTriangle} title="No policy violations" hint="Permission, license, MFA and data-handling violations are recorded with full context." />
      ) : (
        <EmptyRow icon={FileCheck2} title="No access events yet" hint="Every privileged read or write is recorded with actor, scope and reason." />
      )}

      <DrawerForm open={open} onClose={() => setOpen(false)}
        title="Add IP rule" subtitle="Apply allow, block or geo-fence rules globally or per dashboard."
        submitLabel="Apply rule" onSubmit={() => setOpen(false)}>
        <Field label="Action">
          <select className={inputCls}><option>Block</option><option>Allow</option><option>Challenge (CAPTCHA)</option><option>Rate limit</option></select>
        </Field>
        <Field label="Target">
          <select className={inputCls}>
            <option>All dashboards</option><option>Boss Panel</option><option>Marketplace</option><option>Reseller</option><option>Developer</option><option>API</option>
          </select>
        </Field>
        <Field label="IP / CIDR / Country" hint="One per line. Supports v4, v6, CIDR, ISO country code.">
          <textarea rows={3} className={inputCls} placeholder="203.0.113.0/24&#10;CN&#10;RU" />
        </Field>
        <Field label="Reason"><input className={inputCls} placeholder="Audit reason (required)" /></Field>
        <Field label="Expires"><input type="date" className={inputCls} /></Field>
      </DrawerForm>
    </div>
  );
}
