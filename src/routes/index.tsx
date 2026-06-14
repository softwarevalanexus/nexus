import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Home, Store, Package, Code2, Users, TrendingUp, LifeBuoy, Wallet, ShieldCheck,
  Megaphone, Network, Handshake, Building2, ChevronLeft, ChevronRight, Search,
  Bell, MessageSquare, AtSign, AlertTriangle, CheckCircle2, Clock, Activity,
  Sparkles, Command, Star, History, Zap, Crown, Bot, ArrowUpRight, Pause, Play,
  CircleDot, Flame, BookLock, KeyRound, ChevronDown, Inbox,
} from "lucide-react";
import { BlackBoxWorkspace } from "@/components/blackbox/BlackBoxWorkspace";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Founder Command Center" },
      { name: "description", content: "Premium founder command center — managers, decisions, approvals and live operations in one workspace." },
      { property: "og:title", content: "Founder Command Center" },
      { property: "og:description", content: "Premium founder command center for operating the entire business." },
    ],
  }),
  component: CommandCenter,
});

/* ------------------------------- Data ----------------------------------- */

const MANAGERS = [
  { id: "blackbox", label: "Black Box", icon: Package, grad: "var(--grad-violet)" },
  { id: "marketplace", label: "Marketplace Manager", icon: Store, grad: "var(--grad-cyan)" },
  { id: "usercustomer", label: "User / Customer Management", icon: Users, grad: "var(--grad-teal)" },
  { id: "reseller", label: "Reseller Management", icon: Network, grad: "var(--grad-indigo)" },
  { id: "franchise", label: "Franchise Management", icon: Building2, grad: "var(--grad-amber)" },
  { id: "influencer", label: "Influencer Management", icon: Star, grad: "var(--grad-magenta)" },
  { id: "affiliate", label: "Affiliate Management", icon: Handshake, grad: "var(--grad-emerald)" },
  { id: "application", label: "Application Management", icon: Code2, grad: "var(--grad-rose)" },
  { id: "support", label: "Support Management", icon: LifeBuoy, grad: "var(--grad-cyan)" },
  { id: "ams", label: "AMS", icon: TrendingUp, grad: "var(--grad-violet)" },
  { id: "content", label: "Content Management", icon: Megaphone, grad: "var(--grad-indigo)" },
] as const;

type Manager = (typeof MANAGERS)[number];

const MANAGER_STATS: Record<string, {
  pending: number; active: number; waiting: number; critical: number;
  approvals: number; reviews: number; bossActions: number;
  health: "healthy" | "watch" | "critical";
}> = {
  blackbox:      { pending: 8,  active: 34, waiting: 2, critical: 0, approvals: 1, reviews: 3, bossActions: 1, health: "healthy" },
  marketplace:   { pending: 12, active: 48, waiting: 3, critical: 1, approvals: 4, reviews: 2, bossActions: 2, health: "healthy" },
  usercustomer:  { pending: 24, active: 92, waiting: 6, critical: 1, approvals: 3, reviews: 5, bossActions: 2, health: "watch" },
  reseller:      { pending: 5,  active: 12, waiting: 2, critical: 0, approvals: 1, reviews: 1, bossActions: 0, health: "healthy" },
  franchise:     { pending: 3,  active: 6,  waiting: 7, critical: 1, approvals: 4, reviews: 2, bossActions: 3, health: "watch" },
  influencer:    { pending: 9,  active: 21, waiting: 4, critical: 0, approvals: 2, reviews: 1, bossActions: 1, health: "healthy" },
  affiliate:     { pending: 8,  active: 17, waiting: 4, critical: 0, approvals: 2, reviews: 0, bossActions: 1, health: "healthy" },
  application:   { pending: 15, active: 28, waiting: 8, critical: 2, approvals: 1, reviews: 4, bossActions: 3, health: "watch" },
  support:       { pending: 23, active: 11, waiting: 4, critical: 3, approvals: 0, reviews: 1, bossActions: 1, health: "critical" },
  ams:           { pending: 6,  active: 14, waiting: 3, critical: 0, approvals: 2, reviews: 2, bossActions: 1, health: "healthy" },
  content:       { pending: 11, active: 19, waiting: 3, critical: 0, approvals: 2, reviews: 4, bossActions: 1, health: "healthy" },
};

