import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Mail, User, Phone, KeyRound, QrCode, ShieldCheck, Fingerprint, Eye, EyeOff,
  Lock, Globe, Mic, MicOff, MessageSquare, Sparkles, ChevronRight, Building2,
  Code2, Bot, BarChart3, Search, Briefcase, LifeBuoy, Radio, Wifi, Server,
  CheckCircle2, AlertTriangle, Languages, ArrowRight, Crown,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Software Vala — Nexus OS Login" },
      { name: "description", content: "Secure access to the Software Vala Nexus OS — the operating system of a global software ecosystem." },
      { property: "og:title", content: "Software Vala — Nexus OS Login" },
      { property: "og:description", content: "Enter the Software Vala Universe." },
    ],
  }),
  component: NexusLogin,
});

/* ============================ Data ============================ */

const OPPORTUNITIES = [
  { role: "Senior Developer", team: "Platform Core", level: "L5", icon: Code2, grad: "var(--grad-violet)" },
  { role: "AI Engineer", team: "Nexus Intelligence", level: "L5", icon: Bot, grad: "var(--grad-cyan)" },
  { role: "Data Scientist", team: "Insights Lab", level: "L4", icon: BarChart3, grad: "var(--grad-teal)" },
  { role: "SEO Expert", team: "Growth", level: "L4", icon: Search, grad: "var(--grad-amber)" },
  { role: "Sales Executive", team: "Enterprise GTM", level: "L3", icon: Briefcase, grad: "var(--grad-emerald)" },
  { role: "Support Executive", team: "Global Care", level: "L2", icon: LifeBuoy, grad: "var(--grad-rose)" },
] as const;

const PROGRAMS = [
  { tag: "Featured", title: "Founder Fellowship 2026", desc: "120 seats · Global cohort" },
  { tag: "Live Hiring", title: "Nexus AI Residency", desc: "Apply by Jun 28" },
  { tag: "Announcement", title: "v4.2 ships worldwide tonight", desc: "Multi-region rollout" },
] as const;

const METHODS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "username", label: "Username", icon: User },
  { id: "mobile", label: "Mobile", icon: Phone },
  { id: "license", label: "License Key", icon: KeyRound },
  { id: "otp", label: "OTP", icon: Radio },
  { id: "qr", label: "QR", icon: QrCode },
  { id: "sso", label: "SSO", icon: Building2 },
] as const;

type MethodId = (typeof METHODS)[number]["id"];

type AIState =
  | "idle" | "greeting" | "typingUser" | "typingPass" | "wrongPass" | "success"
  | "otp" | "qr" | "license" | "locked" | "reset" | "maintenance" | "serverError"
  | "vip" | "first" | "securityAlert" | "multiDevice";

const AI_LINES: Record<AIState, { mood: string; line: string; tone: string }> = {
  idle:          { mood: "Standing by", line: "I'm here whenever you're ready, boss.", tone: "calm" },
  greeting:      { mood: "Welcoming",   line: "Welcome back. Nexus OS is warm and waiting.", tone: "warm" },
  typingUser:    { mood: "Attentive",   line: "Identifying your profile across 1M+ accounts…", tone: "focused" },
  typingPass:    { mood: "Discreet",    line: "Your keystrokes are encrypted end-to-end.", tone: "secure" },
  wrongPass:     { mood: "Concerned",   line: "That credential didn't match. Two attempts remain.", tone: "alert" },
  success:       { mood: "Delighted",   line: "Authenticated. Opening your command surface.", tone: "celebration" },
  otp:           { mood: "Verifying",   line: "I've dispatched a one-time code to your trusted device.", tone: "secure" },
  qr:            { mood: "Scanning",    line: "Hold your Nexus companion app over the code.", tone: "focused" },
  license:       { mood: "Validating",  line: "Cross-checking your enterprise license with HQ.", tone: "secure" },
  locked:        { mood: "Protective",  line: "Account is temporarily sealed. I'll guide recovery.", tone: "alert" },
  reset:         { mood: "Reassuring",  line: "Let's get you a fresh credential, securely.", tone: "warm" },
  maintenance:   { mood: "Informing",   line: "We're upgrading EU region. Read-only for ~6 minutes.", tone: "neutral" },
  serverError:   { mood: "Apologetic",  line: "A node hiccupped. Failover engaged — try again.", tone: "alert" },
  vip:           { mood: "Honored",     line: "Boss-tier access detected. White-glove session opened.", tone: "celebration" },
  first:         { mood: "Curious",     line: "First time here? I'll personally walk you through.", tone: "warm" },
  securityAlert: { mood: "Vigilant",    line: "New geo signature flagged. Confirm it's you.", tone: "alert" },
  multiDevice:   { mood: "Noting",      line: "3 active sessions detected. Want to review them?", tone: "neutral" },
};

