import {
  Activity, AlertTriangle, Award, BarChart3, Bell, Bot, Boxes, Building2, CheckCircle2,
  ClipboardList, Code2, Crown, Database, DollarSign, FileText, Flag, Gauge, Globe,
  GraduationCap, Handshake, HardDrive, Inbox, KeyRound, Layers, LifeBuoy, ListChecks,
  Lock, Map, Megaphone, MessageSquare, Package, Percent, PieChart, Radar, Rocket,
  ScrollText, Server, ShieldAlert, ShieldCheck, Sparkles, Star, Target, Terminal,
  TrendingUp, Users, Video, Wrench, Zap,
  type LucideIcon,
} from "lucide-react";
import type { KPI, ManagerConfig, Section, TableCol, TableRow, Tone } from "./managerConfigs";

/* ------------------------------ builders -------------------------------- */

const kpi = (label: string, value: string, delta = "", tone: Tone = "default", icon: LucideIcon = Activity): KPI =>
  ({ label, value, delta, tone, icon });

const table = (headers: string[], data: string[][]): { columns: TableCol[]; rows: TableRow[] } => {
  const key = (h: string) => h.toLowerCase().replace(/\s+/g, "_");
  return {
    columns: headers.map((h) => ({ key: key(h), label: h })),
    rows: data.map((r) => Object.fromEntries(headers.map((h, i) => [key(h), r[i] ?? "—"]))),
  };
};

type SectionSpec = {
  id: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  kpis: KPI[];
  headers: string[];
  data: string[][];
  chips?: string[];
  action?: string;
};

const section = (s: SectionSpec): Section => ({
  id: s.id,
  label: s.label,
  icon: s.icon,
  eyebrow: s.eyebrow,
  title: s.title,
  description: s.description,
  kpis: s.kpis,
  chips: s.chips,
  primaryAction: s.action,
  ...table(s.headers, s.data),
});

const mgr = (
  id: string,
  label: string,
  icon: LucideIcon,
  tagline: string,
  sections: SectionSpec[],
): ManagerConfig => ({ id, label, icon, tagline, sections: sections.map(section) });

/* ============================ BATCH 1 =================================== */

const CONTROL_PANEL = mgr("control-panel", "Control Panel", Gauge,
  "Global switches, environments, feature flags and platform-wide configuration.", [
  {
    id: "overview", label: "Overview", icon: Gauge, eyebrow: "Platform", title: "Control Panel Overview",
    description: "Live platform posture across environments, flags and global switches.",
    kpis: [kpi("Environments", "4", "all green", "success", Server), kpi("Feature Flags", "68", "12 staged", "default", Flag),
      kpi("Global Switches", "22", "", "premium", Zap), kpi("Incidents", "0", "24h", "success", ShieldCheck)],
    headers: ["Environment", "Version", "Region", "State"],
    data: [["Production", "v4.2.1", "Global", "Healthy"], ["Staging", "v4.3.0-rc2", "EU", "Healthy"],
      ["Sandbox", "v4.3.0-rc2", "IN", "Healthy"], ["DR", "v4.2.1", "US-E", "Standby"]],
    action: "New switch",
  },
  {
    id: "flags", label: "Feature Flags", icon: Flag, eyebrow: "Rollout", title: "Feature Flags",
    description: "Progressive delivery — target cohorts, ramp percentages and kill switches.",
    kpis: [kpi("Active", "68", "", "default", Flag), kpi("Ramping", "12", "", "warning", TrendingUp),
      kpi("Killed", "3", "", "destructive", ShieldAlert), kpi("Stale >90d", "5", "", "warning", ClipboardList)],
    headers: ["Flag", "Scope", "Ramp", "Owner", "State"],
    data: [["new_checkout", "Marketplace", "45%", "Growth", "Ramping"], ["ai_assist_v3", "Global", "100%", "AI", "Live"],
      ["vendor_payouts", "Finance", "10%", "Finance", "Ramping"], ["legacy_search", "Marketplace", "0%", "Platform", "Killed"]],
    chips: ["All", "Ramping", "Live", "Killed", "Stale"], action: "Create flag",
  },
  {
    id: "switches", label: "Global Switches", icon: Zap, eyebrow: "Runtime", title: "Global Switches",
    description: "Platform-wide toggles for maintenance, signups, payouts and public surfaces.",
    kpis: [kpi("Enabled", "19", "", "success", CheckCircle2), kpi("Disabled", "3", "", "warning", AlertTriangle),
      kpi("Boss-locked", "6", "", "premium", Lock), kpi("Changes 7d", "8", "", "default", Activity)],
    headers: ["Switch", "Impact", "Requires", "State"],
    data: [["Maintenance mode", "All surfaces", "Boss", "Off"], ["Public signups", "Marketplace", "Ops", "On"],
      ["Vendor payouts", "Finance", "Boss", "On"], ["AI answers", "Assist", "Ops", "On"]],
    action: "Toggle switch",
  },
  {
    id: "config", label: "Configuration", icon: Wrench, eyebrow: "Settings", title: "Platform Configuration",
    description: "Tenant defaults, limits, retention and regional configuration sets.",
    kpis: [kpi("Config sets", "14", "", "default", Layers), kpi("Overrides", "31", "", "warning", Wrench),
      kpi("Drift", "0", "", "success", ShieldCheck), kpi("Last apply", "2h", "", "default", Activity)],
    headers: ["Key", "Scope", "Value", "Updated"],
    data: [["session.ttl", "Global", "12h", "2d ago"], ["upload.max_mb", "Marketplace", "250", "5d ago"],
      ["retention.logs", "Global", "180d", "1w ago"], ["rate.api_rpm", "API", "6,000", "3d ago"]],
    action: "Add config",
  },
  {
    id: "audit", label: "Audit Trail", icon: ScrollText, eyebrow: "Governance", title: "Control Audit Trail",
    description: "Every switch, flag and configuration change with actor and justification.",
    kpis: [kpi("Events 24h", "146", "", "default", Activity), kpi("Boss actions", "9", "", "premium", Crown),
      kpi("Reverted", "2", "", "warning", AlertTriangle), kpi("Retention", "365d", "", "premium", Lock)],
    headers: ["Time", "Actor", "Change", "Result"],
    data: [["09:12", "Boss", "Enabled vendor_payouts", "Applied"], ["08:40", "Ops", "Ramp new_checkout 45%", "Applied"],
      ["Yesterday", "Platform", "Killed legacy_search", "Applied"]],
  },
]);

