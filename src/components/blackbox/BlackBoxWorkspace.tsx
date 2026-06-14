import { useMemo, useState } from "react";
import {
  Package, Cpu, BellRing, Power, ShieldCheck, UserCog, Wallet,
  CheckCircle2, KeyRound, Lock, Megaphone, Workflow, Plug, BarChart3,
  Settings, Compass, Activity, BrainCircuit, BookLock, ScrollText, Bot,
  Inbox, ArrowUpRight, Search, Plus,
} from "lucide-react";

type ModuleDef = {
  id: string;
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
};

const MODULES: ModuleDef[] = [
  { id: "api-ai", num: 1, label: "API / AI / Extension Command Center", short: "API & AI", icon: Cpu, grad: "var(--grad-violet)",
    purpose: "Global API, AI, Agent and Integration control plane.",
    reference: "Postman · Kong · OpenAI Platform · LangSmith",
    capabilities: ["API Gateway", "AI Model Registry", "Agent Orchestration", "Extensions", "Rate Limits", "Usage & Cost"],
    emptyTitle: "No providers configured yet",
    emptyHint: "Connect your first API gateway, AI provider or extension to begin governing this environment.",
    primaryAction: "Connect provider" },
  { id: "alerts", num: 2, label: "Alert & Notification Command Center", short: "Alerts", icon: BellRing, grad: "var(--grad-rose)",
    purpose: "Global alerts, notifications, announcements and broadcasts.",
    reference: "PagerDuty · Opsgenie",
    capabilities: ["Alert Rules", "Channels", "Escalation Policies", "Broadcasts", "Announcements", "Quiet Hours"],
    emptyTitle: "No alert channels configured",
    emptyHint: "Define your first channel and escalation policy to start receiving global alerts.",
    primaryAction: "Create channel" },
  { id: "killswitch", num: 3, label: "Kill Switch Command Center", short: "Kill Switch", icon: Power, grad: "var(--grad-rose)",
    purpose: "Emergency lockdown — marketplace, communication, AI, global.",
    reference: "Cloudflare Emergency Controls",
    capabilities: ["Marketplace Shutdown", "Communication Shutdown", "AI Shutdown", "Global Shutdown", "Read-Only Mode", "Audit"],
    emptyTitle: "All systems operational",
    emptyHint: "Kill switches are armed but inactive. Triggering any switch is logged and irreversible without founder approval.",
    primaryAction: "Review safeguards" },
  { id: "roles", num: 4, label: "Role & Permission Matrix", short: "Roles", icon: ShieldCheck, grad: "var(--grad-indigo)",
    purpose: "Roles, permissions, access rights and visibility rules.",
    reference: "Auth0 · Keycloak · Clerk",
    capabilities: ["Roles", "Permissions", "Scopes", "Visibility Rules", "Delegations", "Policy Audit"],
    emptyTitle: "Role matrix not initialised",
    emptyHint: "Define your first role to begin assigning permissions across the platform.",
    primaryAction: "Create role" },
  { id: "employees", num: 5, label: "Employee Command Center", short: "Employees", icon: UserCog, grad: "var(--grad-teal)",
    purpose: "Internal team control — structure, performance, attendance.",
    reference: "Internal HRIS",
    capabilities: ["Employees", "Departments", "Teams", "Assignments", "Attendance", "Performance"],
    emptyTitle: "No employees on record",
    emptyHint: "Add departments and employees to begin tracking internal structure and performance.",
    primaryAction: "Add employee" },
  { id: "finance", num: 6, label: "Finance Command Center", short: "Finance", icon: Wallet, grad: "var(--grad-emerald)",
    purpose: "Global financial control — revenue, expenses, payouts, taxes.",
    reference: "Internal Ledger · Stripe · Razorpay",
    capabilities: ["Revenue", "Expenses", "Payouts", "Commissions", "Taxes", "Wallets", "Refunds"],
    emptyTitle: "No financial data yet",
    emptyHint: "Connect a payment gateway and ledger to populate revenue, payouts and tax reports.",
    primaryAction: "Connect gateway" },
  { id: "approvals", num: 7, label: "Approval Engine", short: "Approvals", icon: CheckCircle2, grad: "var(--grad-cyan)",
    purpose: "Global approval system across products, payments, licenses, security and legal.",
    reference: "ServiceNow · Jira Workflow",
    capabilities: ["Approval Flows", "SLA", "Quorum Rules", "Delegations", "Audit Trail", "Escalations"],
    emptyTitle: "No approval flows defined",
    emptyHint: "Create your first workflow to route product, payment, license, security or legal approvals.",
    primaryAction: "Create workflow" },
  { id: "licenses", num: 8, label: "License Command Center", short: "Licenses", icon: KeyRound, grad: "var(--grad-amber)",
    purpose: "Global license activation, renewal, binding, revocation, monitoring.",
    reference: "WHMCS · Keygen.sh · Cryptlex",
    capabilities: ["Activation", "Renewal", "Binding", "Revocation", "Monitoring", "Compliance"],
    emptyTitle: "No licenses issued yet",
    emptyHint: "Define a license plan and issue your first activation key to begin tracking compliance.",
    primaryAction: "Define plan" },
  { id: "security", num: 9, label: "Security Center", short: "Security", icon: Lock, grad: "var(--grad-magenta)",
    purpose: "Sessions, devices, threats, IPs, access logs and violations.",
    reference: "Cloudflare · CrowdStrike",
    capabilities: ["Sessions", "Devices", "Threats", "IP Controls", "Access Logs", "Violations"],
    emptyTitle: "No security signals yet",
    emptyHint: "Connect identity, network and endpoint sources to begin streaming security telemetry.",
    primaryAction: "Connect source" },
  { id: "banners", num: 10, label: "Banner Management Center", short: "Banners", icon: Megaphone, grad: "var(--grad-violet)",
    purpose: "Global banner control across all dashboards.",
    reference: "Shopify Announcement System",
    capabilities: ["Boss Panel", "Marketplace", "Reseller", "Affiliate", "Franchise", "Support", "Application"],
    emptyTitle: "No active banners",
    emptyHint: "Compose a banner and target one or more dashboards to broadcast across the platform.",
    primaryAction: "Compose banner" },
  { id: "automation", num: 11, label: "Automation Center", short: "Automation", icon: Workflow, grad: "var(--grad-indigo)",
    purpose: "Business automation — rules, triggers, schedulers, workflows, escalations.",
    reference: "Temporal · n8n · Zapier",
    capabilities: ["Rules", "Triggers", "Schedulers", "Workflows", "Actions", "Escalations"],
    emptyTitle: "No automations running",
    emptyHint: "Create your first rule or scheduled workflow to start automating operations.",
    primaryAction: "Create automation" },
  { id: "integrations", num: 12, label: "Integration Center", short: "Integrations", icon: Plug, grad: "var(--grad-cyan)",
    purpose: "External and internal connectivity — WhatsApp, email, SMS, payments, webhooks.",
    reference: "Twilio · SendGrid · Razorpay · Stripe",
    capabilities: ["WhatsApp", "Email", "SMS", "Payment Gateways", "Webhooks", "External Services"],
    emptyTitle: "No integrations connected",
    emptyHint: "Connect your first service to enable platform-wide communication and webhooks.",
    primaryAction: "Add integration" },
  { id: "analytics", num: 13, label: "Analytics & Reports Center", short: "Analytics", icon: BarChart3, grad: "var(--grad-emerald)",
    purpose: "Executive visibility — reports, analytics, trends, growth, rankings.",
    reference: "Power BI · Looker",
    capabilities: ["Reports", "Analytics", "Trends", "Growth", "Performance", "Rankings"],
    emptyTitle: "No reports generated",
    emptyHint: "Connect data sources to begin producing executive reports and trend analyses.",
    primaryAction: "Connect data" },
  { id: "settings", num: 14, label: "Settings & Configuration Center", short: "Settings", icon: Settings, grad: "var(--grad-teal)",
    purpose: "Global configuration — branding, languages, currencies, defaults, environments.",
    reference: "Internal Config Service",
    capabilities: ["Branding", "Languages", "Currencies", "System Defaults", "Global Settings", "Environments"],
    emptyTitle: "Configuration is at defaults",
    emptyHint: "Customise branding, supported languages, currencies and environment-level defaults.",
    primaryAction: "Edit configuration" },
  { id: "decisions", num: 15, label: "Decision Center", short: "Decisions", icon: Compass, grad: "var(--grad-violet)",
    purpose: "Founder decisions — strategic, financial, product, operational.",
    reference: "Productboard · Notion",
    capabilities: ["Strategic", "Financial", "Product", "Operational", "Open Decisions", "Decided"],
    emptyTitle: "No decisions logged",
    emptyHint: "Capture your first founder decision to begin building the decision history.",
    primaryAction: "Log decision" },
  { id: "operational", num: 16, label: "Operational Center", short: "Operations", icon: Activity, grad: "var(--grad-amber)",
    purpose: "Company operations overview — marketplace, reseller, support, application, content, system.",
    reference: "Internal Operations",
    capabilities: ["Marketplace", "Reseller", "Support", "Application", "Content", "System"],
    emptyTitle: "No operational signals yet",
    emptyHint: "Operational telemetry will appear here once managers begin reporting status.",
    primaryAction: "Configure status" },
  { id: "bi", num: 17, label: "Business Intelligence", short: "BI", icon: BrainCircuit, grad: "var(--grad-magenta)",
    purpose: "Executive insights — top products, markets, revenue sources, partners, opportunities.",
    reference: "Internal BI",
    capabilities: ["Top Products", "Top Markets", "Top Revenue", "Top Partners", "Opportunities", "Rankings"],
    emptyTitle: "No insights computed yet",
    emptyHint: "Insights are derived from connected revenue, marketplace and partner data.",
    primaryAction: "Connect sources" },
  { id: "knowledge", num: 18, label: "Knowledge Vault", short: "Knowledge", icon: BookLock, grad: "var(--grad-indigo)",
    purpose: "Company brain — SOPs, policies, guides, training, documentation.",
    reference: "Notion · Confluence",
    capabilities: ["SOPs", "Policies", "Guides", "Training", "Documentation", "Articles"],
    emptyTitle: "Knowledge vault is empty",
    emptyHint: "Publish your first SOP, policy or guide to begin building the company brain.",
    primaryAction: "Create article" },
  { id: "register", num: 19, label: "Founder Decision Register", short: "Register", icon: ScrollText, grad: "var(--grad-emerald)",
    purpose: "Permanent company memory — decision, reason, impact, outcome, audit trail.",
    reference: "Internal Register",
    capabilities: ["Decision", "Reason", "Impact", "Outcome", "History", "Audit Trail"],
    emptyTitle: "Register is empty",
    emptyHint: "Once founder decisions are logged, they become a permanent, auditable record here.",
    primaryAction: "Open decisions" },
  { id: "assistant", num: 20, label: "Boss Assistant", short: "Assistant", icon: Bot, grad: "var(--grad-magenta)",
    purpose: "Founder operating assistant — what changed, needs approval, delayed, expiring, attention.",
    reference: "Internal AI",
    capabilities: ["What Changed Today", "Needs Approval", "Delayed", "Expiring", "Attention", "Quick Actions"],
    emptyTitle: "Assistant is standing by",
    emptyHint: "Once data flows into Black Box, the assistant will summarise what needs your attention.",
    primaryAction: "Ask assistant" },
];