const ECOSYSTEM_NODES = [
  { id: "marketplace", label: "Marketplace", x: 18, y: 22 },
  { id: "reseller",    label: "Reseller",    x: 32, y: 70 },
  { id: "franchise",   label: "Franchise",   x: 12, y: 82 },
  { id: "support",     label: "Support",     x: 78, y: 28 },
  { id: "ai",          label: "AI",          x: 88, y: 58 },
  { id: "security",    label: "Security",    x: 70, y: 88 },
  { id: "licensing",   label: "Licensing",   x: 50, y: 12 },
  { id: "servers",     label: "Servers",     x: 6,  y: 48 },
  { id: "apps",        label: "Apps",        x: 60, y: 50 },
  { id: "products",    label: "Products",    x: 40, y: 38 },
  { id: "users",       label: "Users",       x: 50, y: 90 },
];

/* ============================ Page ============================ */

function NexusLogin() {
  const [method, setMethod] = useState<MethodId>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [stage, setStage] = useState<AIState>("greeting");
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [voice, setVoice] = useState(false);
  const [lang, setLang] = useState("EN");
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const t = setTimeout(() => setStage("idle"), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const onIdentifierFocus = () => setStage("typingUser");
  const onPasswordFocus = () => setStage("typingPass");
  const onBlur = () => setStage((s) => (s === "typingUser" || s === "typingPass" ? "idle" : s));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Pick a flavor based on method
    if (method === "otp") setStage("otp");
    else if (method === "qr") setStage("qr");
    else if (method === "license") setStage("license");
    else setStage("idle");

    // Simulate auth
    setTimeout(() => {
      const wrong = password && password.toLowerCase() === "wrong";
      if (wrong) {
        setAttempts((a) => a + 1);
        setStage("wrongPass");
        setSubmitting(false);
        return;
      }
      setStage("success");
      setTimeout(() => setSubmitting(false), 1400);
    }, 1100);
  };

  const ai = AI_LINES[stage];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[oklch(0.12_0.02_265)] text-[oklch(0.96_0.01_260)]">
      <NexusBackground />

      {/* Top strip — security telemetry */}
      <div className="relative z-20 mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 pt-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/60">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400/70" />
            Nexus OS · Operational
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <Server className="size-3" /> 42 regions
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <ShieldCheck className="size-3" /> 2FA active
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10">
            <Wifi className="size-3" /> Trusted device
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/70">
          <button
            onClick={() => setLang((l) => (l === "EN" ? "हिं" : l === "हिं" ? "العربية" : "EN"))}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 ring-1 ring-white/10 hover:bg-white/10"
          >
            <Languages className="size-3" /> {lang}
          </button>
          <span className="hidden sm:inline tabular-nums text-white/50">
            {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)_360px] xl:gap-8">
        <LeftPanel />
        <CenterPanel
          method={method} setMethod={setMethod}
          identifier={identifier} setIdentifier={setIdentifier}
          password={password} setPassword={setPassword}
          showPw={showPw} setShowPw={setShowPw}
          remember={remember} setRemember={setRemember}
          submitting={submitting} attempts={attempts}
          onIdentifierFocus={onIdentifierFocus}
          onPasswordFocus={onPasswordFocus}
          onBlur={onBlur}
          onSubmit={submit}
          stage={stage}
        />
        <RightPanel ai={ai} stage={stage} voice={voice} setVoice={setVoice} setStage={setStage} />
      </div>

      <footer className="relative z-10 mx-auto max-w-[1600px] px-6 pb-6 pt-2 text-center text-[11px] text-white/40">
        Software Vala Nexus OS · A global enterprise operating system · 12,000+ products · 1,000,000+ operators
      </footer>
    </div>
  );
}