const SUPER_ADMIN = mgr("super-admin", "Super Admin", ShieldCheck,
  "Tenants, privileged accounts, impersonation and root-level governance.", [
  {
    id: "tenants", label: "Tenants", icon: Building2, eyebrow: "Estate", title: "Tenant Directory",
    description: "Every tenant on the platform with plan, region and health.",
    kpis: [kpi("Tenants", "412", "+9 MTD", "success", Building2), kpi("Enterprise", "48", "", "premium", Crown),
      kpi("Suspended", "3", "", "destructive", ShieldAlert), kpi("Trials", "27", "", "warning", Star)],
    headers: ["Tenant", "Plan", "Region", "Users", "State"],
    data: [["Northwind Group", "Enterprise", "US", "1,240", "Active"], ["Acme Retail", "Growth", "EU", "312", "Active"],
      ["Kite Labs", "Trial", "IN", "18", "Trial"], ["Orbit Media", "Growth", "APAC", "94", "Suspended"]],
    chips: ["All", "Enterprise", "Growth", "Trial", "Suspended"], action: "Add tenant",
  },
  {
    id: "accounts", label: "Privileged Accounts", icon: KeyRound, eyebrow: "Identity", title: "Privileged Accounts",
    description: "Root, admin and break-glass accounts with MFA and last-use posture.",
    kpis: [kpi("Privileged", "24", "", "warning", KeyRound), kpi("MFA enforced", "24", "100%", "success", ShieldCheck),
      kpi("Break-glass", "2", "", "premium", Lock), kpi("Dormant 30d", "1", "", "warning", AlertTriangle)],
    headers: ["Account", "Role", "MFA", "Last used"],
    data: [["boss@softwarevala", "Root", "Hardware key", "Today"], ["ops.lead", "Super Admin", "TOTP", "Today"],
      ["breakglass-1", "Break-glass", "Hardware key", "62d ago"]],
    action: "Grant access",
  },
  {
    id: "impersonation", label: "Impersonation", icon: Users, eyebrow: "Support", title: "Impersonation Sessions",
    description: "Time-boxed, fully-audited support impersonation with consent capture.",
    kpis: [kpi("Active", "1", "", "warning", Activity), kpi("Sessions 7d", "18", "", "default", Users),
      kpi("Avg length", "9m", "", "default", Gauge), kpi("Consent rate", "100%", "", "success", CheckCircle2)],
    headers: ["Agent", "Tenant", "Reason", "State"],
    data: [["ops.lead", "Acme Retail", "Billing defect", "Active"], ["support.2", "Kite Labs", "Onboarding", "Ended"]],
    action: "Start session",
  },
  {
    id: "policies", label: "Root Policies", icon: ShieldCheck, eyebrow: "Governance", title: "Root Policies",
    description: "Non-delegable policies that only the founder can change.",
    kpis: [kpi("Policies", "16", "", "default", ScrollText), kpi("Boss-only", "6", "", "premium", Crown),
      kpi("Violations", "0", "", "success", ShieldCheck), kpi("Review due", "2", "", "warning", ClipboardList)],
    headers: ["Policy", "Scope", "Owner", "State"],
    data: [["No prod data export", "Global", "Boss", "Enforced"], ["Dual approval > $50K", "Finance", "Boss", "Enforced"],
      ["PII masking in demos", "Marketplace", "Legal", "Enforced"]],
  },
  {
    id: "audit", label: "Root Audit", icon: ScrollText, eyebrow: "Governance", title: "Root Audit Log",
    description: "Immutable log of every super-admin action across all tenants.",
    kpis: [kpi("Events 24h", "312", "", "default", Activity), kpi("High risk", "4", "", "warning", ShieldAlert),
      kpi("Blocked", "1", "", "destructive", AlertTriangle), kpi("Retention", "7y", "", "premium", Lock)],
    headers: ["Time", "Actor", "Action", "Target"],
    data: [["10:04", "ops.lead", "Impersonate", "Acme Retail"], ["09:20", "Boss", "Suspend tenant", "Orbit Media"]],
  },
]);

const BOSS_DASHBOARD = mgr("boss-dashboard", "Boss Dashboard", Crown,
  "Founder cockpit — decisions waiting on you, escalations and company pulse.", [
  {
    id: "decisions", label: "Decision Queue", icon: Crown, eyebrow: "Founder", title: "Decisions Waiting on You",
    description: "Everything blocked until the founder decides, ranked by cost of delay.",
    kpis: [kpi("Waiting", "12", "", "warning", ClipboardList), kpi("Overdue", "3", "", "destructive", AlertTriangle),
      kpi("Value at stake", "$1.9M", "", "premium", DollarSign), kpi("Avg decide time", "6h", "-2h", "success", Gauge)],
    headers: ["Decision", "Owner", "Impact", "Waiting", "State"],
    data: [["LATAM reseller rollout", "Reseller", "$148K", "2d", "Overdue"], ["v4.2 global release", "Dev", "All tenants", "6h", "Pending"],
      ["Acme renewal terms", "Finance", "$420K", "1d", "Pending"], ["Mumbai franchise go-live", "Franchise", "Launch", "3d", "Overdue"]],
    chips: ["All", "Overdue", "Today", "This week"], action: "Decide",
  },
  {
    id: "pulse", label: "Company Pulse", icon: Activity, eyebrow: "Signals", title: "Company Pulse",
    description: "One screen view of revenue, delivery, people and risk.",
    kpis: [kpi("ARR", "$12.1M", "+18% MoM", "success", DollarSign), kpi("NRR", "118%", "+4pt", "success", TrendingUp),
      kpi("Delivery SLA", "96%", "-1pt", "warning", Target), kpi("Attrition", "4.2%", "", "default", Users)],
    headers: ["Signal", "Now", "Trend", "Owner"],
    data: [["New MRR", "$186K", "Up", "Sales"], ["Support backlog", "23", "Down", "Support"],
      ["Open incidents", "0", "Flat", "Server"], ["Hiring pipeline", "34", "Up", "HR"]],
  },
  {
    id: "escalations", label: "Escalations", icon: AlertTriangle, eyebrow: "Risk", title: "Founder Escalations",
    description: "Items escalated past manager level and needing founder attention.",
    kpis: [kpi("Open", "6", "", "warning", AlertTriangle), kpi("Critical", "2", "", "destructive", ShieldAlert),
      kpi("Aged >48h", "1", "", "warning", ClipboardList), kpi("Closed 7d", "14", "", "success", CheckCircle2)],
    headers: ["Escalation", "From", "Severity", "Age"],
    data: [["Gateway latency EU", "Server", "Critical", "4h"], ["Enterprise churn risk", "Sales", "Critical", "1d"],
      ["Trademark misuse", "Legal", "High", "2d"]],
  },
  {
    id: "briefing", label: "Daily Briefing", icon: FileText, eyebrow: "Digest", title: "Daily Founder Briefing",
    description: "Auto-composed morning digest of what changed and what needs you.",
    kpis: [kpi("Items", "18", "", "default", FileText), kpi("Needs you", "12", "", "warning", Crown),
      kpi("Auto-cleared", "42", "", "success", CheckCircle2), kpi("Read time", "4m", "", "default", Gauge)],
    headers: ["Section", "Highlight", "Action"],
    data: [["Revenue", "ARR crossed $12M", "Acknowledge"], ["Risk", "2 critical escalations", "Review"],
      ["People", "3 offers awaiting sign-off", "Approve"]],
  },
]);

const CEO_DASHBOARD = mgr("ceo-dashboard", "CEO Dashboard", TrendingUp,
  "Strategy, OKRs, board reporting and executive performance review.", [
  {
    id: "okrs", label: "OKRs", icon: Target, eyebrow: "Strategy", title: "Company OKRs",
    description: "Quarterly objectives with key results, owners and confidence.",
    kpis: [kpi("Objectives", "6", "", "default", Target), kpi("On track", "4", "", "success", CheckCircle2),
      kpi("At risk", "2", "", "warning", AlertTriangle), kpi("Avg confidence", "72%", "", "default", Gauge)],
    headers: ["Objective", "Key result", "Owner", "Progress", "State"],
    data: [["Own the SMB segment", "1,000 paying tenants", "Sales", "68%", "On track"],
      ["Best-in-class delivery", "SLA 98%", "Ops", "96%", "At risk"],
      ["Marketplace flywheel", "300 partner apps", "Marketplace", "54%", "On track"]],
    chips: ["All", "On track", "At risk", "Off track"], action: "New objective",
  },
  {
    id: "board", label: "Board Pack", icon: FileText, eyebrow: "Reporting", title: "Board Pack",
    description: "Assemble, review and lock the quarterly board reporting pack.",
    kpis: [kpi("Sections", "9", "", "default", FileText), kpi("Complete", "6", "", "success", CheckCircle2),
      kpi("Due in", "36h", "", "warning", Gauge), kpi("Reviewers", "4", "", "default", Users)],
    headers: ["Section", "Owner", "Version", "State"],
    data: [["Financials", "Finance", "v3", "Complete"], ["Product", "Dev", "v2", "In review"],
      ["Founder note", "Boss", "—", "Empty"]],
    action: "Open draft",
  },
  {
    id: "exec", label: "Exec Performance", icon: Award, eyebrow: "People", title: "Executive Performance",
    description: "Leadership scorecards across delivery, people and financial ownership.",
    kpis: [kpi("Leaders", "12", "", "default", Users), kpi("Above bar", "8", "", "success", Award),
      kpi("Coaching", "3", "", "warning", GraduationCap), kpi("Reviews due", "2", "", "warning", ClipboardList)],
    headers: ["Leader", "Function", "Score", "Trend"],
    data: [["A. Rao", "Sales", "92", "Up"], ["M. Iyer", "Ops", "84", "Flat"], ["S. Khan", "Product", "78", "Down"]],
  },
  {
    id: "growth", label: "Growth Model", icon: BarChart3, eyebrow: "Planning", title: "Growth Model",
    description: "Scenario planning across pricing, headcount and market expansion.",
    kpis: [kpi("Scenarios", "5", "", "default", Layers), kpi("Base ARR 12m", "$21M", "", "premium", DollarSign),
      kpi("Burn multiple", "1.2x", "", "success", Percent), kpi("Runway", "34m", "", "success", Gauge)],
    headers: ["Scenario", "ARR 12m", "Headcount", "Runway"],
    data: [["Base", "$21M", "180", "34m"], ["Aggressive", "$28M", "240", "22m"], ["Conservative", "$17M", "150", "46m"]],
  },
]);