export function BlackBoxWorkspace() {
  const [activeId, setActiveId] = useState<string>(MODULES[0].id);
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
        <div className="absolute inset-0" style={{ background: "var(--grad-violet)" }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 80% at 85% 50%, oklch(1 0 0 / 0.18), transparent 60%), linear-gradient(180deg, oklch(0 0 0 / 0.15), oklch(0 0 0 / 0.55))",
        }} />
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

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
                <span className="text-[11px] text-white/80">20 modules · global ownership</span>
              </div>
              <h1 className="mt-1.5 text-xl font-semibold text-white md:text-2xl">Black Box</h1>
              <p className="mt-0.5 max-w-xl text-[12px] text-white/85">
                Everything critical, sensitive, global, strategic, financial, security-related, technical and system-wide is governed here.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
              <Search className="h-3.5 w-3.5 text-white/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find module…"
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
            <div className="px-3 py-2 text-[12px] text-muted-foreground">No modules match "{query}"</div>
          )}
        </div>
      </nav>

      {/* Module Body */}
      <ModulePanel mod={active} />
    </div>
  );
}

function ModulePanel({ mod }: { mod: ModuleDef }) {
  const Icon = mod.icon;
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      {/* Main */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[color:var(--surface)]" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: mod.grad }} />
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10" style={{ background: mod.grad }}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="tabular-nums text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Module {String(mod.num).padStart(2, "0")}
                </span>
              </div>
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

        {/* Capability chips */}
        <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
          {mod.capabilities.map((c) => (
            <span key={c} className="rounded-md bg-[color:var(--surface-2)] px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
              {c}
            </span>
          ))}
        </div>

        {/* Empty State */}
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
      </div>

      {/* Side metadata */}
      <aside className="space-y-3">
        <div className="rounded-2xl border border-border bg-[color:var(--surface)] p-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ownership</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg text-[10px] font-bold text-white" style={{ background: "var(--grad-violet)" }}>BB</div>
            <div className="leading-tight">
              <div className="text-[12px] font-semibold">Black Box</div>
              <div className="text-[10px] text-muted-foreground">Founder Control Tower</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-[color:var(--surface-2)] py-2 ring-1 ring-border">
              <div className="text-sm font-semibold tabular-nums">0</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Records</div>
            </div>
            <div className="rounded-lg bg-[color:var(--surface-2)] py-2 ring-1 ring-border">
              <div className="text-sm font-semibold tabular-nums">0</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Alerts</div>
            </div>
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
    </section>
  );
}