/* ============================ Background ============================ */

function NexusBackground() {
  const links = useMemo(() => {
    const out: { a: number; b: number }[] = [];
    for (let i = 0; i < ECOSYSTEM_NODES.length; i++) {
      for (let j = i + 1; j < ECOSYSTEM_NODES.length; j++) {
        const dx = ECOSYSTEM_NODES[i].x - ECOSYSTEM_NODES[j].x;
        const dy = ECOSYSTEM_NODES[i].y - ECOSYSTEM_NODES[j].y;
        if (Math.hypot(dx, dy) < 38) out.push({ a: i, b: j });
      }
    }
    return out;
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradients */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(80% 60% at 20% 10%, oklch(0.32 0.18 280 / 0.55), transparent 60%)," +
          "radial-gradient(70% 60% at 90% 20%, oklch(0.32 0.16 220 / 0.5), transparent 60%)," +
          "radial-gradient(70% 80% at 70% 100%, oklch(0.28 0.18 320 / 0.45), transparent 60%)," +
          "linear-gradient(180deg, oklch(0.12 0.02 265), oklch(0.10 0.02 265))",
      }} />
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage:
          "linear-gradient(oklch(1 0 0 / 0.6) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.6) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(80% 60% at 50% 40%, #000, transparent 75%)",
      }} />
      {/* ecosystem nodes */}
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="nx-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.18 260)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.82 0.18 320)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {links.map((l, i) => {
          const a = ECOSYSTEM_NODES[l.a], b = ECOSYSTEM_NODES[l.b];
          return (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="url(#nx-line)" strokeWidth="0.08" vectorEffect="non-scaling-stroke" />
          );
        })}
        {ECOSYSTEM_NODES.map((n, i) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="0.9" fill="oklch(0.85 0.18 270)" opacity="0.85">
              <animate attributeName="r" values="0.7;1.2;0.7" dur={`${4 + (i % 5)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;1;0.4" dur={`${4 + (i % 5)}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={n.x} cy={n.y} r="2.4" fill="oklch(0.85 0.18 270)" opacity="0.10" />
          </g>
        ))}
      </svg>
      {/* drifting orbs */}
      <div className="absolute -left-24 top-1/3 size-[420px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.7 0.2 280 / 0.35), transparent 70%)" }} />
      <div className="absolute -right-24 bottom-0 size-[460px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, oklch(0.7 0.2 200 / 0.30), transparent 70%)" }} />
      {/* vignette */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(120% 80% at 50% 50%, transparent 50%, oklch(0 0 0 / 0.55) 100%)",
      }} />
    </div>
  );
}

/* ============================ Left Panel ============================ */