const VALA_AI = mgr("vala-ai", "Vala AI", Bot,
  "AI assistants, prompts, guardrails, evaluations and model routing.", [
  {
    id: "assistants", label: "Assistants", icon: Bot, eyebrow: "AI", title: "Assistant Registry",
    description: "Every deployed assistant with surface, model route and guardrail set.",
    kpis: [kpi("Assistants", "14", "", "default", Bot), kpi("Live", "11", "", "success", CheckCircle2),
      kpi("Draft", "3", "", "warning", ClipboardList), kpi("Guardrails", "100%", "", "premium", ShieldCheck)],
    headers: ["Assistant", "Surface", "Model route", "State"],
    data: [["Vala Concierge", "Login", "Balanced", "Live"], ["Marketplace Helper", "Marketplace", "Fast", "Live"],
      ["Boss Copilot", "Command Center", "Deep", "Live"], ["Legal Reader", "Legal", "Deep", "Draft"]],
    action: "New assistant",
  },
  {
    id: "prompts", label: "Prompt Library", icon: MessageSquare, eyebrow: "Content", title: "Prompt Library",
    description: "Versioned system prompts with owners, diffs and rollback.",
    kpis: [kpi("Prompts", "86", "", "default", MessageSquare), kpi("Versions", "412", "", "default", Layers),
      kpi("Pending review", "5", "", "warning", ClipboardList), kpi("Rolled back 30d", "2", "", "warning", Activity)],
    headers: ["Prompt", "Assistant", "Version", "Owner"],
    data: [["concierge.system", "Vala Concierge", "v18", "AI"], ["boss.copilot.system", "Boss Copilot", "v9", "AI"],
      ["seo.rewrite", "SEO", "v22", "Marketing"]],
    action: "New prompt",
  },
  {
    id: "guardrails", label: "Guardrails", icon: ShieldCheck, eyebrow: "Safety", title: "Guardrails",
    description: "PII redaction, refusal policies, tool allow-lists and output filters.",
    kpis: [kpi("Rules", "38", "", "default", ShieldCheck), kpi("Blocks 24h", "126", "", "warning", ShieldAlert),
      kpi("False positives", "3", "", "warning", AlertTriangle), kpi("Coverage", "100%", "", "success", CheckCircle2)],
    headers: ["Rule", "Type", "Scope", "State"],
    data: [["Mask emails", "Redaction", "All", "Enforced"], ["No payment actions", "Refusal", "Demo", "Enforced"],
      ["Tool allow-list", "Access", "Boss Copilot", "Enforced"]],
  },
  {
    id: "evals", label: "Evaluations", icon: Radar, eyebrow: "Quality", title: "Evaluations",
    description: "Golden sets, regression scoring and human review of AI output.",
    kpis: [kpi("Suites", "12", "", "default", Radar), kpi("Pass rate", "94%", "+2pt", "success", CheckCircle2),
      kpi("Regressions", "1", "", "warning", AlertTriangle), kpi("Human reviews", "84", "", "default", Users)],
    headers: ["Suite", "Cases", "Pass", "Last run"],
    data: [["Concierge tone", "120", "97%", "Today"], ["SEO factuality", "80", "91%", "Today"],
      ["Legal refusals", "60", "100%", "Yesterday"]],
  },
  {
    id: "usage", label: "Usage & Cost", icon: DollarSign, eyebrow: "Ops", title: "AI Usage & Cost",
    description: "Token consumption, latency and spend by assistant and route.",
    kpis: [kpi("Tokens 30d", "184M", "", "default", Database), kpi("Spend 30d", "$4,180", "-8%", "success", DollarSign),
      kpi("p95 latency", "1.9s", "", "default", Gauge), kpi("Cache hit", "38%", "+6pt", "success", Zap)],
    headers: ["Assistant", "Tokens", "Spend", "p95"],
    data: [["Boss Copilot", "64M", "$1,720", "2.4s"], ["Marketplace Helper", "58M", "$980", "1.2s"],
      ["Vala Concierge", "41M", "$720", "1.1s"]],
  },
]);

const PROMISE_TRACKER = mgr("promise-tracker", "Promise Tracker", Handshake,
  "Every commitment made to customers, partners and team — tracked to closure.", [
  {
    id: "open", label: "Open Promises", icon: Handshake, eyebrow: "Commitments", title: "Open Promises",
    description: "Live commitments with owner, due date and breach risk.",
    kpis: [kpi("Open", "48", "", "default", Handshake), kpi("Due this week", "14", "", "warning", Gauge),
      kpi("At risk", "6", "", "warning", AlertTriangle), kpi("Breached", "2", "", "destructive", ShieldAlert)],
    headers: ["Promise", "Made to", "Owner", "Due", "State"],
    data: [["SSO by Q3", "Northwind", "Dev", "12 Sep", "At risk"], ["Custom SLA 99.9%", "Acme", "Ops", "01 Sep", "On track"],
      ["Onboarding in 7d", "Kite Labs", "Support", "Overdue", "Breached"]],
    chips: ["All", "At risk", "Due 7d", "Breached"], action: "Log promise",
  },
  {
    id: "sla", label: "SLA Register", icon: Target, eyebrow: "Contracts", title: "SLA Register",
    description: "Contracted service levels, measured attainment and credits owed.",
    kpis: [kpi("SLAs", "62", "", "default", ScrollText), kpi("Attainment", "98.4%", "+0.3pt", "success", Target),
      kpi("Credits owed", "$2,400", "", "warning", DollarSign), kpi("Breaches 30d", "3", "", "warning", AlertTriangle)],
    headers: ["Customer", "Metric", "Target", "Actual"],
    data: [["Northwind", "Uptime", "99.9%", "99.96%"], ["Acme", "First response", "1h", "42m"],
      ["Orbit", "Resolution", "24h", "31h"]],
  },
  {
    id: "breaches", label: "Breaches", icon: ShieldAlert, eyebrow: "Risk", title: "Promise Breaches",
    description: "Broken commitments with root cause, remedy and customer comms.",
    kpis: [kpi("Breaches 90d", "7", "", "warning", ShieldAlert), kpi("Remedied", "5", "", "success", CheckCircle2),
      kpi("Credits issued", "$6,100", "", "warning", DollarSign), kpi("Repeat causes", "2", "", "warning", Radar)],
    headers: ["Promise", "Customer", "Cause", "Remedy"],
    data: [["Onboarding in 7d", "Kite Labs", "Staffing", "Dedicated CSM"], ["Reports by Fri", "Acme", "Data delay", "Credit + fix"]],
  },
  {
    id: "audit", label: "History", icon: ScrollText, eyebrow: "Record", title: "Promise History",
    description: "Complete history of made, kept and broken commitments.",
    kpis: [kpi("All time", "684", "", "default", ScrollText), kpi("Kept", "94%", "", "success", CheckCircle2),
      kpi("Avg cycle", "11d", "", "default", Gauge), kpi("Retention", "5y", "", "premium", Lock)],
    headers: ["Quarter", "Made", "Kept", "Broken"],
    data: [["Q2 2026", "148", "141", "7"], ["Q1 2026", "132", "126", "6"]],
  },
]);