const BANNER_SLIDES = [
  { kind: "Critical Alert", title: "Payment gateway latency spike", desc: "Stripe webhooks delayed by 42s in EU region. Failover queued.", cta: "Investigate", grad: "var(--grad-rose)" },
  { kind: "Founder Message", title: "Q3 strategic offsite — Friday", desc: "Confirm attendance from leadership. 9 of 12 confirmed.", cta: "Review", grad: "var(--grad-violet)" },
  { kind: "Pending Decision", title: "Approve $148K marketplace expansion", desc: "Reseller LATAM rollout — waiting on founder sign-off.", cta: "Decide", grad: "var(--grad-cyan)" },
  { kind: "Revenue Milestone", title: "ARR crossed $12M this morning", desc: "+18% MoM. Enterprise tier contributed 64% of new MRR.", cta: "Open report", grad: "var(--grad-emerald)" },
  { kind: "Product Launch", title: "v4.2 ships to all tenants tonight", desc: "Founder approval required before global rollout window.", cta: "Approve rollout", grad: "var(--grad-indigo)" },
  { kind: "Security Notice", title: "2 high-privilege access requests", desc: "Awaiting founder approval — outside business hours policy.", cta: "Review access", grad: "var(--grad-magenta)" },
  { kind: "License Alert", title: "Enterprise license — Acme expires in 9 days", desc: "Renewal proposal drafted by sales. Needs your terms.", cta: "Open renewal", grad: "var(--grad-amber)" },
  { kind: "Marketplace", title: "3 partner apps awaiting publish", desc: "Vetting complete. Pending founder publishing approval.", cta: "Publish", grad: "var(--grad-teal)" },
  { kind: "Strategic Reminder", title: "Board pack due in 36 hours", desc: "Finance has prepared draft v3 — your section is empty.", cta: "Open draft", grad: "var(--grad-rose)" },
  { kind: "Sales Milestone", title: "Largest deal ever — $1.2M signed", desc: "Northwind Group. Multi-year. Toast the team.", cta: "Send message", grad: "var(--grad-emerald)" },
  { kind: "Operational", title: "Support backlog within SLA again", desc: "After 72h escalation — backlog cleared by 14:20.", cta: "View ops", grad: "var(--grad-cyan)" },
  { kind: "Franchise Update", title: "Mumbai franchise hit launch criteria", desc: "Ready to flip live. Awaiting your green light.", cta: "Go live", grad: "var(--grad-amber)" },
] as const;

/* --------------------------- Main component ----------------------------- */