function LeftPanel() {
  return (
    <aside className="hidden lg:flex flex-col gap-4">
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Ecosystem · Opportunities</p>
          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            Live hiring
          </span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {OPPORTUNITIES.map((o) => (
            <li key={o.role} className="group flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-white/[0.04] transition-colors">
              <span className="grid size-9 place-items-center rounded-lg ring-1 ring-white/10" style={{ background: o.grad }}>
                <o.icon className="size-4 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white/90">{o.role}</p>
                <p className="truncate text-[11px] text-white/50">{o.team} · {o.level}</p>
              </div>
              <ChevronRight className="size-4 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Featured programs</p>
        <ul className="mt-3 space-y-2.5">
          {PROGRAMS.map((p) => (
            <li key={p.title} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] font-medium text-violet-300 ring-1 ring-violet-400/30">
                  {p.tag}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] font-medium text-white/90">{p.title}</p>
              <p className="text-[11px] text-white/55">{p.desc}</p>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Global pulse</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { v: "42", k: "Regions" },
            { v: "1M+", k: "Operators" },
            { v: "12K+", k: "Products" },
          ].map((m) => (
            <div key={m.k} className="rounded-lg bg-white/[0.03] py-2 ring-1 ring-white/10">
              <p className="text-base font-semibold tracking-tight text-white">{m.v}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/50">{m.k}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </aside>
  );
}

/* ============================ Center Panel ============================ */

function CenterPanel(props: {
  method: MethodId; setMethod: (m: MethodId) => void;
  identifier: string; setIdentifier: (s: string) => void;
  password: string; setPassword: (s: string) => void;
  showPw: boolean; setShowPw: (b: boolean) => void;
  remember: boolean; setRemember: (b: boolean) => void;
  submitting: boolean; attempts: number;
  onIdentifierFocus: () => void; onPasswordFocus: () => void; onBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  stage: AIState;
}) {
  const {
    method, setMethod, identifier, setIdentifier, password, setPassword,
    showPw, setShowPw, remember, setRemember, submitting, attempts,
    onIdentifierFocus, onPasswordFocus, onBlur, onSubmit, stage,
  } = props;

  const methodMeta = METHODS.find((m) => m.id === method)!;

  return (
    <section className="flex min-w-0 flex-col items-center justify-start">
      <GlassCard className="w-full max-w-[520px] overflow-hidden p-0">
        {/* Brand header */}
        <div className="relative px-7 pt-7">
          <div className="flex items-center justify-between">
            <BrandLogo variant="long" size={48} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/60 ring-1 ring-white/10">
              <Crown className="size-3 text-amber-300" /> Nexus OS
            </span>
          </div>
          <div className="mt-5">
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-white">
              Welcome back, Boss
            </h1>
            <p className="mt-1 text-[13px] text-white/55">
              Sign in to enter the Software Vala universe.
            </p>
          </div>
        </div>

        {/* Method chips */}
        <div className="mt-5 px-7">
          <div className="flex flex-wrap gap-1.5">
            {METHODS.map((m) => {
              const active = m.id === method;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all",
                    active
                      ? "bg-white text-[oklch(0.18_0.02_265)] shadow-[0_10px_30px_-12px_oklch(0.85_0.18_270/0.7)]"
                      : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  <m.icon className="size-3.5" /> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-5 space-y-3 px-7 pb-2">
          {method === "qr" ? (
            <QRPanel />
          ) : method === "sso" ? (
            <SSOPanel />
          ) : (
            <>
              <Field
                icon={methodMeta.icon}
                label={methodLabel(method)}
                placeholder={methodPlaceholder(method)}
                value={identifier}
                onChange={setIdentifier}
                onFocus={onIdentifierFocus}
                onBlur={onBlur}
                type={method === "mobile" ? "tel" : "text"}
                autoComplete={method === "email" ? "email" : "username"}
              />
              {method !== "otp" && method !== "license" && (
                <Field
                  icon={Lock}
                  label="Password"
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={setPassword}
                  onFocus={onPasswordFocus}
                  onBlur={onBlur}
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  trailing={
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="grid size-7 place-items-center rounded-md text-white/50 hover:text-white">
                      {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  }
                />
              )}
              {(method === "otp" || method === "license") && (
                <Field
                  icon={method === "otp" ? Radio : KeyRound}
                  label={method === "otp" ? "One-time code" : "License key"}
                  placeholder={method === "otp" ? "6-digit secure code" : "NEXUS-XXXX-XXXX-XXXX"}
                  value={password}
                  onChange={setPassword}
                  onFocus={onPasswordFocus}
                  onBlur={onBlur}
                  type="text"
                  monospace
                />
              )}

              {attempts > 0 && stage === "wrongPass" && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-[12px] text-rose-200 ring-1 ring-rose-400/30">
                  <AlertTriangle className="size-3.5" />
                  Credential mismatch. {Math.max(0, 3 - attempts)} attempt(s) remaining.
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[12px] text-white/65">
                  <span className={[
                    "relative inline-flex h-[18px] w-[32px] items-center rounded-full transition-colors",
                    remember ? "bg-violet-500/80" : "bg-white/10",
                  ].join(" ")} onClick={() => setRemember(!remember)}>
                    <span className={[
                      "absolute top-[2px] size-[14px] rounded-full bg-white transition-all",
                      remember ? "left-[16px]" : "left-[2px]",
                    ].join(" ")} />
                  </span>
                  Remember this device
                </label>
                <Link to="/login" className="text-[12px] font-medium text-violet-300 hover:text-violet-200">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative mt-2 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-[14px] font-semibold text-white shadow-[0_18px_40px_-14px_oklch(0.55_0.22_280/0.7)] transition-all hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 285), oklch(0.58 0.2 240))" }}
              >
                <span className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 285), oklch(0.68 0.2 240))" }} />
                <span className="relative z-10 inline-flex items-center gap-2">
                  {submitting ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Verifying securely…
                    </>
                  ) : stage === "success" ? (
                    <>
                      <CheckCircle2 className="size-4" /> Authenticated · Opening Nexus OS
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Secure sign-in
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </button>
            </>
          )}
        </form>

        {/* Divider */}
        <div className="px-7 pt-4">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            or continue with
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        {/* Enterprise providers */}
        <div className="grid grid-cols-2 gap-2 px-7 pt-3 sm:grid-cols-4">
          {[
            { label: "Google", letter: "G" },
            { label: "Microsoft", letter: "M" },
            { label: "GitHub", letter: "" },
            { label: "Enterprise", letter: "E" },
          ].map((p) => (
            <button key={p.label} type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5 text-[12px] font-medium text-white/80 ring-1 ring-white/10 transition-all hover:bg-white/[0.08]">
              <span className="grid size-5 place-items-center rounded-md bg-white/10 text-[11px] font-bold">{p.letter || "⌥"}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Security strip */}
        <div className="mt-6 grid grid-cols-3 gap-px bg-white/10 px-px pb-px">
          {[
            { icon: ShieldCheck, k: "Security", v: "Healthy" },
            { icon: Fingerprint, k: "Last sign-in", v: "Just now · this device" },
            { icon: Globe, k: "Region", v: "Auto-routed · EU-W" },
          ].map((s) => (
            <div key={s.k} className="bg-[oklch(0.14_0.02_265)] px-4 py-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
                <s.icon className="size-3" /> {s.k}
              </div>
              <p className="mt-0.5 truncate text-[12px] font-medium text-white/85">{s.v}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}

function methodLabel(m: MethodId) {
  return ({
    email: "Work email", username: "Username", mobile: "Mobile number",
    license: "License key", otp: "Identifier",
    qr: "QR", sso: "SSO",
  } as Record<MethodId, string>)[m];
}
function methodPlaceholder(m: MethodId) {
  return ({
    email: "founder@softwarevala.com",
    username: "founder-handle",
    mobile: "+91 98xxx xxxxx",
    license: "NEXUS-XXXX-XXXX-XXXX",
    otp: "Email or mobile to receive code",
    qr: "", sso: "",
  } as Record<MethodId, string>)[m];
}

function Field(props: {
  icon: typeof Mail; label: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  onFocus?: () => void; onBlur?: () => void;
  type?: string; autoComplete?: string; monospace?: boolean;
  trailing?: React.ReactNode;
}) {
  const { icon: Icon, label, placeholder, value, onChange, onFocus, onBlur, type = "text", autoComplete, monospace, trailing } = props;
  const [focused, setFocused] = useState(false);
  return (
    <label className={[
      "group block rounded-xl bg-white/[0.04] px-3.5 py-2.5 ring-1 transition-all",
      focused ? "ring-violet-400/60 bg-white/[0.06] shadow-[0_0_0_4px_oklch(0.7_0.2_280/0.12)]" : "ring-white/10",
    ].join(" ")}>
      <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="mt-0.5 flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-white/55" />
        <input
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setFocused(true); onFocus?.(); }}
          onBlur={() => { setFocused(false); onBlur?.(); }}
          placeholder={placeholder}
          className={[
            "min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/30 outline-none",
            monospace ? "font-mono tracking-widest" : "",
          ].join(" ")}
        />
        {trailing}
      </div>
    </label>
  );
}

function QRPanel() {
  return (
    <div className="rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
      <div className="flex items-center gap-4">
        <div className="relative grid size-32 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-3">
          <FakeQR />
          <span className="pointer-events-none absolute inset-x-0 h-[2px] animate-[nx-scan_2.2s_linear_infinite] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-white/90">Scan with Nexus Companion</p>
          <p className="mt-1 text-[12px] text-white/55">Open the app · Tap "Scan to Sign in" · Hold steady for 1 second.</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Waiting for device
          </div>
        </div>
      </div>
      <style>{`@keyframes nx-scan { 0% { top: 8% } 50% { top: 92% } 100% { top: 8% } }`}</style>
    </div>
  );
}

function FakeQR() {
  // deterministic pattern
  const cells = useMemo(() => {
    const arr: boolean[] = [];
    let s = 7;
    for (let i = 0; i < 21 * 21; i++) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      arr.push((s >> 16) % 2 === 0);
    }
    return arr;
  }, []);
  return (
    <div className="grid size-full" style={{ gridTemplateColumns: "repeat(21, 1fr)" }}>
      {cells.map((on, i) => (
        <span key={i} style={{ background: on ? "oklch(0.18 0.02 265)" : "transparent" }} />
      ))}
    </div>
  );
}

function SSOPanel() {
  return (
    <div className="space-y-2">
      <Field icon={Building2} label="Organization domain" placeholder="acme.softwarevala.com" value="" onChange={() => {}} />
      <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-4 py-3 text-[13px] font-medium text-white ring-1 ring-white/10 hover:bg-white/[0.1]">
        <Building2 className="size-4" /> Continue with Enterprise SSO
      </button>
    </div>
  );
}

/* ============================ Right Panel (AI) ============================ */

function RightPanel({ ai, stage, voice, setVoice, setStage }: {
  ai: { mood: string; line: string; tone: string };
  stage: AIState;
  voice: boolean;
  setVoice: (b: boolean) => void;
  setStage: (s: AIState) => void;
}) {
  return (
    <aside className="flex flex-col gap-4">
      <GlassCard className="overflow-hidden p-0">
        <div className="relative h-56 overflow-hidden">
          <AIAvatar stage={stage} />
        </div>
        <div className="space-y-3 px-5 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">AI Concierge</p>
              <p className="mt-0.5 text-[15px] font-semibold text-white">Vala · {ai.mood}</p>
            </div>
            <button
              onClick={() => setVoice(!voice)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ring-1 transition-colors",
                voice ? "bg-violet-500/20 text-violet-200 ring-violet-400/30" : "bg-white/5 text-white/65 ring-white/10",
              ].join(" ")}
            >
              {voice ? <Mic className="size-3" /> : <MicOff className="size-3" />}
              {voice ? "Listening" : "Voice off"}
            </button>
          </div>

          <div className="relative rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/10">
            <div className="absolute -top-1.5 left-5 size-3 rotate-45 bg-white/[0.05] ring-1 ring-white/10" />
            <p className="text-[13px] leading-relaxed text-white/85">{ai.line}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { id: "first", label: "First time?" },
              { id: "reset", label: "Reset password" },
              { id: "securityAlert", label: "Security help" },
              { id: "multiDevice", label: "Active sessions" },
            ].map((q) => (
              <button key={q.id} onClick={() => setStage(q.id as AIState)}
                className="inline-flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-[12px] text-white/75 ring-1 ring-white/10 hover:bg-white/[0.08]">
                {q.label}
                <Sparkles className="size-3 text-violet-300" />
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Security zone</p>
        <ul className="mt-3 space-y-2 text-[12px]">
          {[
            { k: "System", v: "Operational", ok: true },
            { k: "AI Concierge", v: "Online", ok: true },
            { k: "Server health", v: "99.998%", ok: true },
            { k: "License", v: "Founder · Lifetime", ok: true },
            { k: "Last login", v: "2 hours ago · Mumbai", ok: true },
            { k: "Active sessions", v: "3 devices", ok: false },
          ].map((s) => (
            <li key={s.k} className="flex items-center justify-between">
              <span className="text-white/55">{s.k}</span>
              <span className={["inline-flex items-center gap-1.5", s.ok ? "text-emerald-300" : "text-amber-300"].join(" ")}>
                <span className={["size-1.5 rounded-full", s.ok ? "bg-emerald-400" : "bg-amber-400"].join(" ")} />
                {s.v}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard className="flex items-center gap-3 p-3">
        <span className="grid size-9 place-items-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
          <MessageSquare className="size-4 text-white/75" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-white/90">Need a human?</p>
          <p className="truncate text-[11px] text-white/55">24/7 enterprise concierge · &lt;30s response</p>
        </div>
        <button className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-white/80 ring-1 ring-white/10 hover:bg-white/[0.1]">Open</button>
      </GlassCard>
    </aside>
  );
}

function AIAvatar({ stage }: { stage: AIState }) {
  const accentMap: Partial<Record<AIState, string>> = {
    greeting: "oklch(0.78 0.18 280)",
    success: "oklch(0.78 0.17 150)",
    wrongPass: "oklch(0.72 0.2 25)",
    locked: "oklch(0.72 0.2 25)",
    securityAlert: "oklch(0.78 0.16 60)",
    serverError: "oklch(0.72 0.2 25)",
    vip: "oklch(0.85 0.17 80)",
  };
  const accent = accentMap[stage] ?? "oklch(0.78 0.18 260)";

  // expression: brow tilt + smile curve
  const exp = {
    idle:         { brow: 0,  smile: 6,  blink: true  },
    greeting:     { brow: -2, smile: 10, blink: true  },
    typingUser:   { brow: -3, smile: 4,  blink: false },
    typingPass:   { brow: -4, smile: 2,  blink: false },
    wrongPass:    { brow: 6,  smile: -6, blink: true  },
    success:      { brow: -6, smile: 14, blink: true  },
    otp:          { brow: -2, smile: 4,  blink: true  },
    qr:           { brow: -2, smile: 4,  blink: true  },
    license:      { brow: -2, smile: 3,  blink: true  },
    locked:       { brow: 5,  smile: -4, blink: false },
    reset:        { brow: -2, smile: 6,  blink: true  },
    maintenance:  { brow: 0,  smile: 2,  blink: true  },
    serverError:  { brow: 7,  smile: -8, blink: true  },
    vip:          { brow: -5, smile: 12, blink: true  },
    first:        { brow: -3, smile: 9,  blink: true  },
    securityAlert:{ brow: 4,  smile: 0,  blink: true  },
    multiDevice:  { brow: 0,  smile: 4,  blink: true  },
  }[stage];

  return (
    <div className="relative size-full">
      {/* halo */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(60% 80% at 50% 60%, ${accent.replace(")", " / 0.45)")} , transparent 70%)`,
      }} />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      {/* avatar */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto h-full w-full">
        <defs>
          <radialGradient id="ai-face" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="oklch(0.96 0.02 70)" />
            <stop offset="60%" stopColor="oklch(0.82 0.06 50)" />
            <stop offset="100%" stopColor="oklch(0.55 0.06 50)" />
          </radialGradient>
          <linearGradient id="ai-suit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.28 0.04 265)" />
            <stop offset="100%" stopColor="oklch(0.16 0.03 265)" />
          </linearGradient>
          <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* glow ring */}
        <circle cx="100" cy="92" r="80" fill="url(#ai-glow)">
          <animate attributeName="r" values="78;84;78" dur="3.6s" repeatCount="indefinite" />
        </circle>
        {/* shoulders / suit */}
        <path d="M30 200 C 40 150, 70 140, 100 140 C 130 140, 160 150, 170 200 Z" fill="url(#ai-suit)" />
        <path d="M95 142 L100 168 L105 142 Z" fill="oklch(0.95 0.01 260)" opacity="0.85" />
        <circle cx="100" cy="155" r="2" fill={accent} />
        {/* neck */}
        <rect x="92" y="120" width="16" height="22" rx="6" fill="oklch(0.78 0.06 50)" />
        {/* head */}
        <ellipse cx="100" cy="90" rx="42" ry="50" fill="url(#ai-face)" />
        {/* hair */}
        <path d="M58 78 C 60 50, 90 38, 100 38 C 116 38, 140 52, 142 80 C 138 70, 122 62, 100 62 C 80 62, 64 70, 58 78 Z"
          fill="oklch(0.18 0.02 50)" />
        {/* ears */}
        <ellipse cx="58" cy="94" rx="4" ry="7" fill="oklch(0.72 0.06 50)" />
        <ellipse cx="142" cy="94" rx="4" ry="7" fill="oklch(0.72 0.06 50)" />
        {/* brows */}
        <g transform={`translate(0 ${exp.brow})`}>
          <rect x="74" y="84" width="16" height="2.6" rx="1.3" fill="oklch(0.2 0.02 50)" transform="rotate(-6 82 85)" />
          <rect x="110" y="84" width="16" height="2.6" rx="1.3" fill="oklch(0.2 0.02 50)" transform="rotate(6 118 85)" />
        </g>
        {/* eyes */}
        <g>
          <ellipse cx="82" cy="96" rx="4" ry={exp.blink ? 3 : 3.4} fill="oklch(0.2 0.05 260)">
            {exp.blink && <animate attributeName="ry" values="3;0.4;3" keyTimes="0;0.5;1" dur="4.6s" repeatCount="indefinite" />}
          </ellipse>
          <ellipse cx="118" cy="96" rx="4" ry={exp.blink ? 3 : 3.4} fill="oklch(0.2 0.05 260)">
            {exp.blink && <animate attributeName="ry" values="3;0.4;3" keyTimes="0;0.5;1" dur="4.6s" repeatCount="indefinite" />}
          </ellipse>
          <circle cx="83.2" cy="94.6" r="0.9" fill="white" />
          <circle cx="119.2" cy="94.6" r="0.9" fill="white" />
        </g>
        {/* nose */}
        <path d="M100 100 Q 102 110 100 114 Q 98 116 96 114" fill="none" stroke="oklch(0.55 0.06 50)" strokeWidth="1.2" strokeLinecap="round" />
        {/* mouth */}
        <path d={`M86 124 Q 100 ${124 + exp.smile} 114 124`} fill="none" stroke="oklch(0.35 0.06 30)" strokeWidth="2" strokeLinecap="round" />
        {/* earpiece */}
        <circle cx="146" cy="92" r="3" fill={accent}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <path d="M146 92 Q 154 100 150 116" fill="none" stroke={accent} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      </svg>

      {/* voice waveform indicator */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-end gap-[3px]">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="w-[2px] rounded-full"
            style={{
              background: accent,
              height: 4,
              animation: `nx-bar 1.${(i % 9) + 1}s ease-in-out ${i * 60}ms infinite`,
            }} />
        ))}
      </div>
      <style>{`
        @keyframes nx-bar { 0%,100% { height: 3px; opacity:.5 } 50% { height: 16px; opacity:1 } }
      `}</style>
    </div>
  );
}

/* ============================ Primitives ============================ */

function GlassCard({ className = "", children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={[
        "relative rounded-2xl bg-white/[0.04] ring-1 ring-white/10",
        "shadow-[0_30px_80px_-30px_oklch(0_0_0/0.7)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
      style={{
        backgroundImage:
          "linear-gradient(180deg, oklch(1 0 0 / 0.04), oklch(1 0 0 / 0.01))",
      }}
    >
      {/* top sheen */}
      <span aria-hidden className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </div>
  );
}