const PRODUCT_MANAGER = mgr("product", "Product Manager", Boxes,
  "Roadmap, releases, feedback loops and product catalogue ownership.", [
  {
    id: "roadmap", label: "Roadmap", icon: Map, eyebrow: "Planning", title: "Product Roadmap",
    description: "Now / next / later with confidence, owner and dependency risk.",
    kpis: [kpi("Initiatives", "28", "", "default", Map), kpi("In flight", "9", "", "warning", Activity),
      kpi("Shipped QTD", "12", "", "success", CheckCircle2), kpi("Blocked", "2", "", "destructive", AlertTriangle)],
    headers: ["Initiative", "Horizon", "Owner", "Confidence", "State"],
    data: [["Marketplace payouts", "Now", "Payments", "High", "In flight"], ["SSO + SCIM", "Next", "Platform", "Medium", "Planned"],
      ["Offline mode", "Later", "Mobile", "Low", "Idea"]],
    chips: ["All", "Now", "Next", "Later", "Blocked"], action: "Add initiative",
  },
  {
    id: "releases", label: "Releases", icon: Rocket, eyebrow: "Delivery", title: "Releases",
    description: "Release trains, scope, gates and rollout status per environment.",
    kpis: [kpi("Next release", "v4.3", "5d", "default", Rocket), kpi("Scope items", "42", "", "default", ListChecks),
      kpi("Gates passed", "6/7", "", "warning", ShieldCheck), kpi("Rollback rate", "0%", "", "success", CheckCircle2)],
    headers: ["Release", "Scope", "Gate", "State"],
    data: [["v4.2.1", "Hotfix", "Passed", "Live"], ["v4.3.0", "42 items", "QA pending", "Staging"]],
    action: "Plan release",
  },
  {
    id: "feedback", label: "Feedback", icon: MessageSquare, eyebrow: "Voice", title: "Customer Feedback",
    description: "Requests and complaints clustered into themes with revenue weight.",
    kpis: [kpi("Items 30d", "412", "", "default", Inbox), kpi("Themes", "24", "", "default", Layers),
      kpi("Revenue weighted", "$1.4M", "", "premium", DollarSign), kpi("Closed loop", "68%", "+9pt", "success", CheckCircle2)],
    headers: ["Theme", "Requests", "Weight", "Status"],
    data: [["Bulk export", "48", "$320K", "Planned"], ["Granular roles", "36", "$280K", "In flight"],
      ["Mobile parity", "29", "$140K", "Backlog"]],
  },
  {
    id: "catalogue", label: "Catalogue", icon: Package, eyebrow: "Portfolio", title: "Product Catalogue",
    description: "SKUs, tiers, entitlements and lifecycle state for every product.",
    kpis: [kpi("Products", "34", "", "default", Package), kpi("Active SKUs", "96", "", "default", Layers),
      kpi("Deprecated", "6", "", "warning", AlertTriangle), kpi("Bundles", "8", "", "premium", Star)],
    headers: ["Product", "Tiers", "Entitlements", "Lifecycle"],
    data: [["Nexus OS", "4", "62", "GA"], ["Marketplace", "3", "38", "GA"], ["Legacy CRM", "1", "12", "Deprecated"]],
    action: "New product",
  },
]);

/* ============================ BATCH 2 =================================== */

const DEMO_MANAGER = mgr("demo", "Demo Manager", Video,
  "Demo environments, scripts, scheduling and prospect-facing sandboxes.", [
  {
    id: "environments", label: "Environments", icon: Server, eyebrow: "Sandbox", title: "Demo Environments",
    description: "Isolated demo tenants with seed data, reset schedule and expiry.",
    kpis: [kpi("Environments", "18", "", "default", Server), kpi("Active", "12", "", "success", Activity),
      kpi("Expiring 7d", "4", "", "warning", Gauge), kpi("Resets 24h", "9", "", "default", Zap)],
    headers: ["Environment", "Owner", "Seed set", "Expires", "State"],
    data: [["demo-enterprise", "Sales", "Enterprise", "12 Sep", "Active"], ["demo-retail", "Sales", "Retail", "02 Sep", "Active"],
      ["demo-partner", "Partnerships", "Partner", "Expired", "Idle"]],
    chips: ["All", "Active", "Expiring", "Idle"], action: "New environment",
  },
  {
    id: "scripts", label: "Demo Scripts", icon: FileText, eyebrow: "Enablement", title: "Demo Scripts",
    description: "Step-by-step narratives by persona, with talk tracks and objections.",
    kpis: [kpi("Scripts", "26", "", "default", FileText), kpi("Personas", "8", "", "default", Users),
      kpi("Win rate", "34%", "+5pt", "success", TrendingUp), kpi("Stale", "3", "", "warning", AlertTriangle)],
    headers: ["Script", "Persona", "Length", "Win rate"],
    data: [["Enterprise ops", "COO", "22m", "38%"], ["Retail growth", "Head of Ecom", "18m", "31%"],
      ["Partner overview", "Alliances", "12m", "29%"]],
    action: "New script",
  },
  {
    id: "schedule", label: "Schedule", icon: ClipboardList, eyebrow: "Calendar", title: "Demo Schedule",
    description: "Upcoming demos with prospect, presenter and environment binding.",
    kpis: [kpi("This week", "14", "", "default", ClipboardList), kpi("Confirmed", "11", "", "success", CheckCircle2),
      kpi("No-show rate", "9%", "-3pt", "success", Percent), kpi("Unassigned", "1", "", "warning", AlertTriangle)],
    headers: ["Prospect", "Presenter", "Environment", "When", "State"],
    data: [["Northwind", "A. Rao", "demo-enterprise", "Tue 11:00", "Confirmed"],
      ["Kite Labs", "S. Khan", "demo-retail", "Wed 15:30", "Confirmed"]],
    action: "Schedule demo",
  },
  {
    id: "feedback", label: "Outcomes", icon: BarChart3, eyebrow: "Results", title: "Demo Outcomes",
    description: "Post-demo scoring, objections captured and pipeline movement.",
    kpis: [kpi("Demos 30d", "62", "", "default", Video), kpi("Advanced", "28", "", "success", TrendingUp),
      kpi("Avg score", "4.3", "", "premium", Star), kpi("Top objection", "Pricing", "", "warning", AlertTriangle)],
    headers: ["Prospect", "Score", "Objection", "Outcome"],
    data: [["Northwind", "4.6", "Migration effort", "Advanced"], ["Orbit Media", "3.8", "Pricing", "Nurture"]],
  },
]);

const CUSTOMER_SUPPORT = mgr("customer-support", "Customer Support", LifeBuoy,
  "Tickets, queues, SLAs, CSAT and knowledge for the whole support org.", [
  {
    id: "queue", label: "Live Queue", icon: Inbox, eyebrow: "Frontline", title: "Live Ticket Queue",
    description: "Unassigned and in-progress tickets ordered by SLA burn.",
    kpis: [kpi("Open", "128", "", "default", Inbox), kpi("Unassigned", "14", "", "warning", AlertTriangle),
      kpi("Breaching 1h", "5", "", "destructive", ShieldAlert), kpi("Agents online", "18", "", "success", Users)],
    headers: ["Ticket", "Customer", "Priority", "SLA", "Agent"],
    data: [["#48210", "Northwind", "P1", "22m", "Unassigned"], ["#48198", "Acme", "P2", "3h", "S. Khan"],
      ["#48176", "Kite Labs", "P3", "1d", "R. Das"]],
    chips: ["All", "P1", "Unassigned", "Breaching"], action: "New ticket",
  },
  {
    id: "sla", label: "SLA Health", icon: Target, eyebrow: "Performance", title: "SLA Health",
    description: "First response and resolution attainment by priority and region.",
    kpis: [kpi("First response", "94%", "-2pt", "warning", Target), kpi("Resolution", "91%", "+1pt", "success", CheckCircle2),
      kpi("Breaches 7d", "12", "", "warning", AlertTriangle), kpi("Reopen rate", "6%", "", "default", Activity)],
    headers: ["Priority", "Target", "Attainment", "Breaches"],
    data: [["P1", "15m", "97%", "2"], ["P2", "1h", "93%", "5"], ["P3", "8h", "89%", "5"]],
  },
  {
    id: "csat", label: "CSAT & NPS", icon: Star, eyebrow: "Quality", title: "CSAT & NPS",
    description: "Satisfaction signals per agent, channel and product area.",
    kpis: [kpi("CSAT", "4.6", "+0.1", "success", Star), kpi("NPS", "48", "+3", "success", TrendingUp),
      kpi("Surveys 30d", "1,240", "", "default", ClipboardList), kpi("Detractors", "62", "", "warning", AlertTriangle)],
    headers: ["Agent", "Tickets", "CSAT", "Trend"],
    data: [["S. Khan", "182", "4.8", "Up"], ["R. Das", "164", "4.5", "Flat"], ["P. Nair", "148", "4.2", "Down"]],
  },
  {
    id: "knowledge", label: "Knowledge Base", icon: GraduationCap, eyebrow: "Deflection", title: "Knowledge Base",
    description: "Articles, coverage gaps and self-serve deflection performance.",
    kpis: [kpi("Articles", "486", "", "default", FileText), kpi("Deflection", "38%", "+4pt", "success", TrendingUp),
      kpi("Gaps", "12", "", "warning", AlertTriangle), kpi("Stale >180d", "24", "", "warning", ClipboardList)],
    headers: ["Article", "Views 30d", "Helpful", "State"],
    data: [["Reset your workspace", "4,120", "92%", "Fresh"], ["SSO setup", "2,860", "88%", "Fresh"],
      ["Legacy CRM import", "410", "61%", "Stale"]],
    action: "New article",
  },
  {
    id: "escalations", label: "Escalations", icon: AlertTriangle, eyebrow: "Risk", title: "Support Escalations",
    description: "Tickets escalated to engineering, leadership or the founder.",
    kpis: [kpi("Open", "9", "", "warning", AlertTriangle), kpi("To engineering", "5", "", "default", Code2),
      kpi("To founder", "1", "", "premium", Crown), kpi("Avg age", "14h", "", "default", Gauge)],
    headers: ["Ticket", "Customer", "Escalated to", "Age"],
    data: [["#48210", "Northwind", "Engineering", "3h"], ["#48042", "Acme", "Founder", "1d"]],
  },
]);