function CommandCenter() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeManager, setActiveManager] = useState<string>("home");

  return (
    <div className="h-screen w-full overflow-hidden text-foreground">
      <div className="flex h-full w-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={activeManager} onSelect={setActiveManager} />

        <div className="flex h-full min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex min-h-0 flex-1 gap-4 px-5 pb-3 pt-2">
            <main className="min-w-0 flex-1 overflow-y-auto scrollbar-thin pr-1">
              {activeManager === "blackbox" ? (
                <BlackBoxWorkspace />
              ) : (
                <>
                  <HeroBanner />
                  <ManagerGrid onOpen={setActiveManager} />
                  <HomeSections />
                </>
              )}
              <div className="h-4" />
            </main>
            <ContextPanel />
          </div>
          <ActionStrip />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Sidebar ------------------------------- */

function Sidebar({
  collapsed, setCollapsed, active, onSelect,
}: { collapsed: boolean; setCollapsed: (b: boolean) => void; active: string; onSelect: (id: string) => void }) {
  const w = collapsed ? "w-[72px]" : "w-[244px]";
  return (
    <aside className={`${w} relative flex h-full flex-col border-r border-border bg-[color:var(--surface)]/60 backdrop-blur-xl transition-[width] duration-300`}>
      <div className={`flex items-center gap-3 px-4 pt-5 pb-4 ${collapsed ? "justify-center" : ""}`}>
        {collapsed ? (
          <BrandLogo variant="round" size={56} />

        ) : (
          <>
            <BrandLogo variant="long" size={44} className="-ml-1" />
          </>
        )}
      </div>

      <SidebarItem icon={Home} label="Home" collapsed={collapsed} active={active === "home"} onClick={() => onSelect("home")} />

      <div className={`mt-2 px-4 ${collapsed ? "sr-only" : ""}`}>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Managers</div>
      </div>

      <nav className="mt-1 flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
        {MANAGERS.map((m) => {
          const s = MANAGER_STATS[m.id];
          const badge = s.bossActions + s.critical;
          return (
            <SidebarItem
              key={m.id}
              icon={m.icon}
              label={m.label}
              collapsed={collapsed}
              active={active === m.id}
              badge={badge > 0 ? badge : undefined}
              dot={s.health}
              onClick={() => onSelect(m.id)}
            />
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-[color:var(--surface-2)] py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-3)]"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : (<><ChevronLeft className="h-4 w-4" /> Collapse</>)}
      </button>
    </aside>
  );
}

function SidebarItem({
  icon: Icon, label, collapsed, active, badge, dot, onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; collapsed: boolean; active?: boolean; badge?: number;
  dot?: "healthy" | "watch" | "critical"; onClick?: () => void;
}) {
  const dotColor = dot === "critical" ? "bg-destructive" : dot === "watch" ? "bg-[color:var(--warning)]" : dot === "healthy" ? "bg-[color:var(--success)]" : "";
  return (
    <button
      onClick={onClick}
      className={`group relative mx-2 my-0.5 flex w-[calc(100%-1rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${active ? "bg-[color:var(--surface-3)] text-foreground ring-1 ring-border" : "text-muted-foreground hover:bg-[color:var(--surface-2)] hover:text-foreground"}`}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
      {!collapsed && dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {badge !== undefined && (
        <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${collapsed ? "absolute right-1 top-1" : ""} bg-primary text-primary-foreground`}>
          {badge}
        </span>
      )}
      {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-primary" />}
    </button>
  );
}

/* -------------------------------- Top Bar ------------------------------- */

function TopBar() {
  return (
    <header className="flex items-center gap-3 px-5 pt-4 pb-2">
      <div className="flex items-center gap-2">
        <div className="text-[13px] text-muted-foreground">Good morning,</div>
        <div className="text-[13px] font-semibold">Arjun</div>
        <span className="ml-1 rounded-md bg-[color:var(--surface-2)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground ring-1 ring-border">Founder</span>
      </div>
      <div className="ml-4 hidden flex-1 md:flex">
        <div className="glass flex w-full max-w-xl items-center gap-2 rounded-xl px-3 py-2">
          <Command className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search anything — decisions, managers, people…"
          />
          <kbd className="rounded bg-[color:var(--surface-3)] px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">⌘K</kbd>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <IconBtn><Sparkles className="h-4 w-4" /></IconBtn>
        <IconBtn badge="3"><Bell className="h-4 w-4" /></IconBtn>
        <div className="ml-1 flex items-center gap-2 rounded-xl border border-border bg-[color:var(--surface)] px-2 py-1.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "var(--grad-cyan)" }}>
            <span className="text-[11px] font-bold text-white">AR</span>
          </div>
          <div className="leading-tight">
            <div className="text-xs font-semibold">Arjun R.</div>
            <div className="text-[10px] text-muted-foreground">Founder · CEO</div>
          </div>
          <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-[color:var(--surface)] text-muted-foreground hover:text-foreground hover:bg-[color:var(--surface-2)]">
      {children}
      {badge && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">{badge}</span>}
    </button>
  );
}

/* ------------------------------ Hero Banner ----------------------------- */

function HeroBanner() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % BANNER_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const slide = BANNER_SLIDES[i];

  return (
    <section className="relative mt-1 overflow-hidden rounded-2xl ring-1 ring-border" style={{ boxShadow: "var(--shadow-elevated)" }}>
      <div className="absolute inset-0 transition-[background] duration-700" style={{ background: slide.grad }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 80% at 80% 50%, oklch(1 0 0 / 0.18), transparent 60%), linear-gradient(180deg, oklch(0 0 0 / 0.15), oklch(0 0 0 / 0.45))",
      }} />
      <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -left-16 -bottom-20 h-72 w-72 rounded-full bg-black/30 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 px-7 py-6 md:grid-cols-[1.4fr_1fr] md:px-9 md:py-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
              {slide.kind}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-white/80">
              <CircleDot className="h-3 w-3 animate-pulse" /> Live · just now
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-white md:text-[28px]">
            {slide.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">{slide.desc}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm hover:bg-white/90">
              {slide.cta}
            </button>
            <button className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/15">
              Snooze
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/15"
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="hidden flex-col items-end justify-between md:flex">
          <div className="flex items-center gap-2">
            <span className="tabular-nums text-[11px] font-medium text-white/80">
              {String(i + 1).padStart(2, "0")} <span className="text-white/50">/ {String(BANNER_SLIDES.length).padStart(2, "0")}</span>
            </span>
            <div className="ml-2 flex gap-1">
              {BANNER_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-1 rounded-full transition-all ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/35 hover:bg-white/60"}`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="text-right text-white/85">
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/70">Boss action queue</div>
            <div className="mt-1 text-3xl font-semibold">17 <span className="text-base font-medium text-white/70">pending</span></div>
            <div className="mt-0.5 text-[11px] text-white/70">3 critical · 5 require approval</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Manager Grid ----------------------------- */

function ManagerGrid({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="mt-5">
      <SectionHeader title="Managers" hint="Operational status across the company" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MANAGERS.map((m) => <ManagerCard key={m.id} m={m} onOpen={() => onOpen(m.id)} />)}
      </div>
    </section>
  );
}

function ManagerCard({ m, onOpen }: { m: Manager; onOpen: () => void }) {
  const s = MANAGER_STATS[m.id];
  const Icon = m.icon;
  const healthCfg =
    s.health === "critical" ? { label: "Critical", dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/12", ring: "ring-destructive/35" } :
    s.health === "watch"    ? { label: "Watch",    dot: "bg-[color:var(--warning)]", text: "text-[color:var(--warning)]", bg: "bg-[color:var(--warning)]/12", ring: "ring-[color:var(--warning)]/35" } :
                              { label: "Healthy",  dot: "bg-[color:var(--success)]", text: "text-[color:var(--success)]", bg: "bg-[color:var(--success)]/12", ring: "ring-[color:var(--success)]/35" };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-[color:var(--surface)] p-4 transition-all hover:bg-[color:var(--surface-2)]" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="absolute inset-x-0 top-0 h-[2px] opacity-80" style={{ background: m.grad }} />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/10" style={{ background: m.grad }}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold">{m.label}</div>
            <div className="text-[11px] text-muted-foreground">Manager</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${healthCfg.bg} ${healthCfg.text} ${healthCfg.ring}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${healthCfg.dot}`} />
          {healthCfg.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center">
        <Stat label="Pending" value={s.pending} />
        <Stat label="Active" value={s.active} />
        <Stat label="Waiting" value={s.waiting} />
        <Stat label="Critical" value={s.critical} tone={s.critical > 0 ? "danger" : "default"} />
      </div>

      <div className="mt-3 space-y-1.5 text-[11px]">
        <Row icon={CheckCircle2} label="Needs approval" value={s.approvals} accent />
        <Row icon={Inbox} label="Needs review" value={s.reviews} />
        <Row icon={Crown} label="Boss actions" value={s.bossActions} accent={s.bossActions > 0} />
      </div>

      <button
        onClick={onOpen}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-[color:var(--surface-2)] py-2 text-xs font-medium text-foreground transition-colors hover:bg-[color:var(--surface-3)]"
      >
        Open {m.label} <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "default" | "danger" }) {
  return (
    <div className="rounded-lg bg-[color:var(--surface-2)] py-1.5 ring-1 ring-border">
      <div className={`text-sm font-semibold tabular-nums ${tone === "danger" && value > 0 ? "text-destructive" : ""}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Row({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <span className={`tabular-nums ${accent && value > 0 ? "text-primary font-semibold" : ""}`}>{value}</span>
    </div>
  );
}

/* ----------------------------- Home Sections ---------------------------- */

function HomeSections() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Panel title="Morning Brief" icon={Sparkles} accent="var(--grad-cyan)">
        <ul className="space-y-2.5 text-sm">
          <Brief tone="info">ARR pacing +18% MoM; enterprise dominant.</Brief>
          <Brief tone="warn">Support backlog elevated overnight — now clearing.</Brief>
          <Brief tone="danger">2 security access requests outside policy hours.</Brief>
          <Brief tone="info">7 founder decisions pending in the queue.</Brief>
        </ul>
      </Panel>

      <Panel title="Decision Queue" icon={Crown} accent="var(--grad-violet)" badge="7">
        <div className="space-y-2">
          {[
            { t: "Approve LATAM reseller expansion", s: "Sales · $148K budget", c: "Decide" },
            { t: "Sign off v4.2 production rollout", s: "Development · 22:00 UTC", c: "Approve" },
            { t: "Confirm Acme renewal terms", s: "Finance · 9 days left", c: "Review" },
            { t: "Publish 3 marketplace partner apps", s: "Marketplace · vetted", c: "Publish" },
          ].map((d) => (
            <div key={d.t} className="flex items-center justify-between rounded-xl bg-[color:var(--surface-2)] p-3 ring-1 ring-border">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{d.t}</div>
                <div className="truncate text-[11px] text-muted-foreground">{d.s}</div>
              </div>
              <button className="ml-3 shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">{d.c}</button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Company Pulse" icon={Activity} accent="var(--grad-emerald)">
        <div className="space-y-3 text-sm">
          <PulseRow label="Revenue today" value="$84,210" delta="+12%" tone="up" />
          <PulseRow label="New customers" value="47" delta="+9%" tone="up" />
          <PulseRow label="Active incidents" value="2" delta="-1" tone="up" />
          <PulseRow label="NPS (rolling 7d)" value="68" delta="+3" tone="up" />
          <PulseRow label="Cash runway" value="22 mo" delta="stable" tone="flat" />
        </div>
      </Panel>

      <Panel title="Attention Center" icon={Flame} accent="var(--grad-rose)" badge="5">
        <ul className="space-y-2 text-sm">
          {[
            { i: AlertTriangle, t: "EU payment latency spike", s: "Security · 14 min ago", tone: "danger" as const },
            { i: KeyRound, t: "Privileged access requests (2)", s: "Security · awaiting approval", tone: "danger" as const },
            { i: Clock, t: "Board pack section empty", s: "Finance · due 36h", tone: "warn" as const },
            { i: BookLock, t: "License expiring — Acme", s: "Finance · 9 days", tone: "warn" as const },
          ].map((a) => <AttentionRow key={a.t} {...a} />)}
        </ul>
      </Panel>

      <Panel title="Company Timeline" icon={History} accent="var(--grad-indigo)">
        <ol className="relative ml-3 space-y-3 border-l border-border pl-4 text-sm">
          {[
            { t: "ARR crossed $12M", s: "08:14 · Finance" },
            { t: "v4.2 release candidate signed off by QA", s: "07:42 · Development" },
            { t: "Northwind $1.2M contract executed", s: "07:05 · Sales" },
            { t: "Support backlog within SLA", s: "06:30 · Support" },
            { t: "Mumbai franchise reached launch criteria", s: "05:50 · Franchise" },
          ].map((e) => (
            <li key={e.t} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
              <div className="font-medium">{e.t}</div>
              <div className="text-[11px] text-muted-foreground">{e.s}</div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Boss Assistant" icon={Bot} accent="var(--grad-magenta)">
        <div className="space-y-3">
          <div className="rounded-xl bg-[color:var(--surface-2)] p-3 ring-1 ring-border">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Suggested action</div>
            <div className="mt-1 text-sm">
              Approve LATAM expansion now to unlock Q4 pipeline of <span className="font-semibold text-primary">$2.1M</span>. Risk: low.
            </div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>
              <button className="rounded-lg border border-border bg-[color:var(--surface)] px-3 py-1.5 text-xs">Ask follow-up</button>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-[color:var(--surface-2)] px-3 py-2">
            <Bot className="h-4 w-4 text-primary" />
            <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask your assistant…" />
            <kbd className="rounded bg-[color:var(--surface-3)] px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">↵</kbd>
          </div>
        </div>
      </Panel>
    </section>
  );
}

function Panel({ title, icon: Icon, accent, badge, children }: { title: string; icon: React.ComponentType<{ className?: string }>; accent: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[color:var(--surface)] p-4" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="absolute inset-x-0 top-0 h-[2px] opacity-70" style={{ background: accent }} />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg ring-1 ring-white/10" style={{ background: accent }}>
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {badge && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/30">{badge}</span>}
        </div>
        <button className="text-[11px] text-muted-foreground hover:text-foreground">View all</button>
      </div>
      {children}
    </div>
  );
}

function Brief({ tone, children }: { tone: "info" | "warn" | "danger"; children: React.ReactNode }) {
  const dot = tone === "danger" ? "bg-destructive" : tone === "warn" ? "bg-[color:var(--warning)]" : "bg-[color:var(--info)]";
  return (
    <li className="flex items-start gap-2.5">
      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}

function PulseRow({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "up" | "down" | "flat" }) {
  const c = tone === "up" ? "text-[color:var(--success)]" : tone === "down" ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="flex items-center justify-between rounded-xl bg-[color:var(--surface-2)] px-3 py-2 ring-1 ring-border">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-sm font-semibold tabular-nums">{value}</div>
        <div className={`text-[11px] font-medium ${c}`}>{delta}</div>
      </div>
    </div>
  );
}

function AttentionRow({ i: Icon, t, s, tone }: { i: React.ComponentType<{ className?: string }>; t: string; s: string; tone: "warn" | "danger" }) {
  const ring = tone === "danger" ? "ring-destructive/30 bg-destructive/10 text-destructive" : "ring-[color:var(--warning)]/30 bg-[color:var(--warning)]/10 text-[color:var(--warning)]";
  return (
    <li className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-2)] p-2.5 ring-1 ring-border">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${ring}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{t}</div>
        <div className="truncate text-[11px] text-muted-foreground">{s}</div>
      </div>
      <button className="rounded-md border border-border bg-[color:var(--surface)] px-2 py-1 text-[11px] hover:bg-[color:var(--surface-3)]">Open</button>
    </li>
  );
}

/* ----------------------------- Context Panel ---------------------------- */

const CTX_TABS = [
  { id: "approvals", label: "Approvals", icon: CheckCircle2 },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "mentions", label: "Mentions", icon: AtSign },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
] as const;

function ContextPanel() {
  const [tab, setTab] = useState<(typeof CTX_TABS)[number]["id"]>("approvals");

  return (
    <aside className="hidden w-[340px] shrink-0 flex-col rounded-2xl border border-border bg-[color:var(--surface)]/70 backdrop-blur-xl lg:flex" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-border px-2 py-2">
        {CTX_TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                active ? "bg-[color:var(--surface-3)] text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin p-3">
        {tab === "approvals" && <ApprovalsTab />}
        {tab === "chat" && <ChatTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "mentions" && <MentionsTab />}
        {tab === "alerts" && <AlertsTab />}
      </div>
    </aside>
  );
}

function ApprovalsTab() {
  const items = [
    { t: "Privileged access — db-prod", who: "Naina · Security", time: "4m" },
    { t: "Refund > policy ($2,400)", who: "Karan · Finance", time: "12m" },
    { t: "Marketplace listing v2", who: "Devika · Product", time: "28m" },
    { t: "Reseller onboarding — Acme", who: "Vikram · Sales", time: "1h" },
  ];
  return (
    <div className="space-y-2">
      {items.map((x) => (
        <div key={x.t} className="rounded-xl bg-[color:var(--surface-2)] p-3 ring-1 ring-border">
          <div className="text-sm font-medium">{x.t}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{x.who} · {x.time}</div>
          <div className="mt-2.5 flex gap-2">
            <button className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground">Approve</button>
            <button className="flex-1 rounded-lg border border-border bg-[color:var(--surface)] py-1.5 text-xs">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatTab() {
  const msgs = [
    { who: "Devika", grad: "var(--grad-violet)", msg: "Marketplace approvals sent to your queue.", time: "2m" },
    { who: "Karan", grad: "var(--grad-emerald)", msg: "Finance section drafted — needs your tone pass.", time: "9m" },
    { who: "Naina", grad: "var(--grad-magenta)", msg: "Confirmed: rotated key for Stripe prod.", time: "22m" },
    { who: "Vikram", grad: "var(--grad-cyan)", msg: "Northwind signed! Champagne on its way 🥂", time: "1h" },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2.5">
        {msgs.map((m) => (
          <div key={m.who + m.time} className="flex items-start gap-2.5">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: m.grad }}>
              {m.who.slice(0,2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 rounded-xl bg-[color:var(--surface-2)] p-2.5 ring-1 ring-border">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold">{m.who}</span>
                <span className="text-muted-foreground">{m.time}</span>
              </div>
              <div className="mt-0.5 text-[12px] text-foreground/90">{m.msg}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-[color:var(--surface-2)] px-3 py-2">
        <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Reply to team…" />
        <button className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">Send</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const items = [
    { i: Bell, t: "Stripe webhook latency cleared", s: "Just now", grad: "var(--grad-emerald)" },
    { i: TrendingUp, t: "Sales hit daily target by 11:40", s: "20m", grad: "var(--grad-cyan)" },
    { i: ShieldCheck, t: "Security review scheduled Fri", s: "1h", grad: "var(--grad-magenta)" },
    { i: Megaphone, t: "Marketing campaign live", s: "2h", grad: "var(--grad-violet)" },
  ];
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.t} className="flex items-center gap-3 rounded-xl bg-[color:var(--surface-2)] p-2.5 ring-1 ring-border">
          <span className="grid h-8 w-8 place-items-center rounded-lg ring-1 ring-white/10" style={{ background: n.grad }}>
            <n.i className="h-4 w-4 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm">{n.t}</div>
            <div className="text-[11px] text-muted-foreground">{n.s}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ActivityTab() {
  return (
    <ol className="relative ml-2 space-y-3 border-l border-border pl-4 text-sm">
      {[
        ["Devika published 3 marketplace partner apps", "08:42"],
        ["Karan updated Q3 board pack draft", "08:30"],
        ["Naina rotated production keys", "07:55"],
        ["Vikram closed Northwind ($1.2M)", "07:05"],
        ["System: v4.2 build green", "06:40"],
      ].map(([t, s]) => (
        <li key={t} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-accent/20" />
          <div>{t}</div>
          <div className="text-[11px] text-muted-foreground">{s}</div>
        </li>
      ))}
    </ol>
  );
}

function MentionsTab() {
  return (
    <ul className="space-y-2">
      {[
        { who: "Karan", msg: "@founder need your tone on board pack section 4.", time: "8m" },
        { who: "Devika", msg: "@founder publish gate on marketplace v2?", time: "26m" },
        { who: "Naina", msg: "@founder approve privileged access for db-prod.", time: "44m" },
      ].map((m) => (
        <li key={m.time} className="rounded-xl bg-[color:var(--surface-2)] p-3 ring-1 ring-border">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold">{m.who}</span>
            <span className="text-muted-foreground">{m.time}</span>
          </div>
          <div className="mt-1 text-[13px]"><span className="text-primary">@founder</span>{m.msg.replace("@founder","")}</div>
        </li>
      ))}
    </ul>
  );
}

function AlertsTab() {
  return (
    <ul className="space-y-2">
      {[
        { t: "EU payment latency", s: "Critical · auto-failover queued", tone: "danger" as const },
        { t: "Privileged access (2)", s: "High · awaiting founder", tone: "danger" as const },
        { t: "License — Acme expiring", s: "Medium · 9 days", tone: "warn" as const },
        { t: "Backup verification overdue", s: "Medium · 6h", tone: "warn" as const },
      ].map((a) => (
        <li key={a.t} className={`rounded-xl p-3 ring-1 ${
          a.tone === "danger" ? "bg-destructive/10 ring-destructive/30" : "bg-[color:var(--warning)]/10 ring-[color:var(--warning)]/30"
        }`}>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className={`h-4 w-4 ${a.tone === "danger" ? "text-destructive" : "text-[color:var(--warning)]"}`} />
            {a.t}
          </div>
          <div className="mt-0.5 pl-6 text-[11px] text-muted-foreground">{a.s}</div>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------- Bottom Action Strip ------------------------ */

const STRIP_TABS = [
  { id: "decisions", label: "Decision Queue", icon: Crown, count: 7 },
  { id: "waiting", label: "Waiting for Boss", icon: Clock, count: 5 },
  { id: "recent", label: "Recently Opened", icon: History, count: 0 },
  { id: "favorites", label: "Favorites", icon: Star, count: 0 },
  { id: "critical", label: "Critical Center", icon: Flame, count: 3 },
  { id: "quick", label: "Quick Actions", icon: Zap, count: 0 },
] as const;

const STRIP_DATA: Record<string, { t: string; s: string; cta: string }[]> = {
  decisions: [
    { t: "LATAM reseller expansion", s: "$148K · Sales", cta: "Decide" },
    { t: "v4.2 production rollout", s: "22:00 UTC · Dev", cta: "Approve" },
    { t: "Acme renewal terms", s: "Finance · 9d", cta: "Review" },
    { t: "Publish partner apps (3)", s: "Marketplace", cta: "Publish" },
  ],
  waiting: [
    { t: "Tone pass — board pack §4", s: "Karan · 8m", cta: "Open" },
    { t: "Privileged access — db-prod", s: "Naina · 14m", cta: "Approve" },
    { t: "Marketplace publish gate", s: "Devika · 26m", cta: "Decide" },
    { t: "Franchise launch sign-off", s: "Mumbai · 1h", cta: "Go" },
  ],
  recent: [
    { t: "Marketplace · Listings", s: "8m ago", cta: "Open" },
    { t: "Finance · Renewals", s: "42m ago", cta: "Open" },
    { t: "Sales · Pipeline", s: "1h ago", cta: "Open" },
    { t: "Security · Access log", s: "2h ago", cta: "Open" },
  ],
  favorites: [
    { t: "Founder Decision Register", s: "Pinned", cta: "Open" },
    { t: "Knowledge Vault", s: "Pinned", cta: "Open" },
    { t: "License Command Center", s: "Pinned", cta: "Open" },
    { t: "Role Permission Matrix", s: "Pinned", cta: "Open" },
  ],
  critical: [
    { t: "EU payment latency", s: "Security · live", cta: "Investigate" },
    { t: "Privileged access (2)", s: "Security · high", cta: "Review" },
    { t: "Support SLA breach risk", s: "Support · 28m", cta: "Open" },
  ],
  quick: [
    { t: "Broadcast announcement", s: "Company-wide", cta: "Compose" },
    { t: "Emergency Mode", s: "Lockdown ops", cta: "Arm" },
    { t: "Issue License", s: "License center", cta: "Create" },
    { t: "Log Decision", s: "Founder register", cta: "Log" },
  ],
};

function ActionStrip() {
  const [tab, setTab] = useState<keyof typeof STRIP_DATA>("decisions");
  const data = useMemo(() => STRIP_DATA[tab], [tab]);

  return (
    <footer className="mx-5 mb-4 rounded-2xl border border-border bg-[color:var(--surface)]/85 backdrop-blur-xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin border-b border-border px-3 py-2">
        {STRIP_TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as keyof typeof STRIP_DATA)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active ? "bg-[color:var(--surface-3)] text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
              {t.count > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-[color:var(--surface-3)] text-foreground"}`}>{t.count}</span>
              )}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 pr-1 text-[11px] text-muted-foreground">
          <Command className="h-3.5 w-3.5" /> Press <kbd className="rounded bg-[color:var(--surface-3)] px-1 ring-1 ring-border">⌘K</kbd> for command palette
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 px-3 py-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((d) => (
          <div key={d.t} className="flex items-center justify-between rounded-xl bg-[color:var(--surface-2)] p-3 ring-1 ring-border">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{d.t}</div>
              <div className="truncate text-[11px] text-muted-foreground">{d.s}</div>
            </div>
            <button className="ml-3 shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground hover:opacity-90">
              {d.cta}
            </button>
          </div>
        ))}
      </div>
    </footer>
  );
}

/* ------------------------------ Helpers --------------------------------- */

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      <button className="text-[11px] text-muted-foreground hover:text-foreground">Customize</button>
    </div>
  );
}
