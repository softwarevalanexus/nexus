import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  MonitorPlay, Globe2, Link2, KeyRound, RotateCcw, RefreshCw, Play, Pause, Clock,
  QrCode, Copy, ExternalLink, ShieldCheck, Smartphone, Monitor, WifiOff, Package,
  Users, Store, PenTool, LayoutDashboard, Server, Activity, Search, Sparkles, X,
} from "lucide-react";
import { Card, EmptyHint, PageHeader, PillButton, StatCard, SubNav } from "../ui";

/* ---------------- micro primitives (demo-scoped) ---------------- */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function Tone({ tone, children }: { tone: "info" | "success" | "warning" | "danger" | "muted" | "premium"; children: ReactNode }) {
  const map: Record<string, string> = {
    info: "bg-accent/15 text-accent border-accent/30",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    danger: "bg-destructive/15 text-destructive border-destructive/30",
    muted: "bg-white/[0.04] text-muted-foreground border-border",
    premium: "bg-premium/15 text-premium border-premium/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}

function IconBtn({
  icon: Icon,
  label,
  tone = "muted",
  onClick,
  disabled,
  testId,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "muted" | "danger" | "success" | "accent";
  onClick?: () => void;
  disabled?: boolean;
  testId?: string;
  title?: string;
}) {
  const toneCls: Record<string, string> = {
    muted: "hover:border-accent/40 hover:text-accent",
    danger: "hover:border-destructive/50 hover:text-destructive",
    success: "hover:border-success/50 hover:text-success",
    accent: "border-accent/40 text-accent hover:bg-accent/10",
  };
  return (
    <button
      type="button"
      title={title ?? label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border bg-background/50 px-2 py-1 text-[11px] font-semibold text-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS} ${toneCls[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/70">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, mono = false }: { value: string; mono?: boolean }) {
  return (
    <div
      className={`w-full truncate rounded-lg border border-border bg-background/60 px-3 py-2 text-xs text-foreground ${mono ? "font-mono tabular" : ""}`}
    >
      {value}
    </div>
  );
}

function Toggle({
  label,
  on = false,
  checked,
  onChange,
  testId,
}: {
  label: string;
  on?: boolean;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  testId?: string;
}) {
  const [local, setLocal] = useState(on);
  const v = checked ?? local;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={v}
      data-testid={testId}
      onClick={() => {
        if (checked === undefined) setLocal(!v);
        onChange?.(!v);
      }}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 text-left ${FOCUS}`}
    >
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${v ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${v ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

/* ---------------- data model ---------------- */

type Surface = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pattern: string;
  kind: "web" | "mobile" | "desktop" | "offline" | "sandbox";
};

const SLUG = "acme-suite";

const SURFACES: Surface[] = [
  { key: "live", label: "Live Demo", icon: Globe2, pattern: "https://{slug}.demo.softwarewala.net", kind: "web" },
  { key: "frontend", label: "Frontend Demo", icon: MonitorPlay, pattern: "https://{slug}.demo.softwarewala.net/", kind: "web" },
  { key: "backend", label: "Backend Demo", icon: Server, pattern: "https://{slug}.demo.softwarewala.net/backend", kind: "web" },
  { key: "admin", label: "Admin Demo", icon: LayoutDashboard, pattern: "https://{slug}.demo.softwarewala.net/admin", kind: "web" },
  { key: "customer", label: "Customer Demo", icon: Users, pattern: "https://{slug}.demo.softwarewala.net/app", kind: "web" },
  { key: "vendor", label: "Vendor Demo", icon: Store, pattern: "https://{slug}.demo.softwarewala.net/vendor", kind: "web" },
  { key: "author", label: "Author Demo", icon: PenTool, pattern: "https://{slug}.demo.softwarewala.net/author", kind: "web" },
  { key: "mobile", label: "Mobile Demo", icon: Smartphone, pattern: "https://{slug}.demo.softwarewala.net/m", kind: "mobile" },
  { key: "apk", label: "APK Demo", icon: Package, pattern: "https://cdn.softwarewala.net/demo/{slug}.apk", kind: "mobile" },
  { key: "desktop", label: "Desktop Demo", icon: Monitor, pattern: "https://cdn.softwarewala.net/demo/{slug}-setup.exe", kind: "desktop" },
  { key: "offline", label: "Offline Demo", icon: WifiOff, pattern: "https://cdn.softwarewala.net/demo/{slug}-offline.zip", kind: "offline" },
  { key: "sandbox", label: "Sandbox Demo", icon: MonitorPlay, pattern: "https://sandbox.softwarewala.net/{slug}", kind: "sandbox" },
];

const ROLES = [
  { role: "Admin", user: "admin@demo.softwarewala.net", scope: "Full admin" },
  { role: "Customer", user: "customer@demo.softwarewala.net", scope: "Storefront" },
  { role: "Vendor", user: "vendor@demo.softwarewala.net", scope: "Vendor console" },
  { role: "Author", user: "author@demo.softwarewala.net", scope: "Author console" },
  { role: "Support", user: "support@demo.softwarewala.net", scope: "Read-only" },
];

const TABS = ["All Demos", "Live", "Sandbox", "Mobile", "Offline", "Credentials", "Reset & Expiry", "Demo SEO", "Health"] as const;

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const resolveUrl = (s: Surface) => s.pattern.replace("{slug}", SLUG);

/** Deterministic short fingerprint used for rotated credential display. */
function fingerprint(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).slice(0, 6);
}

const CANONICAL = `https://softwarewala.net/software/erp/${SLUG}`;

/* ---------------- section ---------------- */

export function DemoSection() {
  const navigate = useNavigate({ from: "/" });
  const search = useSearch({ from: "/", shouldThrow: false }) as { m?: string; s?: string; t?: string } | undefined;

  const urlTab = TABS.find((t) => slugify(t) === search?.t);
  const [localTab, setLocalTab] = useState<string>(TABS[0]);
  const tab = urlTab ?? localTab;

  const setTab = (v: string) => {
    setLocalTab(v);
    navigate({ search: { m: "marketplace", s: "demo", t: slugify(v) }, replace: true, resetScroll: false });
  };

  /* ---- surface runtime state ---- */
  const [surfaceState, setSurfaceState] = useState<Record<string, { enabled: boolean; resets: number; resetAt?: string }>>(
    () => Object.fromEntries(SURFACES.map((s) => [s.key, { enabled: true, resets: 0 }])),
  );
  const [status, setStatus] = useState("");
  const [qr, setQr] = useState<Surface | null>(null);

  const announce = useCallback((msg: string) => setStatus(msg), []);

  const copy = useCallback(async (s: Surface) => {
    const url = resolveUrl(s);
    try {
      await navigator.clipboard?.writeText(url);
    } catch {
      /* clipboard unavailable — still confirm the copy intent */
    }
    announce(`Copied ${s.label} URL — ${url}`);
  }, [announce]);

  const toggleSurface = useCallback((s: Surface) => {
    setSurfaceState((prev) => {
      const next = { ...prev, [s.key]: { ...prev[s.key], enabled: !prev[s.key].enabled } };
      announce(`${s.label} ${next[s.key].enabled ? "enabled" : "disabled"}`);
      return next;
    });
  }, [announce]);

  const resetSurface = useCallback((s: Surface) => {
    setSurfaceState((prev) => {
      const n = prev[s.key].resets + 1;
      announce(`${s.label} reset queued — snapshot restore #${n}`);
      return { ...prev, [s.key]: { ...prev[s.key], resets: n, resetAt: "just now" } };
    });
  }, [announce]);

  /* ---- credentials state ---- */
  const [rotation, setRotation] = useState(0);
  const [oneClickEnabled, setOneClickEnabled] = useState(true);
  const [sessions, setSessions] = useState<string[]>([]);

  const rotateAll = () => {
    setRotation((r) => r + 1);
    setSessions([]);
    announce("All demo credentials rotated — active one-click sessions revoked");
  };

  const login = (role: string) => {
    const token = `svd_${fingerprint(`${role}:${rotation}:${sessions.length}`)}`;
    setSessions((s) => [...s, `${role}:${token}`]);
    announce(`One-click login issued for ${role} — token ${token}, TTL 15 min`);
  };

  /* ---- demo SEO guards ---- */
  const [guards, setGuards] = useState({
    noindex: true,
    canonical: true,
    robots: true,
    xRobots: true,
    sitemap: true,
    aiCrawlers: true,
  });

  const visible = useMemo(() => {
    if (tab === "Live") return SURFACES.filter((s) => s.kind === "web");
    if (tab === "Sandbox") return SURFACES.filter((s) => s.kind === "sandbox");
    if (tab === "Mobile") return SURFACES.filter((s) => s.kind === "mobile" || s.kind === "desktop");
    if (tab === "Offline") return SURFACES.filter((s) => s.kind === "offline");
    return SURFACES;
  }, [tab]);

  /* ---- emit demo-host head tags while the Demo SEO tab is active ---- */
  useEffect(() => {
    if (tab !== "Demo SEO") return;
    const head = document.head;
    const created: Element[] = [];

    const add = (tag: string, attrs: Record<string, string>) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      el.setAttribute("data-demo-seo", "true");
      head.appendChild(el);
      created.push(el);
    };

    if (guards.noindex) add("meta", { name: "robots", content: "noindex, nofollow, noarchive" });
    if (guards.canonical) add("link", { rel: "canonical", href: CANONICAL, "data-demo-canonical": "true" });
    if (guards.robots) add("meta", { name: "demo-robots-txt", content: "User-agent: *\nDisallow: /" });
    if (guards.xRobots) add("meta", { name: "x-robots-tag", content: "noindex, nofollow" });
    if (guards.sitemap) add("meta", { name: "demo-sitemap-exclude", content: "true" });
    if (guards.aiCrawlers) add("meta", { name: "demo-ai-crawlers", content: "blocked" });

    return () => created.forEach((el) => el.remove());
  }, [tab, guards]);

  return (
    <div className="px-4 py-8 md:px-8">
      <PageHeader
        eyebrow="Catalog · Demo System"
        title="Demo URL Command Center"
        description="Every demo surface for every product — URLs, credentials, one-click login, auto-reset, expiry, QR sharing, indexing guards and uptime, controlled from one console."
        actions={
          <>
            <PillButton variant="ghost"><span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Regenerate URLs</span></PillButton>
            <PillButton variant="primary"><span className="inline-flex items-center gap-1.5"><Play className="h-3.5 w-3.5" /> Provision Demo</span></PillButton>
          </>
        }
      />

      <SubNav items={[...TABS]} active={tab} onChange={setTab} label="Demo system tabs" />

      <div
        role="status"
        aria-live="polite"
        data-testid="demo-status"
        className="mb-4 min-h-5 text-[11px] font-semibold text-accent"
      >
        {status}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Active Demos" value="—" icon={<MonitorPlay className="h-3.5 w-3.5" />} />
        <StatCard label="Auto-Reset Today" value="—" tone="success" icon={<RotateCcw className="h-3.5 w-3.5" />} />
        <StatCard label="Expiring < 48h" value="—" tone="warning" icon={<Clock className="h-3.5 w-3.5" />} />
        <StatCard label="Demo Uptime" value="—" tone="premium" icon={<Activity className="h-3.5 w-3.5" />} />
        <StatCard label="One-Click Logins" value="—" icon={<KeyRound className="h-3.5 w-3.5" />} />
      </div>

      {/* URL PATTERNS + SURFACE MATRIX */}
      {(tab !== "Credentials" && tab !== "Reset & Expiry" && tab !== "Demo SEO" && tab !== "Health") && (
        <>
          <Card className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4 text-accent" />
              <div className="text-sm font-bold">URL Generation Rules</div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Subdomain pattern" hint="Isolated per product"><Input value="https://{slug}.demo.softwarewala.net" mono /></Field>
              <Field label="Path pattern" hint="Shared sandbox"><Input value="https://sandbox.softwarewala.net/{slug}" mono /></Field>
              <Field label="Asset CDN" hint="APK / EXE / offline"><Input value="https://cdn.softwarewala.net/demo/" mono /></Field>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <Toggle on label="Auto-generate on publish" />
              <Toggle on label="Validate URL reachability" />
              <Toggle on label="Force HTTPS + HSTS" />
              <Toggle on label="Short link (svala.to/{slug})" />
              <Toggle on label="UTM auto-tagging on share" />
              <Toggle label="Password protect by default" />
            </div>
          </Card>

          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            <MonitorPlay className="h-3.5 w-3.5" /> Demo Surface Matrix
          </div>
          <EmptyHint text="URL structure is live — counters populate once demo telemetry is connected" />

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((s) => {
              const st = surfaceState[s.key];
              const url = resolveUrl(s);
              return (
                <Card key={s.key}>
                  <div data-testid={`demo-surface-${s.key}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent/20 bg-gradient-to-br from-primary/25 to-accent/25 text-accent">
                          <s.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold">{s.label}</div>
                          <div className="mt-0.5 truncate font-mono text-[10px] tabular text-muted-foreground" data-testid={`demo-url-${s.key}`}>{url}</div>
                        </div>
                      </div>
                      <span data-testid={`demo-state-${s.key}`}>
                        <Tone tone={st.enabled ? "success" : "danger"}>{st.enabled ? "Enabled" : "Disabled"}</Tone>
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {[["Visits", "—"], ["Avg session", "—"], ["Errors", "—"]].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-border bg-background/40 px-2 py-1.5">
                          <div className="font-mono text-[13px] font-bold tabular">{v}</div>
                          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-muted-foreground" data-testid={`demo-reset-${s.key}`}>
                      {st.resets > 0 ? `Last reset ${st.resetAt} · ${st.resets} total` : "No reset in this session"}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-disabled={!st.enabled}
                        data-testid={`demo-open-${s.key}`}
                        onClick={(e) => {
                          if (!st.enabled) { e.preventDefault(); announce(`${s.label} is disabled — enable it before opening`); return; }
                          announce(`Opened ${s.label} in a new tab`);
                        }}
                        className={`inline-flex min-h-8 items-center gap-1.5 rounded-md border border-accent/40 bg-background/50 px-2 py-1 text-[11px] font-semibold text-accent transition-all hover:bg-accent/10 ${FOCUS} ${st.enabled ? "" : "pointer-events-auto opacity-40"}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Open</span>
                      </a>
                      <IconBtn icon={Copy} label="Copy" testId={`demo-copy-${s.key}`} onClick={() => copy(s)} />
                      <IconBtn icon={QrCode} label="QR" testId={`demo-qr-${s.key}`} onClick={() => { setQr(s); announce(`QR code generated for ${s.label}`); }} />
                      <IconBtn icon={RotateCcw} label="Reset" testId={`demo-reset-btn-${s.key}`} onClick={() => resetSurface(s)} />
                      <IconBtn
                        icon={st.enabled ? Pause : Play}
                        label={st.enabled ? "Disable" : "Enable"}
                        tone={st.enabled ? "danger" : "success"}
                        testId={`demo-toggle-${s.key}`}
                        onClick={() => toggleSurface(s)}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* QR DIALOG */}
      {qr && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`QR code for ${qr.label}`}
            data-testid="demo-qr-dialog"
            className="w-full max-w-sm rounded-2xl border border-border bg-[color:var(--surface)] p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-bold">{qr.label} · QR</div>
              <IconBtn icon={X} label="Close QR" testId="demo-qr-close" onClick={() => setQr(null)} />
            </div>
            <QrBlock value={resolveUrl(qr)} />
            <div className="mt-3 break-all font-mono text-[10px] text-muted-foreground" data-testid="demo-qr-url">{resolveUrl(qr)}</div>
          </div>
        </div>
      )}

      {/* CREDENTIALS */}
      {tab === "Credentials" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold">Demo Credentials</span>
              </div>
              <IconBtn icon={RefreshCw} label="Rotate all" testId="demo-rotate-all" onClick={rotateAll} />
            </div>
            <div className="divide-y divide-border">
              {ROLES.map((c) => {
                const pass = `••••••••·${fingerprint(`${c.role}:${rotation}`)}`;
                return (
                  <div key={c.role} className="grid grid-cols-12 items-center gap-3 px-4 py-3" data-testid={`demo-cred-${slugify(c.role)}`}>
                    <div className="col-span-3 text-sm font-bold">{c.role}</div>
                    <div className="col-span-4 truncate font-mono text-[11px] tabular text-muted-foreground">{c.user}</div>
                    <div className="col-span-3 font-mono text-[11px] tabular text-muted-foreground" data-testid={`demo-pass-${slugify(c.role)}`}>{pass}</div>
                    <div className="col-span-2 flex justify-end gap-1.5">
                      <IconBtn icon={Copy} label={`Copy ${c.role} credentials`} testId={`demo-cred-copy-${slugify(c.role)}`} onClick={() => { navigator.clipboard?.writeText(c.user).catch(() => {}); announce(`Copied ${c.role} demo username`); }} />
                      <IconBtn
                        icon={Play}
                        label={`One-click login as ${c.role}`}
                        tone="success"
                        disabled={!oneClickEnabled}
                        title={oneClickEnabled ? `One-click login as ${c.role}` : "One-click login tokens are disabled by guardrail"}
                        testId={`demo-login-${slugify(c.role)}`}
                        onClick={() => login(c.role)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
              <span data-testid="demo-rotation-count">Rotations this session: {rotation}</span>
              <span className="mx-2">·</span>
              <span data-testid="demo-session-count">Active one-click sessions: {sessions.length}</span>
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <div className="text-sm font-bold">One-Click Login & Guardrails</div>
            </div>
            <div className="grid gap-2">
              <Toggle
                label="One-click login tokens (signed, 15 min TTL)"
                checked={oneClickEnabled}
                onChange={(v) => { setOneClickEnabled(v); if (!v) { setSessions([]); announce("One-click login disabled — issued tokens revoked"); } else announce("One-click login enabled"); }}
                testId="guard-one-click"
              />
              <Toggle on label="Rotate demo passwords every reset" testId="guard-rotate-on-reset" />
              <Toggle on label="Block outbound email from demo" testId="guard-block-email" />
              <Toggle on label="Block real payments (sandbox gateway only)" testId="guard-block-payments" />
              <Toggle on label="Mask PII in seeded demo data" testId="guard-mask-pii" />
              <Toggle label="Allow visitor-created accounts" testId="guard-visitor-accounts" />
            </div>
            <div className="mt-4 rounded-lg border border-premium/40 bg-premium/10 p-3 text-[11px] text-premium">
              Demo sessions never touch production data, payments or customer records.
            </div>
          </Card>
        </div>
      )}

      {/* RESET & EXPIRY */}
      {tab === "Reset & Expiry" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-accent" />
              <div className="text-sm font-bold">Auto-Reset Schedule</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Reset frequency"><Input value="Every 6 hours" /></Field>
              <Field label="Reset window" hint="Low traffic"><Input value="02:00 – 02:15 IST" mono /></Field>
              <Field label="Seed dataset"><Input value="demo-seed-v4 (verified)" mono /></Field>
              <Field label="Reset strategy"><Input value="Snapshot restore" /></Field>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <Toggle on label="Reset on session end" />
              <Toggle on label="Reset after 50 sessions" />
              <Toggle on label="Notify on failed reset" />
              <Toggle label="Freeze resets during campaigns" />
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <div className="text-sm font-bold">Expiry & Lifecycle</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Default demo lifetime"><Input value="30 days" /></Field>
              <Field label="Grace period"><Input value="72 hours" /></Field>
              <Field label="On expiry"><Input value="Disable + redirect to product page" /></Field>
              <Field label="Renewal"><Input value="Auto-renew while product published" /></Field>
            </div>
            <div className="mt-3 space-y-2">
              {["Expiring in 24h", "Expiring in 7 days", "Expired (archived)"].map((l) => (
                <div key={l} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                  <span className="text-[11px] font-semibold">{l}</span>
                  <span className="font-mono text-sm font-bold tabular text-muted-foreground">—</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* DEMO SEO */}
      {tab === "Demo SEO" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-accent" />
              <div className="text-sm font-bold">Indexing Guard</div>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Demo surfaces must never outrank or duplicate the canonical product page. These rules are applied to every generated demo URL.
            </p>
            <div className="grid gap-2">
              <Toggle label="noindex, nofollow on all demo URLs" checked={guards.noindex} onChange={(v) => setGuards((g) => ({ ...g, noindex: v }))} testId="seo-noindex" />
              <Toggle label="Canonical → product page" checked={guards.canonical} onChange={(v) => setGuards((g) => ({ ...g, canonical: v }))} testId="seo-canonical" />
              <Toggle label="robots.txt Disallow: / on demo hosts" checked={guards.robots} onChange={(v) => setGuards((g) => ({ ...g, robots: v }))} testId="seo-robots" />
              <Toggle label="X-Robots-Tag header enforcement" checked={guards.xRobots} onChange={(v) => setGuards((g) => ({ ...g, xRobots: v }))} testId="seo-x-robots" />
              <Toggle label="Exclude demo hosts from sitemap" checked={guards.sitemap} onChange={(v) => setGuards((g) => ({ ...g, sitemap: v }))} testId="seo-sitemap" />
              <Toggle label="Block AI crawlers on demo hosts" checked={guards.aiCrawlers} onChange={(v) => setGuards((g) => ({ ...g, aiCrawlers: v }))} testId="seo-ai-crawlers" />
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-accent" />
              <div className="text-sm font-bold">Emitted Head — demo host</div>
            </div>
            <pre data-testid="seo-emitted-head" className="scroll-row max-h-72 overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">{[
              guards.noindex ? `<meta name="robots" content="noindex, nofollow, noarchive" />` : null,
              guards.canonical ? `<link rel="canonical" href="${CANONICAL}" />` : null,
              guards.xRobots ? `X-Robots-Tag: noindex, nofollow` : null,
              guards.sitemap ? `<!-- demo hosts excluded from sitemap.xml -->` : null,
              guards.aiCrawlers ? `User-agent: GPTBot\nDisallow: /` : null,
              guards.robots ? `# robots.txt (demo host)\nUser-agent: *\nDisallow: /` : null,
            ].filter(Boolean).join("\n")}</pre>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <IconBtn icon={Sparkles} label="Re-run SEO audit" tone="accent" testId="seo-rerun-audit" onClick={() => announce("SEO audit re-run queued for all demo hosts")} />
              <IconBtn icon={RefreshCw} label="Re-apply to all demos" testId="seo-reapply" onClick={() => announce("Indexing guards re-applied to all demo hosts")} />
            </div>
          </Card>
        </div>
      )}

      {/* HEALTH */}
      {tab === "Health" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-success" />
              <div className="text-sm font-bold">Uptime Monitors</div>
            </div>
            <div className="space-y-2">
              {SURFACES.slice(0, 7).map((s) => (
                <div key={s.key} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <s.icon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-[11px] font-semibold">{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] tabular text-muted-foreground">—</span>
                    <Tone tone="muted">No data</Tone>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <div className="text-sm font-bold">Checks & Alerts</div>
            </div>
            <div className="grid gap-2">
              <Toggle on label="HTTP 200 check every 60s" />
              <Toggle on label="SSL expiry check (30-day alert)" />
              <Toggle on label="Broken demo URL auto-disable" />
              <Toggle on label="Slow response alert (> 2.5s)" />
              <Toggle on label="Notify author + ops on failure" />
              <Toggle label="Auto-rollback to last good snapshot" />
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background/40 p-3 text-[11px] text-muted-foreground">
              Health metrics render <span className="font-mono text-foreground">—</span> until monitoring is connected. No demo numbers, per the integrity policy.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/** Deterministic visual QR stand-in derived from the URL. */
function QrBlock({ value }: { value: string }) {
  const cells = useMemo(() => {
    const out: boolean[] = [];
    let h = 2166136261;
    for (let i = 0; i < 441; i++) {
      h ^= value.charCodeAt(i % value.length) + i;
      h = Math.imul(h, 16777619);
      out.push(((h >>> 7) & 1) === 1);
    }
    return out;
  }, [value]);
  return (
    <div className="mx-auto grid w-48 grid-cols-21 gap-0 rounded-lg bg-white p-2" style={{ gridTemplateColumns: "repeat(21, minmax(0,1fr))" }} aria-hidden="true">
      {cells.map((on, i) => (
        <span key={i} className={on ? "aspect-square bg-black" : "aspect-square bg-white"} />
      ))}
    </div>
  );
}