const INFLUENCER_DASHBOARD = mgr("influencer-dashboard", "Influencer Dashboard", Star,
  "Creator-facing view of campaigns, deliverables, payouts and performance.", [
  {
    id: "campaigns", label: "My Campaigns", icon: Megaphone, eyebrow: "Creator", title: "Assigned Campaigns",
    description: "Live campaigns with briefs, deadlines and approval status.",
    kpis: [kpi("Active", "6", "", "default", Megaphone), kpi("Due 7d", "3", "", "warning", Gauge),
      kpi("Approved", "18", "", "success", CheckCircle2), kpi("Earnings MTD", "$8,420", "", "premium", DollarSign)],
    headers: ["Campaign", "Brand", "Deliverable", "Due", "State"],
    data: [["Nexus launch", "Software Vala", "2 reels", "05 Sep", "In progress"],
      ["Marketplace push", "Software Vala", "1 video", "12 Sep", "Brief sent"]],
    chips: ["All", "In progress", "Awaiting approval", "Paid"], action: "Upload deliverable",
  },
  {
    id: "deliverables", label: "Deliverables", icon: Video, eyebrow: "Content", title: "Deliverables",
    description: "Uploads, review rounds and brand approval trail.",
    kpis: [kpi("Submitted", "24", "", "default", Video), kpi("Approved", "18", "", "success", CheckCircle2),
      kpi("Revisions", "4", "", "warning", ClipboardList), kpi("Avg review", "18h", "", "default", Gauge)],
    headers: ["Deliverable", "Campaign", "Round", "State"],
    data: [["Reel 01", "Nexus launch", "R2", "Approved"], ["Reel 02", "Nexus launch", "R1", "In review"]],
  },
  {
    id: "performance", label: "Performance", icon: BarChart3, eyebrow: "Results", title: "Content Performance",
    description: "Reach, engagement and attributed conversions per asset.",
    kpis: [kpi("Reach 30d", "1.8M", "+22%", "success", TrendingUp), kpi("Engagement", "6.4%", "+0.8pt", "success", Activity),
      kpi("Clicks", "42K", "", "default", Zap), kpi("Attributed signups", "1,240", "", "premium", Users)],
    headers: ["Asset", "Reach", "Engagement", "Signups"],
    data: [["Reel 01", "820K", "7.1%", "640"], ["Story set", "410K", "5.2%", "210"]],
  },
  {
    id: "payouts", label: "Payouts", icon: DollarSign, eyebrow: "Money", title: "Payouts",
    description: "Earnings, invoices, tax documents and payment status.",
    kpis: [kpi("Pending", "$3,200", "", "warning", DollarSign), kpi("Paid YTD", "$64,800", "", "success", CheckCircle2),
      kpi("Next payout", "05 Sep", "", "default", Gauge), kpi("Tax docs", "Complete", "", "success", ShieldCheck)],
    headers: ["Invoice", "Campaign", "Amount", "State"],
    data: [["INV-2091", "Nexus launch", "$3,200", "Pending"], ["INV-2044", "Summer push", "$4,600", "Paid"]],
  },
]);

const CONTINENT_ADMIN = mgr("continent-admin", "Continent Admin", Globe,
  "Regional oversight across countries, franchises, compliance and revenue.", [
  {
    id: "regions", label: "Regions", icon: Globe, eyebrow: "Geography", title: "Regional Overview",
    description: "Performance and health of every country under this continent.",
    kpis: [kpi("Countries", "14", "", "default", Globe), kpi("Revenue MTD", "$3.4M", "+11%", "success", DollarSign),
      kpi("At risk", "2", "", "warning", AlertTriangle), kpi("Compliance", "98%", "", "success", ShieldCheck)],
    headers: ["Country", "Revenue", "Partners", "Compliance", "State"],
    data: [["India", "$1.2M", "84", "100%", "Healthy"], ["UAE", "$620K", "22", "96%", "Healthy"],
      ["Singapore", "$480K", "18", "92%", "Watch"]],
    chips: ["All", "Healthy", "Watch", "Critical"], action: "Add country",
  },
  {
    id: "leadership", label: "Country Leads", icon: Users, eyebrow: "People", title: "Country Leadership",
    description: "Country admins, coverage gaps and performance scorecards.",
    kpis: [kpi("Leads", "14", "", "default", Users), kpi("Vacant", "1", "", "warning", AlertTriangle),
      kpi("Above target", "9", "", "success", Award), kpi("Reviews due", "3", "", "warning", ClipboardList)],
    headers: ["Country", "Lead", "Score", "State"],
    data: [["India", "V. Menon", "94", "Above target"], ["UAE", "H. Farouk", "88", "On target"],
      ["Vietnam", "—", "—", "Vacant"]],
  },
  {
    id: "compliance", label: "Compliance", icon: ShieldCheck, eyebrow: "Governance", title: "Regional Compliance",
    description: "Data residency, tax registration and local licensing per country.",
    kpis: [kpi("Obligations", "126", "", "default", ScrollText), kpi("Met", "124", "", "success", CheckCircle2),
      kpi("Overdue", "2", "", "destructive", AlertTriangle), kpi("Audits 90d", "3", "", "default", Radar)],
    headers: ["Country", "Obligation", "Due", "State"],
    data: [["Singapore", "PDPA review", "15 Sep", "Overdue"], ["India", "GST filing", "20 Sep", "On track"]],
  },
  {
    id: "escalations", label: "Escalations", icon: AlertTriangle, eyebrow: "Risk", title: "Regional Escalations",
    description: "Country-level issues escalated to continent leadership.",
    kpis: [kpi("Open", "5", "", "warning", AlertTriangle), kpi("Critical", "1", "", "destructive", ShieldAlert),
      kpi("Aged >7d", "1", "", "warning", Gauge), kpi("Closed 30d", "18", "", "success", CheckCircle2)],
    headers: ["Issue", "Country", "Severity", "Age"],
    data: [["Payment rail outage", "Singapore", "Critical", "2d"], ["Partner dispute", "UAE", "High", "5d"]],
  },
]);

