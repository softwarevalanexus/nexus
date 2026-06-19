import {
  IdCard, Trophy, Award, Medal, Crown, Star, Shield, Sparkles, Gift, FileBadge,
  Target, BarChart3, Layers, History, CheckCircle2, Lock, QrCode, MapPin,
  Mail, Calendar, Globe, Github, Linkedin, Bell, Eye, Key, ShieldCheck,
  TrendingUp, Zap, Users, Flame, Activity, Download, Share2, Copy, ExternalLink,
  CircleUserRound, Verified, Diamond, ArrowUpRight,
} from "lucide-react";
import {
  ME, PILLARS, RANKS, ACHIEVEMENTS, BADGES, TROPHIES, CERTIFICATES, MISSIONS,
  LEADERBOARD, HALL_OF_FAME, REWARDS, COLLECTIONS, JOURNEY, HEATMAP, XP_TREND,
  ENGAGEMENT, CONNECTED, NOTIFICATIONS_PREFS,
} from "@/lib/ams-data";
import passport3d from "@/assets/passport-3d.png";
import { Insignia, inferRole } from "./Insignia";
import { ChatScreen } from "./ChatScreen";


// ───── shared primitives ─────
export function ScreenHeader({ eyebrow, title, sub, icon: Icon }: {
  eyebrow: string; title: string; sub?: string; icon: typeof Trophy;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold pb-6">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_8px_24px_-8px_#d4a14a]">
          <Icon className="h-5 w-5" strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">{eyebrow}</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-gold-gradient md:text-4xl">{title}</h1>
          {sub && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`gold-frame rounded-2xl p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ eyebrow, title, action }: {
  eyebrow: string; title: string; action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">{eyebrow}</div>
        <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gold bg-[oklch(0.16_0.03_250/0.7)] p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{k}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-gold-gradient">{v}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function tierColor(t: string) {
  return ({
    Bronze: "#c89668", Silver: "#c0c0c0", Gold: "#f5d77a",
    Platinum: "#e5e4e2", Diamond: "#9be5ff", Champion: "#ff9b6a",
    Legend: "#d97aff", Elite: "#f5d77a", Mythic: "#d97aff",
    Legendary: "#ff9b6a", Epic: "#c084fc", Rare: "#60a5fa", Common: "#94a3b8",
  } as Record<string, string>)[t] || "#f5d77a";
}

// ───── IDENTITY ─────
export function PassportScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · Apple Wallet style" title="Digital Passport" sub="Your portable, verifiable AMS identity across the Software Vala ecosystem." icon={IdCard} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="spotlight relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[oklch(0.78_0.14_82/0.18)] blur-3xl" />
          <div className="relative grid place-items-center award-stage min-h-[360px]">
            <img src={passport3d} alt="AMS Digital Passport" className="award-3d max-h-80 w-auto" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <button className="rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] py-2 text-xs text-[#f5d77a] hover:bg-[oklch(0.78_0.14_82/0.1)]"><Download className="mx-auto h-3.5 w-3.5" /><div className="mt-1">Download</div></button>
            <button className="rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] py-2 text-xs text-[#f5d77a] hover:bg-[oklch(0.78_0.14_82/0.1)]"><Share2 className="mx-auto h-3.5 w-3.5" /><div className="mt-1">Share</div></button>
            <button className="rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] py-2 text-xs text-[#f5d77a] hover:bg-[oklch(0.78_0.14_82/0.1)]"><Copy className="mx-auto h-3.5 w-3.5" /><div className="mt-1">Copy ID</div></button>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Passport · Holder" title="Identity Details" />
          <dl className="divide-y divide-[oklch(0.78_0.14_82/0.15)] text-sm">
            {[
              ["Passport ID", ME.passportId],
              ["Full name", ME.name],
              ["Handle", ME.handle],
              ["Title", ME.title],
              ["Location", ME.location],
              ["Issued", ME.joined],
              ["Tier", `${ME.tier} · Rank #${ME.rank}`],
              ["Trust score", `${ME.trustScore} / 100`],
              ["Verified", ME.verified ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}

export function MembershipScreen() {
  const benefits = [
    "Hall Of Fame eligibility", "Founder Circle preview", "Reward multiplier ×1.5",
    "Lifetime certificate vault", "Priority verification", "Annual physical trophy",
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · Tiered" title="Membership Center" sub="Your tier, benefits, and the path forward." icon={Diamond} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="spotlight relative overflow-hidden lg:col-span-2">
          <SectionTitle eyebrow="Current" title={`${ME.tier} Tier · Rank #${ME.rank}`} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat k="Level" v={String(ME.level)} sub={`${ME.xp.toLocaleString()} XP`} />
            <Stat k="Trust" v={`${ME.trustScore}`} sub="Top 4% globally" />
            <Stat k="Streak" v={`${ME.streak}d`} sub="Active daily" />
            <Stat k="Since" v="2022" sub={ME.joined} />
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs"><span>Progress to <b className="text-[#f5d77a]">Champion</b></span><span className="text-muted-foreground">{ME.xp.toLocaleString()} / {ME.xpNext.toLocaleString()} XP</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.22_0.04_250)]"><div className="h-full bg-gold-gradient" style={{ width: `${(ME.xp / ME.xpNext) * 100}%` }} /></div>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Tier" title="Benefits" />
          <ul className="space-y-2.5 text-sm">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2"><Medal className="h-4 w-4 text-[#f5d77a]" /> {b}</li>
            ))}
          </ul>
          <button className="mt-6 w-full rounded-lg bg-gold-gradient py-2.5 text-sm font-semibold text-[oklch(0.13_0.025_250)] shadow-[0_10px_30px_-10px_#d4a14a]">Upgrade To Elite</button>
        </Card>
      </div>
      <Card>
        <SectionTitle eyebrow="Tier ladder" title="All Memberships" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {RANKS.map((r) => {
            const current = r.name === ME.tier;
            return (
              <div key={r.name} className={`rounded-xl border p-3 text-center ${current ? "border-[#f5d77a] bg-[oklch(0.78_0.14_82/0.1)] shadow-[0_0_24px_-8px_#f5d77a]" : "border-gold bg-[oklch(0.16_0.03_250/0.7)]"}`}>
                <div className="mx-auto h-8 w-8 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${r.color}, #00000050)` }} />
                <div className="mt-2 font-display text-sm font-semibold" style={{ color: r.color }}>{r.name}</div>
                <div className="text-[10px] text-muted-foreground">{r.min.toLocaleString()} XP</div>
                {current && <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#f5d77a]">You are here</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function IdentityCardScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · LinkedIn style" title="Identity Card" sub="A compact, signed identity proof for offline and on-site verification." icon={CircleUserRound} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="spotlight relative overflow-hidden">
          <div className="aspect-[1.6/1] rounded-xl border border-gold bg-[linear-gradient(135deg,oklch(0.22_0.04_250),oklch(0.13_0.025_250))] p-6 shadow-[0_30px_80px_-30px_#000]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#d4a14a]">Software Vala · AMS</div>
                <div className="mt-1 font-display text-xl text-gold-gradient">Identity Card</div>
              </div>
              <Trophy className="h-7 w-7 text-[#f5d77a]" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient font-display text-2xl font-bold text-[oklch(0.13_0.025_250)]">{ME.initials}</div>
              <div>
                <div className="font-display text-2xl font-semibold">{ME.name}</div>
                <div className="text-xs text-muted-foreground">{ME.title}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#f5d77a]">{ME.tier} · Rank #{ME.rank}</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-gold pt-3 text-[10px] text-muted-foreground">
              <span>ID {ME.passportId}</span>
              <span>Valid · {ME.verified && <Verified className="inline h-3 w-3 text-[#f5d77a]" />} Verified</span>
            </div>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Card · Controls" title="Distribution" />
          <div className="space-y-3 text-sm">
            {[
              { i: Download, l: "Download as PDF" }, { i: Mail, l: "Email to verifier" },
              { i: Share2, l: "Share signed link" }, { i: Copy, l: "Copy verification code" },
              { i: QrCode, l: "Generate QR" }, { i: ExternalLink, l: "View public profile" },
            ].map((x) => (
              <button key={x.l} className="flex w-full items-center gap-3 rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3 text-left hover:bg-[oklch(0.78_0.14_82/0.08)]">
                <x.i className="h-4 w-4 text-[#f5d77a]" /> {x.l}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PublicProfileScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · Public" title="Public Profile" sub="What the world sees when they look you up on Software Vala." icon={Globe} />
      <Card className="spotlight relative overflow-hidden">
        <div className="flex flex-wrap items-start gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gold-gradient font-display text-3xl font-bold text-[oklch(0.13_0.025_250)]">{ME.initials}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-semibold">{ME.name}</h2>
              <Verified className="h-5 w-5 text-[#f5d77a]" />
            </div>
            <div className="text-sm text-muted-foreground">{ME.title}</div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ME.location}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined {ME.joined}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {ME.email}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-gold bg-[oklch(0.78_0.14_82/0.1)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#f5d77a]">{ME.tier}</span>
              <span className="rounded-full border border-gold bg-[oklch(0.13_0.025_250)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Rank #{ME.rank}</span>
              <span className="rounded-full border border-gold bg-[oklch(0.13_0.025_250)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Level {ME.level}</span>
              <span className="rounded-full border border-gold bg-[oklch(0.13_0.025_250)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{ME.streak}d streak</span>
            </div>
          </div>
          <div className="flex gap-2"><button className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-[oklch(0.13_0.025_250)]">Follow</button><button className="rounded-lg border border-gold px-4 py-2 text-sm text-[#f5d77a]">Endorse</button></div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle eyebrow="Featured" title="Pinned Achievements" />
          <div className="grid gap-3 sm:grid-cols-2">
            {ACHIEVEMENTS.filter((a) => a.unlocked).slice(0, 4).map((a) => (
              <div key={a.name} className="flex gap-3 rounded-xl border border-gold bg-[oklch(0.13_0.025_250)] p-3">
                <Insignia name={a.name} grade={a.rarity as never} module="recognition" size={56} />
                <div><div className="font-display font-semibold">{a.name}</div><div className="text-[11px] text-muted-foreground">{a.desc}</div><div className="mt-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: tierColor(a.rarity) }}>{a.rarity}</div></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Reputation" title="Five Pillars" />
          <div className="space-y-3">
            {PILLARS.map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-xs"><span>{p.label}</span><span className="text-[#f5d77a]">{p.value}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(0.22_0.04_250)]"><div className="h-full bg-gold-gradient" style={{ width: `${p.value}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function QRIdentityScreen() {
  // Stylised QR pattern (visual only)
  const grid = Array.from({ length: 25 * 25 }, (_, i) => ((i * 9301 + 49297) % 233280) / 233280 > 0.5);
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · Scan" title="QR Identity" sub="Show this QR at events or workshops to verify your AMS standing instantly." icon={QrCode} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="spotlight relative overflow-hidden">
          <div className="mx-auto w-fit rounded-2xl border border-gold bg-[oklch(0.95_0.02_85)] p-6">
            <div className="grid grid-cols-[repeat(25,8px)] grid-rows-[repeat(25,8px)] gap-0">
              {grid.map((on, i) => (<div key={i} className={on ? "bg-[oklch(0.13_0.025_250)]" : "bg-transparent"} />))}
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">Scan with the Software Vala app · Code <span className="text-[#f5d77a]">{ME.passportId}</span></div>
        </Card>
        <Card>
          <SectionTitle eyebrow="QR · Options" title="Sharing & Security" />
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3"><span>Rotate code every 24h</span><span className="text-[#f5d77a]">On</span></div>
            <div className="flex items-center justify-between rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3"><span>Allow public scan</span><span className="text-[#f5d77a]">On</span></div>
            <div className="flex items-center justify-between rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3"><span>Include badges</span><span className="text-[#f5d77a]">On</span></div>
            <div className="flex items-center justify-between rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3"><span>Show real name</span><span className="text-muted-foreground">Off</span></div>
            <button className="mt-2 w-full rounded-lg bg-gold-gradient py-2.5 text-sm font-semibold text-[oklch(0.13_0.025_250)]">Regenerate QR</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function VerificationScreen() {
  const checks = [
    { label: "Email", status: "Verified", date: "2022-03-14" },
    { label: "Phone", status: "Verified", date: "2022-03-14" },
    { label: "Government ID", status: "Verified", date: "2022-03-20" },
    { label: "Employer", status: "Verified", date: "2024-01-10" },
    { label: "GitHub", status: "Verified", date: "2022-03-18" },
    { label: "LinkedIn", status: "Verified", date: "2022-03-19" },
    { label: "Domain ownership", status: "Pending", date: "—" },
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Identity · Trust" title="Verification" sub="The proofs behind your AMS identity." icon={ShieldCheck} />
      <Card>
        <ul className="divide-y divide-[oklch(0.78_0.14_82/0.15)]">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-full ${c.status === "Verified" ? "bg-[oklch(0.78_0.14_82/0.15)] text-[#f5d77a]" : "bg-[oklch(0.18_0.03_250)] text-muted-foreground"}`}>
                  {c.status === "Verified" ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div><div className="font-medium">{c.label}</div><div className="text-[11px] text-muted-foreground">Verified {c.date}</div></div>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${c.status === "Verified" ? "bg-[oklch(0.78_0.14_82/0.1)] text-[#f5d77a]" : "border border-gold text-muted-foreground"}`}>{c.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ───── RECOGNITION ─────
export function AchievementsScreen() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Recognition · Trailhead style" title="Achievement Center" sub="Every milestone you've crossed in the Software Vala ecosystem." icon={Star} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat k="Unlocked" v={`${unlocked} / ${ACHIEVEMENTS.length}`} sub={`${Math.round((unlocked / ACHIEVEMENTS.length) * 100)}% complete`} />
        <Stat k="XP earned" v={`${ACHIEVEMENTS.filter(a => a.unlocked).reduce((s, a) => s + a.xp, 0).toLocaleString()}`} sub="Lifetime" />
        <Stat k="Rarest" v="Vanguard" sub="Top 1% holders" />
        <Stat k="Next" v="Immortal" sub="365d Legend" />
      </div>
      <Card>
        <SectionTitle eyebrow="Vault" title="All Achievements" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.name} className={`relative flex gap-4 rounded-xl border border-gold p-4 ${a.unlocked ? "bg-[oklch(0.18_0.03_250)]" : "bg-[oklch(0.15_0.025_250)] opacity-70"}`}>
              <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-[oklch(0.13_0.025_250)]">
                <Insignia name={a.name} grade={a.rarity as never} module="recognition" role={inferRole(a.name + " " + a.desc)} size={72} unlocked={a.unlocked} className={a.unlocked ? "award-3d" : ""} />
                {!a.unlocked && <div className="absolute inset-0 grid place-items-center rounded-lg bg-[oklch(0.13_0.025_250/0.7)]"><Lock className="h-5 w-5 text-muted-foreground" /></div>}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2"><span className="font-display text-lg font-semibold">{a.name}</span>{a.unlocked && <CheckCircle2 className="h-4 w-4 text-[#f5d77a]" />}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-gold px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: tierColor(a.rarity) }}>{a.rarity}</span>
                  <span className="text-[10px] text-muted-foreground">+{a.xp} XP{a.unlocked ? ` · ${a.date}` : ""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function BadgesScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Recognition · Microsoft Rewards style" title="Badge Center" sub="Verifiable badges earned across missions, contributions, and milestones." icon={Shield} />
      <Card>
        <SectionTitle eyebrow="Collection" title={`${BADGES.length} Badges`} action={<select className="rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-3 py-1.5 text-xs"><option>All tiers</option><option>Gold+</option><option>Diamond</option></select>} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {BADGES.map((b, i) => (
            <div key={b.name} className="group rounded-xl border border-gold bg-[oklch(0.13_0.025_250)] p-3 text-center transition-all hover:shadow-[0_0_24px_-4px_rgba(245,215,122,0.45)]">
              <div className="award-stage relative mx-auto h-20 w-20"><div className="award-3d h-full w-full" style={{ animationDelay: `${i * 0.3}s` }}><Insignia name={b.name} grade={b.tier as never} module="recognition" role={inferRole(b.name)} size={80} /></div></div>
              <div className="mt-2 truncate font-display text-sm font-semibold">{b.name}</div>
              <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: tierColor(b.tier) }}>{b.tier}</div>
              <div className="text-[9px] text-muted-foreground">{b.earned}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function TrophiesScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Recognition · Award ceremony" title="Trophy Center" sub="Annual, quarterly, and lifetime trophies awarded by the Software Vala council." icon={Trophy} />
      <Card className="spotlight relative overflow-hidden">
        <SectionTitle eyebrow="Cabinet" title="Trophy Cabinet" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TROPHIES.map((t, i) => (
            <div key={t.name} className="award-stage relative rounded-2xl border border-gold bg-[oklch(0.13_0.025_250)] p-6 text-center">
              <div className="absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-[#f5d77a] to-transparent" />
              <div className="award-3d mx-auto" style={{ animationDelay: `${i * 0.4}s` }}><Insignia name={t.name} grade={t.tier as never} kind="trophy" role={inferRole(t.name + " " + t.category)} module="recognition" size={150} /></div>
              <div className="relative z-10 mt-4 font-display text-lg font-semibold text-gold-gradient">{t.name}</div>
              <div className="relative z-10 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t.category} · {t.year}</div>
              <div className="relative z-10 mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: tierColor(t.tier) }}><Crown className="h-3 w-3" /> {t.tier}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function RecognitionScreen() {
  const recs = [
    { from: "Aarav Mehta", role: "CEO · Vendor Partner", text: "Elias raised the engineering bar across two product lines in a single quarter.", date: "2025-11-04" },
    { from: "Sofia Linden", role: "Principal Author", text: "His mentorship reshaped how our authors think about reproducible benchmarks.", date: "2025-08-22" },
    { from: "Kenji Mori", role: "Reseller Lead", text: "Reliable, generous, and technically uncompromising. A force multiplier.", date: "2025-05-10" },
    { from: "Software Vala Council", role: "Awarding Body", text: "Founder Award candidate — sustained, ecosystem-wide impact.", date: "2024-12-30" },
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Recognition · LinkedIn style" title="Recognition Center" sub="Endorsements, kudos, and council recognitions from across the ecosystem." icon={Award} />
      <div className="grid gap-4 md:grid-cols-2">
        {recs.map((r) => (
          <Card key={r.from}>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-[oklch(0.13_0.025_250)]">{r.from.split(" ").map(s => s[0]).join("")}</div>
              <div className="min-w-0">
                <div className="font-display font-semibold">{r.from}</div>
                <div className="text-[11px] text-muted-foreground">{r.role} · {r.date}</div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CertificatesScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Recognition · Verifiable" title="Certificate Center" sub="Cryptographically signed certificates — shareable, verifiable, exportable." icon={FileBadge} />
      <Card>
        <SectionTitle eyebrow="Vault" title={`${CERTIFICATES.length} Certificates`} />
        <div className="grid gap-4 md:grid-cols-2">
          {CERTIFICATES.map((c) => (
            <div key={c.id} className="rounded-2xl border border-gold bg-[linear-gradient(135deg,oklch(0.22_0.04_250),oklch(0.13_0.025_250))] p-5">
              <div className="flex items-start justify-between">
                <FileBadge className="h-8 w-8 text-[#f5d77a]" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.id}</span>
              </div>
              <div className="mt-3 font-display text-xl font-semibold text-gold-gradient">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">Issued by {c.issuer} · {c.issued}</div>
              <div className="mt-4 flex items-center justify-between border-t border-gold pt-3 text-[11px]">
                <span className="text-muted-foreground">Credential ID</span>
                <span className="font-mono text-[#f5d77a]">{c.credId}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg bg-gold-gradient py-2 text-xs font-semibold text-[oklch(0.13_0.025_250)]">Download</button>
                <button className="flex-1 rounded-lg border border-gold py-2 text-xs text-[#f5d77a]">Verify</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ───── PROGRESS ─────
export function LevelsScreen() {
  const levels = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Progress · Duolingo style" title="Levels & XP" sub={`Level ${ME.level} · ${ME.xp.toLocaleString()} XP earned`} icon={TrendingUp} />
      <Card>
        <SectionTitle eyebrow="Path" title="Level Path" />
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <div key={l} className={`grid h-10 w-10 place-items-center rounded-full text-xs font-semibold ${l < ME.level ? "bg-[oklch(0.78_0.14_82/0.15)] text-[#f5d77a]" : l === ME.level ? "bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_0_18px_#f5d77a]" : "border border-gold text-muted-foreground"}`}>{l}</div>
          ))}
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs"><span>Level {ME.level} → {ME.level + 1}</span><span className="text-muted-foreground">{ME.xp.toLocaleString()} / {ME.xpNext.toLocaleString()} XP</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.22_0.04_250)]"><div className="h-full bg-gold-gradient" style={{ width: `${(ME.xp / ME.xpNext) * 100}%` }} /></div>
        </div>
      </Card>
    </div>
  );
}

export function RanksScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Progress · Tier ladder" title="Rank Center" sub="The seven AMS ranks — from Bronze to Legend." icon={Crown} />
      <Card>
        <div className="space-y-3">
          {RANKS.map((r, i) => {
            const current = r.name === ME.tier;
            const passed = i <= RANKS.findIndex(x => x.name === ME.tier);
            return (
              <div key={r.name} className={`flex items-center gap-4 rounded-xl border p-4 ${current ? "border-[#f5d77a] bg-[oklch(0.78_0.14_82/0.1)]" : "border-gold bg-[oklch(0.16_0.03_250/0.7)]"}`}>
                <div className="grid h-12 w-12 place-items-center rounded-full font-display text-lg font-bold" style={{ background: passed ? `radial-gradient(circle at 30% 30%, ${r.color}, #00000080)` : "transparent", color: r.color, border: passed ? "none" : `1px solid ${r.color}40` }}>{i + 1}</div>
                <div className="flex-1">
                  <div className="font-display text-lg font-semibold" style={{ color: r.color }}>{r.name}</div>
                  <div className="text-xs text-muted-foreground">Requires {r.min.toLocaleString()} XP</div>
                </div>
                {current ? <span className="rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.13_0.025_250)]">Current</span> : passed ? <CheckCircle2 className="h-5 w-5 text-[#f5d77a]" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export function MissionsScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Progress · Quests" title="Mission Center" sub="Daily, weekly, seasonal — fuel your XP engine." icon={Target} />
      <div className="grid gap-4 md:grid-cols-2">
        {MISSIONS.map((m) => (
          <Card key={m.title}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4a14a]">{m.type}</div>
                <div className="mt-1 font-display text-lg font-semibold">{m.title}</div>
              </div>
              <span className="rounded-full bg-[oklch(0.78_0.14_82/0.12)] px-3 py-1 text-[11px] text-[#f5d77a]">{m.reward}</span>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="text-[#f5d77a]">{m.progress}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(0.22_0.04_250)]"><div className="h-full bg-gold-gradient" style={{ width: `${m.progress}%` }} /></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function JourneyScreen() {
  // GitHub-style contribution heatmap
  const cellColor = (v: number) =>
    ["oklch(0.22 0.04 250)", "oklch(0.45 0.08 82)", "oklch(0.62 0.13 75)", "oklch(0.78 0.14 82)", "oklch(0.9 0.11 90)"][v];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Progress · GitHub style" title="Journey" sub="Your full timeline and contribution heatmap." icon={History} />
      <Card>
        <SectionTitle eyebrow="Activity" title="Last 365 days" action={<div className="flex items-center gap-1 text-[10px] text-muted-foreground">Less {[0,1,2,3,4].map(i => <span key={i} className="inline-block h-2.5 w-2.5" style={{ background: cellColor(i) }} />)} More</div>} />
        <div className="overflow-x-auto"><div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ width: "fit-content" }}>
          {HEATMAP.map((v, i) => (<div key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: cellColor(v) }} title={`Day ${i + 1}`} />))}
        </div></div>
      </Card>
      <Card>
        <SectionTitle eyebrow="Timeline" title="Major Milestones" />
        <ol className="relative ml-3 space-y-5 border-l border-[oklch(0.78_0.14_82/0.4)] pl-6">
          {JOURNEY.map((e) => (
            <li key={e.date + e.label} className="relative">
              <span className="absolute -left-[31px] grid h-4 w-4 place-items-center rounded-full bg-gold-gradient text-[oklch(0.13_0.025_250)]"><Sparkles className="h-2.5 w-2.5" /></span>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4a14a]">{e.date} · {e.kind}</div>
              <div className="font-medium">{e.label}</div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

export function ReputationScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Progress · Trust" title="Reputation Center" sub="Five pillars that compose your AMS reputation score." icon={Flame} />
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card className="spotlight relative overflow-hidden">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">Composite Score</div>
            <div className="mt-2 font-display text-7xl font-semibold text-gold-gradient">{ME.trustScore}</div>
            <div className="text-xs text-muted-foreground">Top 4% globally · +12.4% this season</div>
          </div>
        </Card>
        <Card>
          <SectionTitle eyebrow="Breakdown" title="Pillars" />
          <div className="space-y-4">
            {PILLARS.map((p) => (
              <div key={p.label}>
                <div className="mb-1 flex justify-between text-sm"><span>{p.label}</span><span className="text-[#f5d77a]">{p.value} / 100</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-[oklch(0.22_0.04_250)]"><div className="h-full bg-gold-gradient" style={{ width: `${p.value}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ───── COMMUNITY ─────
export function LeaderboardScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Community · Global" title="Leaderboard" sub="Top contributors across the Software Vala ecosystem." icon={BarChart3} />
      <Card>
        <SectionTitle eyebrow="Top 10" title="Global Leaderboard" action={
          <div className="flex gap-2 text-[10px] uppercase tracking-[0.2em]">
            {["Global", "Country", "Vendor", "Author"].map((t, i) => (
              <button key={t} className={`rounded-full border px-3 py-1.5 ${i === 0 ? "border-[#f5d77a] bg-[oklch(0.78_0.14_82/0.12)] text-[#f5d77a]" : "border-gold text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        } />
        <div className="overflow-hidden rounded-xl border border-gold">
          <table className="w-full text-sm">
            <thead><tr className="bg-[oklch(0.13_0.025_250)] text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3">#</th><th className="px-4 py-3">Member</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3 text-right">XP</th>
            </tr></thead>
            <tbody>
              {LEADERBOARD.map((m) => (
                <tr key={m.rank} className={`border-t border-gold ${m.you ? "bg-[oklch(0.78_0.14_82/0.08)]" : "bg-[oklch(0.18_0.03_250)]"}`}>
                  <td className="px-4 py-3"><div className={`grid h-8 w-8 place-items-center rounded-full font-display text-sm font-semibold ${m.rank === 1 ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]" : m.rank === 2 ? "bg-gradient-to-br from-[#d8d8d8] to-[#8a8a8a] text-[oklch(0.13_0.025_250)]" : m.rank === 3 ? "bg-gradient-to-br from-[#c89668] to-[#7a5230] text-[oklch(0.13_0.025_250)]" : "border border-gold text-[#f5d77a]"}`}>{m.rank}</div></td>
                  <td className="px-4 py-3 font-medium">{m.name}{m.you && <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-[#f5d77a]">You</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.country}</td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 rounded-full border border-gold px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: tierColor(m.tier) }}><Crown className="h-3 w-3" /> {m.tier}</span></td>
                  <td className="px-4 py-3 text-right font-display text-base text-gold-gradient">{m.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function HallOfFameScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Community · Eternal" title="Hall Of Fame" sub="The inducted legends of Software Vala." icon={Sparkles} />
      <div className="grid gap-6 md:grid-cols-2">
        {HALL_OF_FAME.map((h) => (
          <Card key={h.year} className="spotlight relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">{h.year} · Inductee</div>
            <div className="mt-2 flex items-start gap-4">
              <div className="award-3d shrink-0"><Insignia name={h.title + " " + h.name} grade="Founder" kind="trophy" module="community" size={108} /></div>
              <div>
                <div className="font-display text-2xl font-semibold text-gold-gradient">{h.name}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#f5d77a]">{h.title}</div>
                <p className="mt-3 text-sm italic text-muted-foreground">"{h.quote}"</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function RewardsScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Community · Redeem" title="Reward Center" sub="Trade XP for merch, access, mentorship and collectibles." icon={Gift} />
      <div className="mb-2 flex items-center gap-3"><div className="text-sm text-muted-foreground">Available balance</div><div className="font-display text-2xl text-gold-gradient">{ME.xp.toLocaleString()} XP</div></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((r) => (
          <Card key={r.name}>
            <div className="flex items-start justify-between"><Gift className="h-7 w-7 text-[#f5d77a]" /><span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{r.type}</span></div>
            <div className="mt-3 font-display text-lg font-semibold">{r.name}</div>
            <div className="mt-1 text-sm text-[#f5d77a]">{r.cost.toLocaleString()} XP</div>
            <button disabled={!r.available} className={`mt-4 w-full rounded-lg py-2 text-sm font-semibold ${r.available ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]" : "border border-gold text-muted-foreground"}`}>{r.available ? "Redeem" : "Locked"}</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CommunityRankingScreen() {
  const groups = [
    { name: "Engineers · Berlin", members: 1240, you: 12 },
    { name: "Vendors · Global", members: 890, you: 88 },
    { name: "Authors · EU", members: 460, you: 4 },
    { name: "Open Source Maintainers", members: 312, you: 19 },
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Community · Discord style" title="Community Ranking" sub="Your standing inside the groups you belong to." icon={Users} />
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.name}>
            <SectionTitle eyebrow="Group" title={g.name} action={<span className="text-xs text-muted-foreground">{g.members} members</span>} />
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient font-display text-lg font-bold text-[oklch(0.13_0.025_250)]">#{g.you}</div>
              <div><div className="text-sm">Your rank in this community</div><div className="text-xs text-muted-foreground">Top {Math.round((g.you / g.members) * 100)}%</div></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ───── COLLECTIONS ─────
export function CollectionsScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Collections · Steam style" title="Collections" sub="Owned assets, unlocked items, and seasonal drops." icon={Layers} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <Card key={c.name}>
            <div className="flex items-start justify-between">
              <Layers className="h-7 w-7 text-[#f5d77a]" />
              <span className="rounded-full border border-gold px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]" style={{ color: tierColor(c.rarity) }}>{c.rarity}</span>
            </div>
            <div className="mt-3 font-display text-lg font-semibold">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.type} · {c.items} items</div>
            <button className="mt-4 w-full rounded-lg border border-gold py-2 text-xs text-[#f5d77a]">Browse items</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ───── ANALYTICS ─────
function MiniChart({ data }: { data: { m: string; v: number }[] }) {
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const path = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.v - min) / (max - min)) * 100;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-44 w-full" preserveAspectRatio="none">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5d77a" stopOpacity="0.5" /><stop offset="100%" stopColor="#f5d77a" stopOpacity="0" /></linearGradient></defs>
      <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#g)" />
      <path d={path} stroke="#f5d77a" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function GenericAnalytics({ title, eyebrow, sub, icon }: { title: string; eyebrow: string; sub: string; icon: typeof Trophy }) {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow={eyebrow} title={title} sub={sub} icon={icon} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ENGAGEMENT.slice(0, 4).map((e) => (
          <div key={e.label} className="rounded-xl border border-gold bg-[oklch(0.16_0.03_250/0.7)] p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{e.label}</div>
            <div className="mt-1 font-display text-2xl font-semibold text-gold-gradient">{e.value}</div>
            <div className="text-[10px] text-[#f5d77a]">{e.delta}</div>
          </div>
        ))}
      </div>
      <Card>
        <SectionTitle eyebrow="Trend" title="Last 12 months" action={<div className="flex gap-1 text-[10px] uppercase tracking-[0.2em]">{["7d","30d","90d","1y"].map((p,i)=>(<button key={p} className={`rounded-full border px-2 py-1 ${i===3?"border-[#f5d77a] text-[#f5d77a]":"border-gold text-muted-foreground"}`}>{p}</button>))}</div>} />
        <MiniChart data={XP_TREND} />
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">{XP_TREND.map(d => <span key={d.m}>{d.m}</span>)}</div>
      </Card>
      <Card>
        <SectionTitle eyebrow="Engagement" title="Full Breakdown" />
        <div className="overflow-hidden rounded-xl border border-gold">
          <table className="w-full text-sm">
            <thead><tr className="bg-[oklch(0.13_0.025_250)] text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><th className="px-4 py-3">Metric</th><th className="px-4 py-3">Value</th><th className="px-4 py-3 text-right">Δ</th></tr></thead>
            <tbody>{ENGAGEMENT.map((e) => (<tr key={e.label} className="border-t border-gold bg-[oklch(0.18_0.03_250)]"><td className="px-4 py-3">{e.label}</td><td className="px-4 py-3 font-display text-gold-gradient">{e.value}</td><td className="px-4 py-3 text-right text-[#f5d77a]">{e.delta}</td></tr>))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export const XPAnalyticsScreen = () => <GenericAnalytics title="XP Analytics" eyebrow="Analytics · Datadog style" sub="XP earned, velocity, and projections." icon={Zap} />;
export const AchievementAnalyticsScreen = () => <GenericAnalytics title="Achievement Analytics" eyebrow="Analytics · Trailhead style" sub="Unlock rate, rarity mix, and trajectory." icon={Star} />;
export const EngagementAnalyticsScreen = () => <GenericAnalytics title="Engagement Analytics" eyebrow="Analytics · Power BI style" sub="Sessions, time on platform, reactions." icon={Activity} />;
export const GrowthAnalyticsScreen = () => <GenericAnalytics title="Growth Analytics" eyebrow="Analytics · Google Analytics style" sub="Member growth, referrals, and retention." icon={TrendingUp} />;

// ───── SETTINGS ─────
function Toggle({ on }: { on: boolean }) {
  return <span className={`relative inline-block h-5 w-9 rounded-full ${on ? "bg-gold-gradient" : "bg-[oklch(0.3_0.04_250)]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[oklch(0.13_0.025_250)] transition-all ${on ? "left-4" : "left-0.5"}`} /></span>;
}

export function ProfileSettingsScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Settings · Google style" title="Profile" sub="Public profile and identity details." icon={CircleUserRound} />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          {[["Display name", ME.name], ["Handle", ME.handle], ["Title", ME.title], ["Location", ME.location], ["Email", ME.email], ["Joined", ME.joined]].map(([l, v]) => (
            <label key={l} className="block"><div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div><input defaultValue={v} className="mt-1 w-full rounded-lg border border-gold bg-[oklch(0.13_0.025_250)] px-3 py-2 text-sm" /></label>
          ))}
        </div>
        <button className="mt-6 rounded-lg bg-gold-gradient px-5 py-2 text-sm font-semibold text-[oklch(0.13_0.025_250)]">Save changes</button>
      </Card>
    </div>
  );
}

export function SecuritySettingsScreen() {
  const items = [
    { i: Key, l: "Password", s: "Last changed 3 months ago", action: "Change" },
    { i: ShieldCheck, l: "Two-factor authentication", s: "Authenticator app · Enabled", action: "Manage" },
    { i: Eye, l: "Active sessions", s: "3 active devices", action: "View" },
    { i: Activity, l: "Sign-in history", s: "Last sign-in 2h ago · Berlin", action: "View" },
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Settings · Security" title="Security" sub="Authentication, sessions, and account protection." icon={Key} />
      <Card>
        <ul className="divide-y divide-[oklch(0.78_0.14_82/0.15)]">
          {items.map((x) => (
            <li key={x.l} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.78_0.14_82/0.12)] text-[#f5d77a]"><x.i className="h-4 w-4" /></div><div><div className="font-medium">{x.l}</div><div className="text-[11px] text-muted-foreground">{x.s}</div></div></div>
              <button className="rounded-lg border border-gold px-4 py-1.5 text-xs text-[#f5d77a]">{x.action}</button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function PrivacySettingsScreen() {
  const rules = [
    { l: "Public profile visible", on: true },
    { l: "Show real name on leaderboard", on: false },
    { l: "Allow QR scan by anyone", on: true },
    { l: "Show streaks publicly", on: true },
    { l: "Allow endorsements", on: true },
    { l: "Index profile in search engines", on: false },
  ];
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Settings · Privacy" title="Privacy" sub="Control what others can see and how AMS uses your data." icon={Eye} />
      <Card>
        <ul className="divide-y divide-[oklch(0.78_0.14_82/0.15)]">
          {rules.map((r) => (
            <li key={r.l} className="flex items-center justify-between py-4"><span>{r.l}</span><Toggle on={r.on} /></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function NotificationsSettingsScreen() {
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Settings · Notifications" title="Notifications" sub="Choose how AMS pings you about achievements and milestones." icon={Bell} />
      <Card>
        <div className="overflow-hidden rounded-xl border border-gold">
          <table className="w-full text-sm">
            <thead><tr className="bg-[oklch(0.13_0.025_250)] text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><th className="px-4 py-3">Event</th><th className="px-4 py-3 text-center">Email</th><th className="px-4 py-3 text-center">Push</th></tr></thead>
            <tbody>{NOTIFICATIONS_PREFS.map((p) => (<tr key={p.label} className="border-t border-gold bg-[oklch(0.18_0.03_250)]"><td className="px-4 py-3">{p.label}</td><td className="px-4 py-3 text-center"><Toggle on={p.email} /></td><td className="px-4 py-3 text-center"><Toggle on={p.push} /></td></tr>))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function ConnectedAccountsScreen() {
  const iconFor = (n: string) => ({ GitHub: Github, LinkedIn: Linkedin, Google: Globe, "Microsoft Entra": ShieldCheck, "Apple ID": CircleUserRound, Discord: Users } as Record<string, typeof Trophy>)[n] ?? Globe;
  return (
    <div className="space-y-6">
      <ScreenHeader eyebrow="Settings · OAuth" title="Connected Accounts" sub="External identities federated to your AMS passport." icon={ExternalLink} />
      <Card>
        <ul className="divide-y divide-[oklch(0.78_0.14_82/0.15)]">
          {CONNECTED.map((c) => { const Icon = iconFor(c.name); return (
            <li key={c.name} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.78_0.14_82/0.12)] text-[#f5d77a]"><Icon className="h-4 w-4" /></div><div><div className="font-medium">{c.name}</div><div className="text-[11px] text-muted-foreground">{c.handle}</div></div></div>
              <button className={`rounded-lg px-4 py-1.5 text-xs ${c.connected ? "border border-gold text-[#f5d77a]" : "bg-gold-gradient text-[oklch(0.13_0.025_250)] font-semibold"}`}>{c.connected ? "Disconnect" : "Connect"}</button>
            </li>
          );})}
        </ul>
      </Card>
    </div>
  );
}

// ───── REGISTRY ─────
export const SCREENS: Record<string, React.ComponentType> = {
  // Identity
  "Passport": PassportScreen,
  "Membership": MembershipScreen,
  "Identity Card": IdentityCardScreen,
  "Public Profile": PublicProfileScreen,
  "QR Identity": QRIdentityScreen,
  "Verification": VerificationScreen,
  // Recognition
  "Achievements": AchievementsScreen,
  "Badges": BadgesScreen,
  "Trophies": TrophiesScreen,
  "Recognition": RecognitionScreen,
  "Certificates": CertificatesScreen,
  // Progress
  "Levels & XP": LevelsScreen,
  "Ranks": RanksScreen,
  "Missions": MissionsScreen,
  "Journey": JourneyScreen,
  "Reputation": ReputationScreen,
  // Community
  "Leaderboard": LeaderboardScreen,
  "Hall Of Fame": HallOfFameScreen,
  "Rewards": RewardsScreen,
  "Community Ranking": CommunityRankingScreen,
  // Collections
  "Collections": CollectionsScreen,
  // Analytics
  "XP Analytics": XPAnalyticsScreen,
  "Achievement Analytics": AchievementAnalyticsScreen,
  "Engagement Analytics": EngagementAnalyticsScreen,
  "Growth Analytics": GrowthAnalyticsScreen,
  // Settings
  "Profile": ProfileSettingsScreen,
  "Security": SecuritySettingsScreen,
  "Privacy": PrivacySettingsScreen,
  "Notifications": NotificationsSettingsScreen,
  "Connected Accounts": ConnectedAccountsScreen,
  // Communication
  "Chat": ChatScreen,
};