const COUNTRY_ADMIN = mgr("country-admin", "Country Admin", Map,
  "Country-level operations, partners, local compliance and city coverage.", [
  {
    id: "overview", label: "Overview", icon: Gauge, eyebrow: "Country", title: "Country Overview",
    description: "Revenue, partners, coverage and health for this country.",
    kpis: [kpi("Revenue MTD", "$1.2M", "+14%", "success", DollarSign), kpi("Partners", "84", "+6", "success", Handshake),
      kpi("Cities live", "22", "", "default", Map), kpi("Health", "Healthy", "", "success", ShieldCheck)],
    headers: ["City", "Partners", "Revenue", "State"],
    data: [["Mumbai", "18", "$320K", "Live"], ["Bengaluru", "16", "$290K", "Live"],
      ["Jaipur", "4", "$48K", "Ramping"]],
    chips: ["All", "Live", "Ramping", "Planned"], action: "Add city",
  },
  {
    id: "partners", label: "Partners", icon: Handshake, eyebrow: "Network", title: "Country Partners",
    description: "Resellers, franchises and service partners operating locally.",
    kpis: [kpi("Partners", "84", "", "default", Handshake), kpi("Certified", "68", "", "success", Award),
      kpi("Onboarding", "9", "", "warning", ClipboardList), kpi("Churn 90d", "3", "", "warning", AlertTriangle)],
    headers: ["Partner", "Type", "City", "Tier", "State"],
    data: [["Vertex Systems", "Reseller", "Mumbai", "Gold", "Active"], ["Nexa Retail", "Franchise", "Pune", "Silver", "Active"],
      ["Lumen IT", "Service", "Delhi", "Bronze", "Onboarding"]],
    action: "Add partner",
  },
  {
    id: "compliance", label: "Local Compliance", icon: ShieldCheck, eyebrow: "Legal", title: "Local Compliance",
    description: "Tax, labour and data obligations specific to this country.",
    kpis: [kpi("Obligations", "38", "", "default", ScrollText), kpi("Met", "37", "", "success", CheckCircle2),
      kpi("Due 30d", "6", "", "warning", Gauge), kpi("Penalties", "$0", "", "success", DollarSign)],
    headers: ["Obligation", "Authority", "Due", "State"],
    data: [["GST filing", "GSTN", "20 Sep", "On track"], ["PF remittance", "EPFO", "15 Sep", "On track"]],
  },
  {
    id: "escalations", label: "Escalations", icon: AlertTriangle, eyebrow: "Risk", title: "Country Escalations",
    description: "Issues raised by cities and partners needing country decisions.",
    kpis: [kpi("Open", "7", "", "warning", AlertTriangle), kpi("Partner disputes", "2", "", "warning", Handshake),
      kpi("Aged >7d", "1", "", "warning", Gauge), kpi("Closed 30d", "24", "", "success", CheckCircle2)],
    headers: ["Issue", "City", "Raised by", "Age"],
    data: [["Territory overlap", "Pune", "Nexa Retail", "6d"], ["Pricing exception", "Delhi", "Lumen IT", "2d"]],
  },
]);

const FRANCHISE_OWNER = mgr("franchise-owner", "Franchise Owner", Building2,
  "Franchisee cockpit — territory, targets, royalties, staff and support.", [
  {
    id: "overview", label: "My Franchise", icon: Gauge, eyebrow: "Owner", title: "Franchise Overview",
    description: "Territory performance against plan with royalty and compliance status.",
    kpis: [kpi("Revenue MTD", "$142K", "+9%", "success", DollarSign), kpi("Target attainment", "104%", "", "success", Target),
      kpi("Royalty due", "$11.4K", "", "warning", Percent), kpi("Compliance", "Green", "", "success", ShieldCheck)],
    headers: ["Metric", "Plan", "Actual", "State"],
    data: [["Revenue", "$136K", "$142K", "Ahead"], ["New customers", "48", "52", "Ahead"],
      ["Churn", "3%", "4%", "Behind"]],
    action: "Log update",
  },
  {
    id: "targets", label: "Targets", icon: Target, eyebrow: "Plan", title: "Targets & Incentives",
    description: "Quarterly targets, tier thresholds and unlocked incentives.",
    kpis: [kpi("Quarter target", "$410K", "", "default", Target), kpi("Achieved", "$298K", "73%", "success", TrendingUp),
      kpi("Tier", "Gold", "", "premium", Award), kpi("Incentive earned", "$18K", "", "success", DollarSign)],
    headers: ["Period", "Target", "Achieved", "Incentive"],
    data: [["Jul", "$132K", "$138K", "$6K"], ["Aug", "$138K", "$142K", "$7K"], ["Sep", "$140K", "$18K", "—"]],
  },
  {
    id: "royalty", label: "Royalty & Billing", icon: DollarSign, eyebrow: "Money", title: "Royalty & Billing",
    description: "Royalty schedule, invoices, deductions and payment history.",
    kpis: [kpi("Rate", "8%", "", "default", Percent), kpi("Due", "$11.4K", "05 Sep", "warning", DollarSign),
      kpi("Paid YTD", "$96K", "", "success", CheckCircle2), kpi("Disputes", "0", "", "success", ShieldCheck)],
    headers: ["Invoice", "Period", "Amount", "State"],
    data: [["ROY-0891", "Aug", "$11.4K", "Due"], ["ROY-0862", "Jul", "$11.0K", "Paid"]],
  },
  {
    id: "staff", label: "Staff", icon: Users, eyebrow: "People", title: "Franchise Staff",
    description: "Local team, certification status and training completion.",
    kpis: [kpi("Staff", "24", "", "default", Users), kpi("Certified", "21", "", "success", Award),
      kpi("Training due", "3", "", "warning", GraduationCap), kpi("Open roles", "2", "", "warning", ClipboardList)],
    headers: ["Name", "Role", "Certification", "State"],
    data: [["A. Sharma", "Sales lead", "Gold", "Active"], ["N. Patil", "Support", "Silver", "Training due"]],
  },
  {
    id: "support", label: "Support", icon: LifeBuoy, eyebrow: "Help", title: "Franchise Support",
    description: "Requests raised to head office with SLA and resolution trail.",
    kpis: [kpi("Open", "4", "", "warning", Inbox), kpi("Avg response", "3h", "", "success", Gauge),
      kpi("Closed 30d", "22", "", "success", CheckCircle2), kpi("Satisfaction", "4.6", "", "premium", Star)],
    headers: ["Request", "Type", "Age", "State"],
    data: [["Marketing collateral", "Marketing", "1d", "In progress"], ["POS integration", "Technical", "4h", "Open"]],
    action: "Raise request",
  },
]);

/* ============================ BATCH 3 =================================== */

const DEVELOPER_DASHBOARD = mgr("developer-dashboard", "Developer Dashboard", Terminal,
  "Builds, deployments, code health, incidents and developer experience.", [
  {
    id: "builds", label: "Builds", icon: Terminal, eyebrow: "CI", title: "Build Pipeline",
    description: "Pipeline runs, durations, flaky tests and failure clustering.",
    kpis: [kpi("Runs 24h", "184", "", "default", Activity), kpi("Success", "96%", "+2pt", "success", CheckCircle2),
      kpi("Avg duration", "6m 12s", "-40s", "success", Gauge), kpi("Flaky tests", "4", "", "warning", AlertTriangle)],
    headers: ["Pipeline", "Branch", "Duration", "State"],
    data: [["web-app", "main", "5m 48s", "Passed"], ["api", "release/4.3", "7m 02s", "Passed"],
      ["mobile", "feat/offline", "9m 21s", "Failed"]],
    chips: ["All", "Failed", "main", "Release"], action: "Trigger build",
  },
  {
    id: "deploys", label: "Deployments", icon: Rocket, eyebrow: "CD", title: "Deployments",
    description: "Deploy history per environment with rollback and change lead time.",
    kpis: [kpi("Deploys 7d", "42", "", "default", Rocket), kpi("Lead time", "3h 40m", "-25m", "success", Gauge),
      kpi("Change failure", "2%", "", "success", Percent), kpi("Rollbacks", "1", "", "warning", AlertTriangle)],
    headers: ["Service", "Environment", "Version", "State"],
    data: [["web-app", "Production", "v4.2.1", "Healthy"], ["api", "Staging", "v4.3.0-rc2", "Healthy"]],
  },
  {
    id: "code", label: "Code Health", icon: Code2, eyebrow: "Quality", title: "Code Health",
    description: "Coverage, debt, review latency and dependency freshness.",
    kpis: [kpi("Coverage", "82%", "+3pt", "success", ShieldCheck), kpi("Open PRs", "26", "", "default", Layers),
      kpi("Review latency", "4h", "-1h", "success", Gauge), kpi("Outdated deps", "12", "", "warning", Package)],
    headers: ["Repo", "Coverage", "Open PRs", "Debt"],
    data: [["web-app", "84%", "12", "Low"], ["api", "88%", "9", "Low"], ["mobile", "71%", "5", "Medium"]],
  },
  {
    id: "incidents", label: "Incidents", icon: ShieldAlert, eyebrow: "Reliability", title: "Engineering Incidents",
    description: "Sev history, MTTR, postmortems and repeat-cause tracking.",
    kpis: [kpi("Open", "0", "", "success", CheckCircle2), kpi("Sev1 90d", "2", "", "warning", ShieldAlert),
      kpi("MTTR", "38m", "-12m", "success", Gauge), kpi("Postmortems", "100%", "", "success", FileText)],
    headers: ["Incident", "Severity", "Duration", "State"],
    data: [["EU webhook delay", "Sev2", "42m", "Resolved"], ["Auth token refresh", "Sev1", "28m", "Resolved"]],
  },
  {
    id: "dx", label: "Dev Experience", icon: Sparkles, eyebrow: "Team", title: "Developer Experience",
    description: "Local setup time, CI wait, tooling satisfaction and onboarding ramp.",
    kpis: [kpi("Setup time", "22m", "-8m", "success", Gauge), kpi("CI wait", "3m", "", "default", Activity),
      kpi("DX score", "4.2", "+0.3", "success", Star), kpi("Onboard ramp", "9d", "-2d", "success", GraduationCap)],
    headers: ["Signal", "Now", "Target", "Trend"],
    data: [["Setup time", "22m", "15m", "Improving"], ["CI wait", "3m", "2m", "Flat"]],
  },
]);

const AFFILIATE = mgr("affiliate", "Affiliate Management", Handshake,
  "Affiliates, referral links, attribution, commissions and payouts.", [
  {
    id: "affiliates", label: "Affiliates", icon: Users, eyebrow: "Network", title: "Affiliate Directory",
    description: "Every affiliate with tier, traffic quality and lifetime value.",
    kpis: [kpi("Affiliates", "312", "+18 MTD", "success", Users), kpi("Active 30d", "168", "", "default", Activity),
      kpi("Top tier", "24", "", "premium", Award), kpi("Suspended", "4", "", "destructive", ShieldAlert)],
    headers: ["Affiliate", "Tier", "Clicks 30d", "Conversions", "State"],
    data: [["growthstack.io", "Platinum", "48,200", "612", "Active"], ["saasradar", "Gold", "22,400", "284", "Active"],
      ["cheapdeals.net", "Bronze", "18,900", "12", "Suspended"]],
    chips: ["All", "Platinum", "Gold", "Suspended"], action: "Add affiliate",
  },
  {
    id: "links", label: "Links & Attribution", icon: Zap, eyebrow: "Tracking", title: "Links & Attribution",
    description: "Referral links, UTM hygiene, attribution windows and dedup rules.",
    kpis: [kpi("Live links", "1,240", "", "default", Zap), kpi("Attribution window", "45d", "", "default", Gauge),
      kpi("Dedup conflicts", "6", "", "warning", AlertTriangle), kpi("Invalid UTM", "18", "", "warning", ClipboardList)],
    headers: ["Link", "Affiliate", "Clicks", "State"],
    data: [["/r/gs-nexus", "growthstack.io", "18,400", "Healthy"], ["/r/sr-market", "saasradar", "9,120", "Healthy"]],
  },
  {
    id: "commissions", label: "Commissions", icon: Percent, eyebrow: "Money", title: "Commission Plans",
    description: "Rate cards, tier thresholds, clawbacks and plan assignments.",
    kpis: [kpi("Plans", "6", "", "default", Layers), kpi("Avg rate", "18%", "", "default", Percent),
      kpi("Clawbacks 30d", "$1,240", "", "warning", AlertTriangle), kpi("Accrued", "$84K", "", "premium", DollarSign)],
    headers: ["Plan", "Rate", "Threshold", "Affiliates"],
    data: [["Platinum", "25%", "$50K/qtr", "24"], ["Gold", "18%", "$15K/qtr", "62"], ["Bronze", "10%", "—", "226"]],
    action: "New plan",
  },
  {
    id: "payouts", label: "Payouts", icon: DollarSign, eyebrow: "Finance", title: "Affiliate Payouts",
    description: "Payout runs, holds, tax forms and dispute resolution.",
    kpis: [kpi("Due this cycle", "$46K", "", "warning", DollarSign), kpi("Paid YTD", "$620K", "", "success", CheckCircle2),
      kpi("On hold", "$4.2K", "", "warning", Lock), kpi("Disputes", "2", "", "warning", AlertTriangle)],
    headers: ["Affiliate", "Cycle", "Amount", "State"],
    data: [["growthstack.io", "Aug", "$18.4K", "Approved"], ["saasradar", "Aug", "$9.1K", "Pending"]],
  },
  {
    id: "fraud", label: "Fraud Watch", icon: Radar, eyebrow: "Integrity", title: "Fraud Watch",
    description: "Self-referral, cookie stuffing and coupon-abuse detection.",
    kpis: [kpi("Flags 30d", "34", "", "warning", Radar), kpi("Confirmed", "6", "", "destructive", ShieldAlert),
      kpi("Recovered", "$3.8K", "", "success", DollarSign), kpi("False positives", "12", "", "default", Activity)],
    headers: ["Signal", "Affiliate", "Severity", "State"],
    data: [["Cookie stuffing", "cheapdeals.net", "High", "Confirmed"], ["Self-referral", "unknown-42", "Medium", "Investigating"]],
  },
]);

const APPLICATION = mgr("application", "Application Management", Code2,
  "Applications, versions, environments, permissions and release governance.", [
  {
    id: "apps", label: "Applications", icon: Package, eyebrow: "Portfolio", title: "Application Registry",
    description: "Every internal and customer-facing application with owner and tier.",
    kpis: [kpi("Applications", "28", "", "default", Package), kpi("Tier-1", "6", "", "premium", Crown),
      kpi("Unowned", "1", "", "warning", AlertTriangle), kpi("Healthy", "27", "", "success", CheckCircle2)],
    headers: ["Application", "Owner", "Tier", "Version", "State"],
    data: [["Nexus Web", "Platform", "Tier-1", "v4.2.1", "Healthy"], ["Marketplace", "Commerce", "Tier-1", "v3.8.0", "Healthy"],
      ["Legacy CRM", "—", "Tier-3", "v1.9.4", "Deprecated"]],
    chips: ["All", "Tier-1", "Deprecated", "Unowned"], action: "Register app",
  },
  {
    id: "versions", label: "Versions", icon: Layers, eyebrow: "Lifecycle", title: "Versions & Support",
    description: "Supported versions, EOL dates and forced-upgrade windows.",
    kpis: [kpi("Supported", "42", "", "default", Layers), kpi("EOL 90d", "5", "", "warning", Gauge),
      kpi("Behind latest", "9", "", "warning", AlertTriangle), kpi("Auto-upgrade", "On", "", "success", Zap)],
    headers: ["Application", "Version", "EOL", "Tenants"],
    data: [["Nexus Web", "v4.1", "30 Sep", "42"], ["Marketplace", "v3.7", "15 Oct", "18"]],
  },
  {
    id: "permissions", label: "Permissions", icon: KeyRound, eyebrow: "Access", title: "Application Permissions",
    description: "Scopes, role bindings and least-privilege review status.",
    kpis: [kpi("Scopes", "148", "", "default", KeyRound), kpi("Over-privileged", "7", "", "warning", ShieldAlert),
      kpi("Reviewed 90d", "92%", "", "success", CheckCircle2), kpi("Boss-locked", "12", "", "premium", Lock)],
    headers: ["Scope", "Application", "Roles", "State"],
    data: [["billing.write", "Nexus Web", "Finance, Boss", "Locked"], ["catalog.publish", "Marketplace", "Commerce", "Active"]],
  },
  {
    id: "releases", label: "Release Governance", icon: ShieldCheck, eyebrow: "Control", title: "Release Governance",
    description: "Change windows, approvals, freeze periods and rollback policy.",
    kpis: [kpi("Pending approvals", "3", "", "warning", ClipboardList), kpi("Freeze active", "No", "", "success", CheckCircle2),
      kpi("Emergency 30d", "1", "", "warning", Zap), kpi("Policy breaches", "0", "", "success", ShieldCheck)],
    headers: ["Change", "Application", "Window", "State"],
    data: [["v4.3.0 rollout", "Nexus Web", "Fri 22:00", "Awaiting approval"], ["Index rebuild", "Marketplace", "Sat 02:00", "Approved"]],
    action: "Request change",
  },
  {
    id: "health", label: "Health", icon: Activity, eyebrow: "Runtime", title: "Application Health",
    description: "Error rates, saturation and dependency health per application.",
    kpis: [kpi("Error rate", "0.12%", "", "success", Activity), kpi("p95 latency", "420ms", "", "default", Gauge),
      kpi("Saturation", "58%", "", "default", HardDrive), kpi("Degraded", "0", "", "success", CheckCircle2)],
    headers: ["Application", "Errors", "p95", "State"],
    data: [["Nexus Web", "0.09%", "380ms", "Healthy"], ["Marketplace", "0.14%", "460ms", "Healthy"]],
  },
]);

const SUPPORT_MGMT = mgr("support", "Support Management", LifeBuoy,
  "Support organisation, staffing, routing rules, quality and cost to serve.", [
  {
    id: "operations", label: "Operations", icon: Gauge, eyebrow: "Command", title: "Support Operations",
    description: "Volume, staffing coverage and queue health across all channels.",
    kpis: [kpi("Volume 24h", "486", "+6%", "warning", Inbox), kpi("Coverage", "94%", "", "success", Users),
      kpi("Backlog", "128", "-14", "success", ClipboardList), kpi("Critical queues", "1", "", "warning", AlertTriangle)],
    headers: ["Channel", "Volume", "Backlog", "State"],
    data: [["Email", "212", "68", "Healthy"], ["Chat", "184", "22", "Healthy"], ["Phone", "90", "38", "Watch"]],
    chips: ["All", "Email", "Chat", "Phone"], action: "Adjust staffing",
  },
  {
    id: "routing", label: "Routing Rules", icon: Layers, eyebrow: "Automation", title: "Routing Rules",
    description: "Skill-based routing, priority overrides and escalation ladders.",
    kpis: [kpi("Rules", "42", "", "default", Layers), kpi("Auto-routed", "88%", "+4pt", "success", Zap),
      kpi("Misroutes", "24", "", "warning", AlertTriangle), kpi("Ladders", "6", "", "default", ListChecks)],
    headers: ["Rule", "Condition", "Target", "State"],
    data: [["Enterprise P1", "Plan = Enterprise", "Tier-3 pod", "Active"], ["Billing", "Topic = billing", "Finance pod", "Active"]],
    action: "New rule",
  },
  {
    id: "quality", label: "Quality Assurance", icon: Award, eyebrow: "Quality", title: "Quality Assurance",
    description: "Ticket audits, scorecards, coaching plans and calibration.",
    kpis: [kpi("Audits 30d", "180", "", "default", ClipboardList), kpi("Avg score", "88", "+2", "success", Award),
      kpi("Coaching plans", "6", "", "warning", GraduationCap), kpi("Calibration drift", "Low", "", "success", Radar)],
    headers: ["Agent", "Audits", "Score", "Action"],
    data: [["S. Khan", "12", "94", "None"], ["P. Nair", "10", "78", "Coaching"]],
  },
  {
    id: "cost", label: "Cost to Serve", icon: DollarSign, eyebrow: "Finance", title: "Cost to Serve",
    description: "Cost per ticket, deflection savings and headcount efficiency.",
    kpis: [kpi("Cost / ticket", "$4.80", "-$0.40", "success", DollarSign), kpi("Deflection saving", "$28K", "", "success", TrendingUp),
      kpi("Tickets / agent", "27", "+2", "success", Users), kpi("Overtime", "3%", "", "warning", Gauge)],
    headers: ["Pod", "Tickets", "Cost", "Efficiency"],
    data: [["Tier-1", "3,120", "$14.2K", "High"], ["Tier-3", "480", "$9.8K", "Medium"]],
  },
]);

const CONTENT = mgr("content", "Content Management", FileText,
  "Editorial calendar, assets, localisation, approvals and publishing.", [
  {
    id: "calendar", label: "Editorial Calendar", icon: ClipboardList, eyebrow: "Planning", title: "Editorial Calendar",
    description: "Planned content across channels with owners and publish dates.",
    kpis: [kpi("Scheduled", "48", "", "default", ClipboardList), kpi("Publishing 7d", "12", "", "warning", Gauge),
      kpi("Overdue", "3", "", "destructive", AlertTriangle), kpi("Channels", "8", "", "default", Megaphone)],
    headers: ["Title", "Channel", "Owner", "Publish", "State"],
    data: [["Nexus v4.3 launch post", "Blog", "Marketing", "05 Sep", "Draft"],
      ["Marketplace partner story", "Blog", "Content", "08 Sep", "In review"],
      ["Founder note", "Newsletter", "Boss", "Overdue", "Draft"]],
    chips: ["All", "Draft", "In review", "Scheduled", "Published"], action: "New content",
  },
  {
    id: "library", label: "Asset Library", icon: Package, eyebrow: "Assets", title: "Asset Library",
    description: "Images, video, decks and brand assets with rights and expiry.",
    kpis: [kpi("Assets", "2,140", "", "default", Package), kpi("Rights expiring", "14", "", "warning", Gauge),
      kpi("Brand-approved", "96%", "", "success", ShieldCheck), kpi("Storage", "482 GB", "", "default", HardDrive)],
    headers: ["Asset", "Type", "Rights", "State"],
    data: [["hero-nexus-4k", "Image", "Perpetual", "Approved"], ["founder-interview", "Video", "Expires 12 Oct", "Approved"]],
    action: "Upload asset",
  },
  {
    id: "localisation", label: "Localisation", icon: Globe, eyebrow: "Reach", title: "Localisation",
    description: "Translation coverage, reviewer status and locale-specific gaps.",
    kpis: [kpi("Locales", "12", "", "default", Globe), kpi("Coverage", "78%", "+6pt", "success", TrendingUp),
      kpi("Awaiting review", "22", "", "warning", ClipboardList), kpi("Machine-only", "9%", "", "warning", Bot)],
    headers: ["Locale", "Coverage", "Reviewer", "State"],
    data: [["Hindi", "92%", "V. Menon", "Healthy"], ["Arabic", "74%", "H. Farouk", "Watch"], ["Vietnamese", "38%", "—", "Gap"]],
  },
  {
    id: "approvals", label: "Approvals", icon: CheckCircle2, eyebrow: "Governance", title: "Content Approvals",
    description: "Legal, brand and founder sign-off queues before publishing.",
    kpis: [kpi("Pending", "11", "", "warning", ClipboardList), kpi("Founder queue", "2", "", "premium", Crown),
      kpi("Avg approval", "9h", "", "default", Gauge), kpi("Rejected 30d", "4", "", "warning", AlertTriangle)],
    headers: ["Item", "Stage", "Approver", "Age"],
    data: [["Nexus v4.3 launch post", "Brand", "Marketing", "6h"], ["Founder note", "Founder", "Boss", "1d"]],
  },
  {
    id: "performance", label: "Performance", icon: BarChart3, eyebrow: "Results", title: "Content Performance",
    description: "Traffic, engagement and pipeline influence per published piece.",
    kpis: [kpi("Sessions 30d", "184K", "+12%", "success", TrendingUp), kpi("Avg time", "3m 20s", "", "default", Gauge),
      kpi("Influenced pipeline", "$820K", "", "premium", DollarSign), kpi("Top channel", "Blog", "", "default", Megaphone)],
    headers: ["Content", "Sessions", "Engagement", "Pipeline"],
    data: [["Marketplace guide", "42K", "High", "$320K"], ["Nexus v4.2 launch", "31K", "High", "$240K"]],
  },
]);

/* ------------------------------ exports ---------------------------------- */

export const EXTRA_MANAGER_CONFIGS: Record<string, ManagerConfig> = {
  "control-panel": CONTROL_PANEL,
  "super-admin": SUPER_ADMIN,
  "boss-dashboard": BOSS_DASHBOARD,
  "ceo-dashboard": CEO_DASHBOARD,
  "vala-ai": VALA_AI,
  "promise-tracker": PROMISE_TRACKER,
  product: PRODUCT_MANAGER,
  demo: DEMO_MANAGER,
  "customer-support": CUSTOMER_SUPPORT,
  "influencer-dashboard": INFLUENCER_DASHBOARD,
  "continent-admin": CONTINENT_ADMIN,
  "country-admin": COUNTRY_ADMIN,
  "franchise-owner": FRANCHISE_OWNER,
  "developer-dashboard": DEVELOPER_DASHBOARD,
  affiliate: AFFILIATE,
  application: APPLICATION,
  support: SUPPORT_MGMT,
  content: CONTENT,
};

export const EXTRA_MANAGER_ORDER: string[] = [
  "control-panel", "super-admin", "boss-dashboard", "ceo-dashboard", "vala-ai",
  "promise-tracker", "product", "demo", "customer-support", "influencer-dashboard",
  "continent-admin", "country-admin", "franchise-owner", "developer-dashboard",
  "affiliate", "application", "support", "content",
];
