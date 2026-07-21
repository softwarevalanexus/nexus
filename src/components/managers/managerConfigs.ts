import {
  Users, UserCheck, UserPlus, Clock, FileText, ClipboardList, GraduationCap,
  Megaphone, Target, TrendingUp, Layers, ShieldCheck, Sparkles, BarChart3,
  Inbox, CheckCircle2, XCircle, AlertTriangle, Activity, Zap, Flame, Download,
  Gauge, Bell, Search, Globe, Link2, Wrench, DollarSign, Award, Star,
  Handshake, Building2, Map, Bot, KeyRound, Server, Database, HardDrive,
  Lock, Package, Code2, GitBranch, MessageSquare, ListChecks, LifeBuoy,
  Briefcase, Percent, PieChart, Radio, Terminal, ScrollText, Scale,
  BookOpen, Flag, ShieldAlert, TrendingDown, Waves, Radar,
  type LucideIcon,
} from "lucide-react";

export type Tone = "default" | "success" | "warning" | "premium" | "destructive";

export type KPI = { label: string; value: string; delta?: string; tone?: Tone; icon: LucideIcon };

export type TableCol = { key: string; label: string };
export type TableRow = Record<string, string>;

export type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  kpis: KPI[];
  columns: TableCol[];
  rows: TableRow[];
  chips?: string[];
  primaryAction?: string;
};

export type ManagerConfig = {
  id: string;
  label: string;
  icon: LucideIcon;
  tagline: string;
  sections: Section[];
};

/* --- helper builders keep configs concise --- */
const kpi = (label: string, value: string, delta?: string, tone: Tone = "default", icon: LucideIcon = Activity): KPI =>
  ({ label, value, delta, tone, icon });

const rows = (headers: string[], data: string[][]): { columns: TableCol[]; rows: TableRow[] } => ({
  columns: headers.map((h) => ({ key: h.toLowerCase().replace(/\s+/g, "_"), label: h })),
  rows: data.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h.toLowerCase().replace(/\s+/g, "_"), r[i] ?? "—"])),
  ),
});

/* ==================== HR MANAGER ==================== */
const HR: ManagerConfig = {
  id: "hr",
  label: "HR Manager",
  icon: Users,
  tagline: "Employees, hiring, onboarding, attendance & compliance in one control room.",
  sections: [
    {
      id: "employees", label: "Employees", icon: Users,
      eyebrow: "Workforce", title: "Employee Overview",
      description: "Every active, onboarding and on-leave employee across the org.",
      kpis: [
        kpi("Total", "248", "+12 MoM", "default", Users),
        kpi("Active", "213", "86%", "success", UserCheck),
        kpi("Onboarding", "9", "this week", "premium", UserPlus),
        kpi("On Leave", "16", "6.5%", "warning", Clock),
      ],
      chips: ["All", "Engineering", "Design", "Ops", "Finance", "Sales"],
      primaryAction: "Add Employee",
      ...rows(
        ["Vala ID", "Name", "Role", "Department", "Status", "Joined"],
        [
          ["EMP-1001", "Employee A", "Developer", "Engineering", "Active", "2024-01-15"],
          ["EMP-1002", "Employee B", "Designer", "Design", "Active", "2024-03-20"],
          ["EMP-1003", "Employee C", "Manager", "Operations", "On Leave", "2023-08-10"],
          ["EMP-1004", "Employee D", "Analyst", "Finance", "Onboarding", "2024-12-28"],
          ["EMP-1005", "Employee E", "Developer", "Engineering", "Active", "2024-06-05"],
        ],
      ),
    },
    {
      id: "hiring", label: "Hiring Pipeline", icon: Target,
      eyebrow: "Talent Acquisition", title: "Hiring Pipeline",
      description: "Requisitions, candidates and stage-wise conversion.",
      kpis: [
        kpi("Open Roles", "18", "+4", "default", Briefcase),
        kpi("In Interview", "42", "+9", "premium", Users),
        kpi("Offers Out", "7", "3 accepted", "success", Award),
        kpi("Drop-off", "12%", "-3pp", "warning", TrendingDown),
      ],
      primaryAction: "New Requisition",
      ...rows(
        ["Req ID", "Role", "Level", "Stage", "Candidates", "Owner"],
        [
          ["REQ-201", "Sr. Backend Engineer", "L5", "Interview", "8", "TA-A"],
          ["REQ-202", "Product Designer", "L4", "Screening", "14", "TA-B"],
          ["REQ-203", "Data Analyst", "L3", "Offer", "3", "TA-C"],
          ["REQ-204", "Growth Lead", "L6", "Sourcing", "22", "TA-A"],
        ],
      ),
    },
    {
      id: "onboarding", label: "Onboarding", icon: UserPlus,
      eyebrow: "Day-0 to Day-30", title: "Onboarding Status",
      description: "Checklist completion, docs, buddy assignment.",
      kpis: [
        kpi("Onboarding", "9", "", "premium", UserPlus),
        kpi("Completed 30d", "24", "+6", "success", CheckCircle2),
        kpi("Docs Pending", "5", "review", "warning", FileText),
        kpi("Buddy Assigned", "100%", "", "default", Handshake),
      ],
      ...rows(
        ["Vala ID", "Name", "Start Date", "Checklist", "Docs", "Buddy"],
        [
          ["EMP-1004", "Employee D", "2024-12-28", "6/10", "3/5", "EMP-1002"],
          ["EMP-1101", "Employee F", "2025-01-06", "3/10", "2/5", "EMP-1005"],
          ["EMP-1102", "Employee G", "2025-01-08", "1/10", "0/5", "—"],
        ],
      ),
    },
    {
      id: "attendance", label: "Attendance", icon: Clock,
      eyebrow: "Time & Presence", title: "Attendance Summary",
      description: "Daily presence, leaves, WFH & anomalies.",
      kpis: [
        kpi("Present Today", "196", "92%", "success", CheckCircle2),
        kpi("WFH", "34", "16%", "default", Waves),
        kpi("On Leave", "16", "", "warning", Clock),
        kpi("Anomalies", "3", "geo mismatch", "destructive", AlertTriangle),
      ],
      ...rows(
        ["Vala ID", "Name", "Check-in", "Mode", "Hours", "Status"],
        [
          ["EMP-1001", "Employee A", "09:02", "Office", "8.4h", "Present"],
          ["EMP-1005", "Employee E", "09:31", "WFH", "7.8h", "Present"],
          ["EMP-1003", "Employee C", "—", "—", "0h", "On Leave"],
        ],
      ),
    },
    {
      id: "performance", label: "Performance", icon: BarChart3,
      eyebrow: "Growth & Review", title: "Performance Records",
      description: "Reviews, ratings, promotions & PIPs.",
      kpis: [
        kpi("Reviews Due", "34", "this cycle", "warning", ClipboardList),
        kpi("Completed", "112", "77%", "success", CheckCircle2),
        kpi("On PIP", "4", "", "destructive", AlertTriangle),
        kpi("Promotions", "9", "this quarter", "premium", Award),
      ],
      ...rows(
        ["Vala ID", "Name", "Cycle", "Rating", "Manager", "Status"],
        [
          ["EMP-1001", "Employee A", "H1'25", "Exceeds", "EMP-1003", "Complete"],
          ["EMP-1002", "Employee B", "H1'25", "Meets", "EMP-1003", "Complete"],
          ["EMP-1005", "Employee E", "H1'25", "—", "EMP-1003", "Pending"],
        ],
      ),
    },
    {
      id: "compliance", label: "Compliance", icon: ShieldCheck,
      eyebrow: "Policy & Documents", title: "Compliance Documents",
      description: "PAN, KYC, agreements, NDAs & policy acknowledgements.",
      kpis: [
        kpi("Coverage", "94%", "+2pp", "success", ShieldCheck),
        kpi("Missing Docs", "14", "chase list", "warning", FileText),
        kpi("Expiring 30d", "6", "renew", "premium", Clock),
        kpi("Breaches", "0", "", "success", CheckCircle2),
      ],
      ...rows(
        ["Vala ID", "Doc", "Status", "Expiry", "Owner"],
        [
          ["EMP-1004", "NDA", "Pending", "—", "HR-1"],
          ["EMP-1005", "PAN", "Verified", "—", "HR-1"],
          ["EMP-1001", "Contract", "Expiring", "2025-02-28", "HR-2"],
        ],
      ),
    },
    {
      id: "notes", label: "Internal Notes", icon: MessageSquare,
      eyebrow: "Private Log", title: "HR Internal Notes",
      description: "Confidential incident, feedback & escalation notes.",
      kpis: [
        kpi("Open", "8", "", "default", Inbox),
        kpi("Resolved 30d", "22", "+5", "success", CheckCircle2),
        kpi("Sensitive", "3", "founder-only", "destructive", Lock),
        kpi("Follow-ups", "5", "this week", "warning", Bell),
      ],
      ...rows(
        ["Note ID", "Subject", "Employee", "Severity", "Owner"],
        [
          ["NOTE-01", "Peer feedback", "EMP-1002", "Low", "HR-1"],
          ["NOTE-02", "Attendance chat", "EMP-1005", "Medium", "HR-1"],
          ["NOTE-03", "Escalation", "EMP-1003", "High", "HR-2"],
        ],
      ),
    },
  ],
};

/* ==================== FINANCE / PRO MANAGER ==================== */
const FINANCE: ManagerConfig = {
  id: "finance",
  label: "Finance Manager",
  icon: DollarSign,
  tagline: "Decisions, promises, SLA, quality alerts, health & audit — production-grade.",
  sections: [
    {
      id: "snapshot", label: "Snapshot", icon: Gauge,
      eyebrow: "Now", title: "Manager Snapshot",
      description: "Real-time posture of the finance operation.",
      kpis: [
        kpi("Revenue MTD", "$1.42M", "+8.2%", "success", DollarSign),
        kpi("Outstanding", "$218K", "23 invoices", "warning", FileText),
        kpi("Refund Queue", "6", "$8.4K", "premium", XCircle),
        kpi("Cash Runway", "22m", "", "default", TrendingUp),
      ],
      ...rows(
        ["Metric", "Value", "Δ", "Owner"],
        [
          ["Gross margin", "72.4%", "+1.1pp", "CFO"],
          ["AR days", "34", "-2", "AR-1"],
          ["Burn", "$248K/mo", "flat", "CFO"],
        ],
      ),
    },
    {
      id: "decisions", label: "Decisions Pending", icon: ClipboardList,
      eyebrow: "Founder Queue", title: "Decisions Pending",
      description: "Exceptions, extensions, overrides and financial waivers.",
      kpis: [
        kpi("Pending", "12", "3 critical", "destructive", Inbox),
        kpi("Financial", "5", "$32K", "premium", DollarSign),
        kpi("SLA Risk", "4", "<6h", "warning", Clock),
        kpi("Approved 7d", "28", "", "success", CheckCircle2),
      ],
      primaryAction: "Review Queue",
      ...rows(
        ["ID", "Type", "Subject", "Amount", "Priority", "Requested By"],
        [
          ["DEC-001", "Exception", "SLA waiver — Project Delta", "—", "High", "DM-3421"],
          ["DEC-002", "Extension", "48h scope extension", "—", "Medium", "TM-7823"],
          ["DEC-003", "Financial", "Penalty waiver", "$15,000", "High", "DM-3421"],
        ],
      ),
    },
    {
      id: "sla", label: "Promise / SLA", icon: Target,
      eyebrow: "Delivery Contracts", title: "Promise & SLA Board",
      description: "Live SLA status across every open commitment.",
      kpis: [
        kpi("On-Track", "142", "89%", "success", CheckCircle2),
        kpi("At Risk", "11", "<20% left", "warning", AlertTriangle),
        kpi("Breached", "3", "", "destructive", XCircle),
        kpi("Avg TTR", "6.4h", "-0.8h", "premium", Zap),
      ],
      ...rows(
        ["Promise", "Owner", "Due", "Progress", "State"],
        [
          ["Invoice batch #442", "AR-1", "Today 18:00", "82%", "On-Track"],
          ["Refund cycle", "AR-2", "Tomorrow", "40%", "At Risk"],
          ["Board pack", "CFO", "Overdue 4h", "95%", "Breached"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: AlertTriangle,
      eyebrow: "Cross-team", title: "Escalations Queue",
      description: "Unresolved items escalated to finance leadership.",
      kpis: [
        kpi("Open", "9", "", "warning", Inbox),
        kpi("Founder", "2", "waiting", "destructive", Bell),
        kpi("Resolved 7d", "17", "+4", "success", CheckCircle2),
        kpi("Avg Time", "12h", "-2h", "premium", Clock),
      ],
      ...rows(
        ["ID", "From", "Subject", "Age", "Severity"],
        [
          ["ESC-101", "Ops", "Vendor dispute", "3h", "High"],
          ["ESC-102", "Sales", "Discount override", "6h", "Medium"],
          ["ESC-103", "Legal", "Contract clause", "1d", "High"],
        ],
      ),
    },
    {
      id: "quality", label: "Quality Alerts", icon: Radar,
      eyebrow: "Anomaly Radar", title: "Quality Alerts",
      description: "Data quality, reconciliation and posting anomalies.",
      kpis: [
        kpi("Alerts", "7", "", "warning", AlertTriangle),
        kpi("Auto-Fixed", "42", "this week", "success", Zap),
        kpi("Manual", "3", "AR/AP", "premium", Wrench),
        kpi("MTTA", "18m", "-4m", "default", Clock),
      ],
      ...rows(
        ["Alert", "Source", "Impact", "Owner"],
        [
          ["Ledger drift", "GL-9", "$2,140", "AR-1"],
          ["Duplicate posting", "AP-4", "$720", "AP-2"],
          ["FX rate mismatch", "GL-3", "$0", "Auto"],
        ],
      ),
    },
    {
      id: "health", label: "System Health", icon: Activity,
      eyebrow: "Runtime", title: "Finance System Health",
      description: "Integrations, jobs & data freshness.",
      kpis: [
        kpi("Uptime 30d", "99.98%", "", "success", ShieldCheck),
        kpi("Failed Jobs", "1", "GL sync", "warning", XCircle),
        kpi("Data Lag", "42s", "healthy", "default", Waves),
        kpi("APIs", "12/12", "green", "success", Radio),
      ],
      ...rows(
        ["Service", "State", "Latency", "Last Run"],
        [
          ["GL sync", "Warn", "8.2s", "12m ago"],
          ["Payments", "Green", "180ms", "now"],
          ["Bank feed", "Green", "1.1s", "3m ago"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Immutable action log & regulatory reports.",
      kpis: [
        kpi("Actions 24h", "1,284", "", "default", Activity),
        kpi("Reports Ready", "9", "download", "success", FileText),
        kpi("Findings", "2", "review", "warning", AlertTriangle),
        kpi("Retention", "7y", "policy", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "Generated", "State"],
        [
          ["P&L", "Dec 2024", "1h ago", "Ready"],
          ["Cash flow", "Q4 2024", "3h ago", "Ready"],
          ["Audit trail", "Nov 2024", "yesterday", "Ready"],
        ],
      ),
    },
  ],
};

/* ==================== MARKETING MANAGER ==================== */
const MARKETING: ManagerConfig = {
  id: "marketing",
  label: "Marketing Manager",
  icon: Megaphone,
  tagline: "Campaigns, content queue, channels, AI optimization & compliance.",
  sections: [
    {
      id: "active", label: "Active Campaigns", icon: Megaphone,
      eyebrow: "Live", title: "Active Campaigns",
      description: "Every campaign in-flight across channels.",
      kpis: [
        kpi("Active", "18", "+3", "success", Megaphone),
        kpi("MQLs MTD", "1,284", "+22%", "premium", Target),
        kpi("Spend MTD", "$68K", "68% budget", "warning", DollarSign),
        kpi("Blended CTR", "2.7%", "+0.3pp", "default", TrendingUp),
      ],
      primaryAction: "New Campaign",
      ...rows(
        ["ID", "Name", "Objective", "Channel", "Status", "Leads"],
        [
          ["camp-001", "Q1 Lead Generation", "Lead", "Google Ads", "Active", "324"],
          ["camp-002", "Brand Awareness", "Brand", "Meta", "Active", "89"],
          ["camp-003", "Demo Request", "Demo", "Email", "Pending", "0"],
        ],
      ),
    },
    {
      id: "creator", label: "Campaign Creator", icon: Sparkles,
      eyebrow: "Composer", title: "Campaign Creator",
      description: "Draft, brief and launch a new campaign with AI assistance.",
      kpis: [
        kpi("Drafts", "6", "", "default", FileText),
        kpi("Pending Approval", "3", "", "warning", ClipboardList),
        kpi("AI Suggestions", "12", "apply", "premium", Sparkles),
        kpi("Templates", "24", "", "default", Layers),
      ],
      primaryAction: "Start Draft",
      ...rows(
        ["Draft", "Owner", "Channel", "Stage"],
        [
          ["Autumn push", "MKT-1", "Email", "Copy"],
          ["Founder AMA", "MKT-2", "LinkedIn", "Creative"],
          ["Partner spotlight", "MKT-1", "Blog", "Approval"],
        ],
      ),
    },
    {
      id: "performance", label: "Performance", icon: BarChart3,
      eyebrow: "Analytics", title: "Campaign Performance",
      description: "Attribution, ROAS and channel comparison.",
      kpis: [
        kpi("ROAS", "3.8x", "+0.4", "success", TrendingUp),
        kpi("CAC", "$142", "-8%", "premium", DollarSign),
        kpi("Impressions", "4.2M", "", "default", Radio),
        kpi("Conversions", "1,842", "+18%", "success", Target),
      ],
      ...rows(
        ["Campaign", "Spend", "Leads", "CPL", "ROAS"],
        [
          ["Q1 Lead Gen", "$18K", "324", "$56", "4.1x"],
          ["Brand Social", "$14K", "89", "$157", "2.2x"],
          ["Demo Email", "$4K", "142", "$28", "5.8x"],
        ],
      ),
    },
    {
      id: "channels", label: "Channels", icon: PieChart,
      eyebrow: "Mix", title: "Channel Breakdown",
      description: "Spend and outcomes per channel.",
      kpis: [
        kpi("Google", "38%", "share", "default", Search),
        kpi("Meta", "24%", "", "default", Globe),
        kpi("LinkedIn", "18%", "", "default", Users),
        kpi("Email", "20%", "top ROAS", "premium", MessageSquare),
      ],
      ...rows(
        ["Channel", "Spend", "MQLs", "Share"],
        [
          ["Google Ads", "$26K", "512", "38%"],
          ["Meta", "$16K", "218", "24%"],
          ["LinkedIn", "$12K", "184", "18%"],
          ["Email", "$4K", "370", "20%"],
        ],
      ),
    },
    {
      id: "content", label: "Content Queue", icon: FileText,
      eyebrow: "Editorial", title: "Content Queue",
      description: "Blog, social, email and creative pipeline.",
      kpis: [
        kpi("Scheduled", "24", "next 14d", "success", ClipboardList),
        kpi("In Review", "8", "", "warning", FileText),
        kpi("Blocked", "2", "creative", "destructive", XCircle),
        kpi("Published 7d", "18", "", "premium", CheckCircle2),
      ],
      ...rows(
        ["Piece", "Type", "Channel", "Status", "Owner"],
        [
          ["Q1 launch post", "Blog", "Blog", "In Review", "MKT-1"],
          ["AI feature reel", "Video", "LinkedIn", "Scheduled", "MKT-2"],
          ["Newsletter #42", "Email", "Email", "Draft", "MKT-3"],
        ],
      ),
    },
    {
      id: "ai", label: "AI Optimization", icon: Sparkles,
      eyebrow: "Auto-Tune", title: "AI Optimization",
      description: "Bid, audience & creative optimization proposals.",
      kpis: [
        kpi("Proposals", "14", "review", "premium", Sparkles),
        kpi("Applied 7d", "22", "+9% ROAS", "success", TrendingUp),
        kpi("Blocked", "1", "policy", "warning", ShieldAlert),
        kpi("Est. Savings", "$4.8K", "MTD", "premium", DollarSign),
      ],
      ...rows(
        ["Proposal", "Campaign", "Δ ROAS", "Confidence"],
        [
          ["Pause dead creatives", "Q1 Lead", "+0.6x", "High"],
          ["Shift 12% to LinkedIn", "Brand", "+0.3x", "Medium"],
          ["Widen audience", "Demo", "+0.4x", "High"],
        ],
      ),
    },
    {
      id: "compliance", label: "Compliance", icon: ShieldCheck,
      eyebrow: "Brand & Legal", title: "Compliance Status",
      description: "Brand safety, disclosure and channel policy.",
      kpis: [
        kpi("Coverage", "97%", "+1pp", "success", ShieldCheck),
        kpi("Violations", "1", "meta ad", "warning", ShieldAlert),
        kpi("Reviews Due", "4", "", "default", ClipboardList),
        kpi("Approved 7d", "36", "", "success", CheckCircle2),
      ],
      ...rows(
        ["Asset", "Channel", "Rule", "State"],
        [
          ["Q1 hero ad", "Meta", "Disclosure", "Flagged"],
          ["Newsletter #41", "Email", "CAN-SPAM", "Passed"],
          ["Blog post 88", "Blog", "Claims", "Reviewing"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Attribution reports & marketing audit trail.",
      kpis: [
        kpi("Reports", "12", "ready", "success", FileText),
        kpi("Actions 24h", "482", "", "default", Activity),
        kpi("Findings", "0", "clean", "success", CheckCircle2),
        kpi("Retention", "3y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [
          ["Attribution", "Dec 2024", "Ready"],
          ["Spend audit", "Q4 2024", "Ready"],
          ["Brand safety", "Q4 2024", "Ready"],
        ],
      ),
    },
  ],
};

/* ==================== LEAD MANAGER ==================== */
const LEAD: ManagerConfig = {
  id: "lead",
  label: "Lead Manager",
  icon: Target,
  tagline: "Every lead from source to close — pipeline, quality, escalations.",
  sections: [
    {
      id: "dashboard", label: "Dashboard", icon: Gauge,
      eyebrow: "Overview", title: "Lead Dashboard",
      description: "Volume, quality and velocity at a glance.",
      kpis: [
        kpi("New Today", "148", "+22", "success", UserPlus),
        kpi("Qualified", "62", "42%", "premium", CheckCircle2),
        kpi("In Pipeline", "486", "", "default", Layers),
        kpi("Won 7d", "18", "$142K", "success", DollarSign),
      ],
      ...rows(
        ["Metric", "Today", "7d", "30d"],
        [
          ["New", "148", "912", "3,842"],
          ["Qualified", "62", "384", "1,608"],
          ["Won", "3", "18", "82"],
        ],
      ),
    },
    {
      id: "all", label: "All Leads", icon: Users,
      eyebrow: "Master List", title: "All Leads",
      description: "Every lead across every source.",
      kpis: [
        kpi("Total", "3,842", "", "default", Users),
        kpi("Hot", "218", "+18", "destructive", Flame),
        kpi("Warm", "612", "", "warning", Waves),
        kpi("Cold", "3,012", "", "default", Waves),
      ],
      primaryAction: "Add Lead",
      ...rows(
        ["ID", "Name", "Source", "Score", "Stage", "Owner"],
        [
          ["LD-9001", "Lead A", "Google", "92", "Qualified", "SDR-1"],
          ["LD-9002", "Lead B", "Referral", "78", "Contacted", "SDR-2"],
          ["LD-9003", "Lead C", "LinkedIn", "64", "New", "—"],
        ],
      ),
    },
    {
      id: "new", label: "New Queue", icon: Inbox,
      eyebrow: "Untouched", title: "New Leads Queue",
      description: "Leads waiting on first response.",
      kpis: [
        kpi("Queued", "42", "", "warning", Inbox),
        kpi("Aged >2h", "8", "", "destructive", Clock),
        kpi("SLA On-Track", "88%", "+3pp", "success", ShieldCheck),
        kpi("Avg Response", "34m", "-6m", "premium", Zap),
      ],
      ...rows(
        ["ID", "Source", "Received", "Score", "Auto-Assign"],
        [
          ["LD-9101", "Google", "3m ago", "72", "SDR-1"],
          ["LD-9102", "Referral", "18m ago", "88", "SDR-2"],
          ["LD-9103", "Cold Email", "1h ago", "40", "SDR-3"],
        ],
      ),
    },
    {
      id: "qualified", label: "Qualified", icon: CheckCircle2,
      eyebrow: "MQL / SQL", title: "Qualified Leads",
      description: "Passes ICP, budget and intent thresholds.",
      kpis: [
        kpi("MQL", "218", "+34", "premium", Target),
        kpi("SQL", "84", "+12", "success", CheckCircle2),
        kpi("Handoff Rate", "78%", "+5pp", "default", TrendingUp),
        kpi("Conversion", "22%", "+2pp", "success", Percent),
      ],
      ...rows(
        ["ID", "Company", "MRR est.", "Owner", "Stage"],
        [
          ["LD-9001", "Acme Corp", "$4.2K", "AE-1", "Demo"],
          ["LD-9004", "Northwind", "$8.8K", "AE-2", "Proposal"],
          ["LD-9008", "Contoso", "$1.6K", "AE-1", "Discovery"],
        ],
      ),
    },
    {
      id: "pipeline", label: "Pipeline", icon: Layers,
      eyebrow: "Stages", title: "Sales Pipeline",
      description: "Value distribution across stages.",
      kpis: [
        kpi("Pipeline", "$4.8M", "+$420K", "premium", DollarSign),
        kpi("Weighted", "$1.9M", "40%", "default", PieChart),
        kpi("Slippage", "$182K", "review", "warning", TrendingDown),
        kpi("Close 30d", "$860K", "forecast", "success", Target),
      ],
      ...rows(
        ["Stage", "Deals", "Value", "Weight"],
        [
          ["Discovery", "82", "$1.2M", "20%"],
          ["Demo", "48", "$1.4M", "40%"],
          ["Proposal", "26", "$1.6M", "60%"],
          ["Close", "12", "$0.6M", "90%"],
        ],
      ),
    },
    {
      id: "funnel", label: "Conversion", icon: PieChart,
      eyebrow: "Ratio", title: "Conversion Funnel",
      description: "Volume and drop-off between stages.",
      kpis: [
        kpi("Lead→MQL", "24%", "+1pp", "premium", Percent),
        kpi("MQL→SQL", "38%", "-2pp", "warning", Percent),
        kpi("SQL→Won", "22%", "+3pp", "success", Percent),
        kpi("Cycle", "42d", "-4d", "default", Clock),
      ],
      ...rows(
        ["Stage", "In", "Out", "Rate"],
        [
          ["Lead", "3,842", "918", "24%"],
          ["MQL", "918", "348", "38%"],
          ["SQL", "348", "76", "22%"],
        ],
      ),
    },
    {
      id: "sources", label: "Source Breakdown", icon: Radio,
      eyebrow: "Attribution", title: "Source Breakdown",
      description: "Where leads come from and which convert.",
      kpis: [
        kpi("Top Source", "Google", "42%", "default", Search),
        kpi("Best CVR", "Referral", "38%", "success", Star),
        kpi("Lowest CAC", "SEO", "$28", "premium", DollarSign),
        kpi("Paid Share", "58%", "", "default", DollarSign),
      ],
      ...rows(
        ["Source", "Leads", "CVR", "CAC"],
        [
          ["Google", "1,612", "22%", "$142"],
          ["Referral", "412", "38%", "$0"],
          ["LinkedIn", "684", "18%", "$188"],
          ["SEO", "812", "24%", "$28"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: AlertTriangle,
      eyebrow: "Follow-ups", title: "Escalations & Follow-ups",
      description: "Overdue, at-risk and stuck leads.",
      kpis: [
        kpi("Overdue", "18", "", "destructive", AlertTriangle),
        kpi("At Risk", "42", "<24h", "warning", Clock),
        kpi("Escalated", "6", "founder", "premium", Bell),
        kpi("Resolved 7d", "34", "+9", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Company", "Age", "Owner", "Severity"],
        [
          ["LD-8801", "Acme Corp", "3d", "AE-1", "High"],
          ["LD-8842", "Contoso", "2d", "AE-2", "Medium"],
        ],
      ),
    },
    {
      id: "quality", label: "AI Quality", icon: Sparkles,
      eyebrow: "AI Alerts", title: "AI Quality Alerts",
      description: "Suspicious, duplicate or low-quality leads.",
      kpis: [
        kpi("Flagged", "24", "review", "warning", ShieldAlert),
        kpi("Duplicates", "8", "auto-merge", "premium", Layers),
        kpi("Spam", "42", "blocked", "destructive", XCircle),
        kpi("Accuracy", "96%", "AI", "success", Sparkles),
      ],
      ...rows(
        ["ID", "Reason", "Score", "Suggested"],
        [
          ["LD-9102", "Duplicate", "94%", "Merge → LD-9088"],
          ["LD-9114", "Disposable email", "88%", "Reject"],
          ["LD-9121", "Low intent", "62%", "Nurture"],
        ],
      ),
    },
    {
      id: "spam", label: "Spam / Rejected", icon: XCircle,
      eyebrow: "Cleaning", title: "Spam & Rejected",
      description: "Cleaned pipeline — rejected leads log.",
      kpis: [
        kpi("Rejected 30d", "412", "-8%", "success", XCircle),
        kpi("Spam Rate", "9.4%", "-1.2pp", "premium", ShieldCheck),
        kpi("Appealed", "6", "review", "warning", Inbox),
        kpi("Restored", "2", "false-positive", "default", CheckCircle2),
      ],
      ...rows(
        ["ID", "Reason", "Source", "When"],
        [
          ["LD-8710", "Test lead", "Form", "3h ago"],
          ["LD-8712", "Bot", "Google", "5h ago"],
          ["LD-8720", "Spam", "Email", "1d ago"],
        ],
      ),
    },
  ],
};

/* ==================== SALES SUPPORT MANAGER ==================== */
const SALES_SUPPORT: ManagerConfig = {
  id: "sales-support",
  label: "Sales Support Manager",
  icon: LifeBuoy,
  tagline: "Assigned leads, pipeline hand-off, tickets, SLA & team performance.",
  sections: [
    {
      id: "assigned", label: "Assigned Leads", icon: Users,
      eyebrow: "My Queue", title: "Assigned Leads",
      description: "Leads currently owned by sales support.",
      kpis: [
        kpi("Assigned", "82", "+6", "default", Users),
        kpi("Working", "34", "", "premium", Activity),
        kpi("Idle >24h", "8", "", "warning", Clock),
        kpi("Closed 7d", "22", "", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Name", "Stage", "Age", "Owner"],
        [
          ["LD-9201", "Lead X", "Contacted", "2h", "SS-1"],
          ["LD-9202", "Lead Y", "Working", "1d", "SS-2"],
          ["LD-9203", "Lead Z", "Idle", "3d", "SS-1"],
        ],
      ),
    },
    {
      id: "pipeline", label: "Pipeline", icon: Layers,
      eyebrow: "Stages", title: "Support Sales Pipeline",
      description: "Deals owned or co-owned by support.",
      kpis: [
        kpi("Value", "$680K", "+$42K", "premium", DollarSign),
        kpi("Deals", "42", "", "default", Layers),
        kpi("Close 30d", "$142K", "", "success", Target),
        kpi("Slippage", "$18K", "", "warning", TrendingDown),
      ],
      ...rows(
        ["Deal", "Stage", "Value", "Owner"],
        [
          ["Renewal — Acme", "Proposal", "$88K", "SS-1"],
          ["Upsell — Contoso", "Demo", "$42K", "SS-2"],
        ],
      ),
    },
    {
      id: "tickets", label: "Tickets", icon: LifeBuoy,
      eyebrow: "Support", title: "Support Tickets",
      description: "Open, in-progress and escalated tickets.",
      kpis: [
        kpi("Open", "128", "+12", "warning", Inbox),
        kpi("First-Response", "12m", "-3m", "success", Zap),
        kpi("Escalated", "6", "", "destructive", Bell),
        kpi("CSAT 7d", "4.6", "+0.2", "premium", Star),
      ],
      primaryAction: "New Ticket",
      ...rows(
        ["ID", "Subject", "Priority", "Age", "Owner"],
        [
          ["TKT-8801", "Payment failure", "High", "12m", "SS-1"],
          ["TKT-8812", "Feature request", "Low", "3h", "SS-2"],
          ["TKT-8814", "Login issue", "High", "24m", "SS-3"],
        ],
      ),
    },
    {
      id: "sla", label: "SLA Alerts", icon: AlertTriangle,
      eyebrow: "Breach Risk", title: "SLA Alerts",
      description: "Live SLA countdowns and breaches.",
      kpis: [
        kpi("At Risk", "9", "<30m", "warning", AlertTriangle),
        kpi("Breached", "2", "", "destructive", XCircle),
        kpi("On-Track", "117", "91%", "success", CheckCircle2),
        kpi("MTTR", "42m", "-6m", "premium", Zap),
      ],
      ...rows(
        ["Ticket", "SLA", "Remaining", "State"],
        [
          ["TKT-8801", "4h", "12m", "At Risk"],
          ["TKT-8770", "1h", "-14m", "Breached"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: Bell,
      eyebrow: "Cross-team", title: "Escalations",
      description: "Escalations routed to leadership or engineering.",
      kpis: [
        kpi("Open", "6", "", "destructive", Bell),
        kpi("Founder", "1", "waiting", "premium", Crown()),
        kpi("Engineering", "3", "", "warning", Code2),
        kpi("Resolved 7d", "11", "+3", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Subject", "Owner", "Age"],
        [
          ["ESC-201", "Payments outage", "Eng-1", "1h"],
          ["ESC-202", "Enterprise churn risk", "Founder", "4h"],
        ],
      ),
    },
    {
      id: "team", label: "Team Performance", icon: Award,
      eyebrow: "People", title: "Team Performance",
      description: "Volume, quality and CSAT per agent.",
      kpis: [
        kpi("Agents", "12", "", "default", Users),
        kpi("Avg CSAT", "4.6", "+0.2", "success", Star),
        kpi("Top Agent", "SS-2", "128 solved", "premium", Award),
        kpi("Coaching", "3", "flagged", "warning", GraduationCap),
      ],
      ...rows(
        ["Agent", "Solved 7d", "CSAT", "AHT"],
        [
          ["SS-1", "88", "4.7", "8m"],
          ["SS-2", "128", "4.6", "6m"],
          ["SS-3", "62", "4.2", "12m"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Support audit trail & CSAT reports.",
      kpis: [
        kpi("Reports", "8", "ready", "success", FileText),
        kpi("Actions 24h", "412", "", "default", Activity),
        kpi("Findings", "1", "review", "warning", AlertTriangle),
        kpi("Retention", "2y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["CSAT report", "Dec 2024", "Ready"], ["SLA audit", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

// tiny helper to satisfy TS for Crown usage in an object literal
function Crown(): LucideIcon { return Award; }

/* ==================== LEGAL COMPLIANCE ==================== */
const LEGAL: ManagerConfig = {
  id: "legal",
  label: "Legal & Compliance Manager",
  icon: Scale,
  tagline: "Documents, policies, violations, alerts, trademark & full audit log.",
  sections: [
    {
      id: "vault", label: "Document Vault", icon: FileText,
      eyebrow: "Repository", title: "Legal Document Vault",
      description: "Every contract, NDA, policy and license in one signed vault.",
      kpis: [
        kpi("Documents", "1,284", "+18", "default", FileText),
        kpi("Executed", "1,142", "", "success", CheckCircle2),
        kpi("Awaiting Sign", "24", "", "warning", ClipboardList),
        kpi("Expiring 30d", "12", "renew", "premium", Clock),
      ],
      primaryAction: "Upload Document",
      ...rows(
        ["ID", "Title", "Party", "Type", "State"],
        [
          ["DOC-4401", "MSA — Acme", "Acme Corp", "MSA", "Executed"],
          ["DOC-4402", "NDA — Contoso", "Contoso", "NDA", "Awaiting"],
          ["DOC-4403", "SOW #12", "Northwind", "SOW", "Draft"],
        ],
      ),
    },
    {
      id: "policy", label: "Policy Compliance", icon: ShieldCheck,
      eyebrow: "Adherence", title: "Policy Compliance",
      description: "Coverage across GDPR, SOC2, HIPAA and internal policy.",
      kpis: [
        kpi("Coverage", "96%", "+1pp", "success", ShieldCheck),
        kpi("Controls", "184/192", "", "default", ListChecks),
        kpi("Overdue", "3", "review", "warning", ClipboardList),
        kpi("Audits Q", "2", "clean", "premium", ScrollText),
      ],
      ...rows(
        ["Framework", "Coverage", "Owner", "Next Review"],
        [
          ["GDPR", "98%", "Legal-1", "2025-03-04"],
          ["SOC 2", "94%", "Sec-1", "2025-02-18"],
          ["HIPAA", "92%", "Legal-2", "2025-04-01"],
        ],
      ),
    },
    {
      id: "violations", label: "Violations", icon: ShieldAlert,
      eyebrow: "Incidents", title: "Compliance Violations",
      description: "Detected policy breaches — logged, owned and closed.",
      kpis: [
        kpi("Open", "4", "review", "warning", ShieldAlert),
        kpi("Critical", "1", "", "destructive", AlertTriangle),
        kpi("Resolved 30d", "18", "+3", "success", CheckCircle2),
        kpi("MTTR", "36h", "-4h", "premium", Clock),
      ],
      ...rows(
        ["ID", "Rule", "Severity", "Owner"],
        [
          ["VIO-101", "Data retention", "Medium", "Legal-1"],
          ["VIO-102", "Consent scope", "High", "Legal-2"],
        ],
      ),
    },
    {
      id: "alerts", label: "Legal Alerts", icon: Bell,
      eyebrow: "Radar", title: "Legal Alerts",
      description: "Notices, regulator updates and internal alerts.",
      kpis: [
        kpi("New 7d", "6", "", "warning", Bell),
        kpi("Regulator", "1", "reply", "destructive", Flag),
        kpi("Internal", "4", "", "default", Inbox),
        kpi("Acknowledged", "22", "+5", "success", CheckCircle2),
      ],
      ...rows(
        ["Alert", "Source", "Received", "Action"],
        [
          ["Cookie law update", "EU", "3d ago", "Update banner"],
          ["Vendor DPA", "Vendor-A", "6h ago", "Sign"],
        ],
      ),
    },
    {
      id: "trademark", label: "Trademark Monitor", icon: Award,
      eyebrow: "Brand Protection", title: "Trademark Monitor",
      description: "Global trademark filings and infringement watch.",
      kpis: [
        kpi("Registered", "34", "regions", "success", Award),
        kpi("Pending", "6", "", "warning", ClipboardList),
        kpi("Watchlist", "12", "domains", "default", Radar),
        kpi("Enforcement", "2", "notices", "destructive", ShieldAlert),
      ],
      ...rows(
        ["Mark", "Region", "Status", "Renewal"],
        [
          ["Software Vala", "IN", "Registered", "2028-04-01"],
          ["Vala AI", "US", "Pending", "—"],
          ["Vala AI", "EU", "Watch", "—"],
        ],
      ),
    },
    {
      id: "logs", label: "Legal Logs", icon: ScrollText,
      eyebrow: "Immutable", title: "Legal Logs",
      description: "Every legal action time-stamped and cryptographically sealed.",
      kpis: [
        kpi("Actions 24h", "184", "", "default", Activity),
        kpi("Sealed", "100%", "", "success", Lock),
        kpi("Exports 7d", "6", "", "premium", Download),
        kpi("Retention", "7y", "policy", "premium", Lock),
      ],
      ...rows(
        ["Time", "Actor", "Action", "Object"],
        [
          ["12:04", "Legal-1", "Uploaded", "DOC-4401"],
          ["11:38", "Legal-2", "Signed", "DOC-4404"],
          ["11:12", "System", "Sealed", "VIO-101"],
        ],
      ),
    },
  ],
};

/* ==================== PERFORMANCE MANAGER ==================== */
const PERFORMANCE: ManagerConfig = {
  id: "performance",
  label: "Performance Manager",
  icon: Award,
  tagline: "OKRs, reviews, coaching, PIPs and promotion pipeline.",
  sections: [
    {
      id: "overview", label: "Overview", icon: Gauge,
      eyebrow: "Now", title: "Performance Overview",
      description: "Company-wide performance posture.",
      kpis: [
        kpi("Avg Score", "3.8", "/5", "success", Star),
        kpi("Cycle Progress", "72%", "", "premium", Activity),
        kpi("On PIP", "4", "", "destructive", AlertTriangle),
        kpi("Promotions", "12", "quarter", "premium", Award),
      ],
      ...rows(
        ["Team", "Score", "Δ", "Manager"],
        [
          ["Engineering", "4.1", "+0.1", "EMP-1003"],
          ["Sales", "3.6", "-0.1", "EMP-1010"],
          ["Ops", "3.9", "+0.2", "EMP-1020"],
        ],
      ),
    },
    {
      id: "reviews", label: "Reviews", icon: ClipboardList,
      eyebrow: "H1 Cycle", title: "Performance Reviews",
      description: "Cycle status per team and per person.",
      kpis: [
        kpi("Due", "34", "this cycle", "warning", ClipboardList),
        kpi("Completed", "112", "77%", "success", CheckCircle2),
        kpi("Overdue", "6", "", "destructive", AlertTriangle),
        kpi("Calibration", "3", "sessions", "premium", Users),
      ],
      ...rows(
        ["Employee", "Cycle", "Manager", "State"],
        [
          ["EMP-1001", "H1'25", "EMP-1003", "Complete"],
          ["EMP-1005", "H1'25", "EMP-1003", "Pending"],
        ],
      ),
    },
    {
      id: "pip", label: "PIP", icon: AlertTriangle,
      eyebrow: "Improvement", title: "Performance Improvement Plans",
      description: "Active PIPs and outcomes.",
      kpis: [
        kpi("On PIP", "4", "", "destructive", AlertTriangle),
        kpi("Improved", "7", "12m", "success", TrendingUp),
        kpi("Exited", "2", "", "warning", XCircle),
        kpi("Coaches", "6", "assigned", "default", GraduationCap),
      ],
      ...rows(
        ["Employee", "Start", "Coach", "Progress"],
        [
          ["EMP-1112", "2024-12-01", "EMP-1003", "40%"],
          ["EMP-1140", "2025-01-05", "EMP-1010", "10%"],
        ],
      ),
    },
    {
      id: "promotions", label: "Promotions", icon: Award,
      eyebrow: "Path", title: "Promotions",
      description: "Nominations, calibration, decisions.",
      kpis: [
        kpi("Nominated", "18", "", "premium", Award),
        kpi("Approved", "12", "cycle", "success", CheckCircle2),
        kpi("Pending", "4", "founder", "warning", ClipboardList),
        kpi("Rejected", "2", "", "default", XCircle),
      ],
      ...rows(
        ["Employee", "From", "To", "State"],
        [
          ["EMP-1001", "L4", "L5", "Approved"],
          ["EMP-1005", "L3", "L4", "Pending"],
        ],
      ),
    },
    {
      id: "okrs", label: "OKRs", icon: Target,
      eyebrow: "Objectives", title: "Objectives & Key Results",
      description: "Company, team and personal OKRs.",
      kpis: [
        kpi("Objectives", "42", "", "default", Target),
        kpi("On-Track", "31", "74%", "success", TrendingUp),
        kpi("At Risk", "8", "", "warning", AlertTriangle),
        kpi("Missed", "3", "", "destructive", XCircle),
      ],
      ...rows(
        ["Objective", "Owner", "Progress", "State"],
        [
          ["Launch v4.2", "EMP-1003", "82%", "On-Track"],
          ["Reduce CAC 20%", "EMP-1010", "42%", "At Risk"],
        ],
      ),
    },
  ],
};

/* ==================== TASK MANAGER ==================== */
const TASK: ManagerConfig = {
  id: "task",
  label: "Task Manager",
  icon: ListChecks,
  tagline: "Every task from queue to close — status, SLA, blocks, escalations.",
  sections: [
    {
      id: "new", label: "New Queue", icon: Inbox,
      eyebrow: "Unassigned", title: "New Tasks Queue",
      description: "Tasks arriving from products, orders, tickets and leads.",
      kpis: [
        kpi("New 24h", "48", "+8", "default", Inbox),
        kpi("Auto-Assigned", "34", "71%", "success", Zap),
        kpi("Manual Needed", "6", "", "warning", Users),
        kpi("Aged >4h", "3", "", "destructive", Clock),
      ],
      ...rows(
        ["ID", "Title", "Source", "Priority", "Suggested"],
        [
          ["TSK-201", "Payment retry", "Order", "High", "DEV-A1B2"],
          ["TSK-202", "Copy edit", "Blog", "Low", "MKT-1"],
        ],
      ),
    },
    {
      id: "active", label: "Active", icon: Activity,
      eyebrow: "In Flight", title: "Active Tasks",
      description: "Every assigned or in-progress task.",
      kpis: [
        kpi("Active", "184", "+12", "default", Activity),
        kpi("In Progress", "112", "", "premium", Zap),
        kpi("Assigned Idle", "12", "", "warning", Clock),
        kpi("On-Track", "88%", "+2pp", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Title", "Assignee", "Priority", "SLA Left"],
        [
          ["TSK-101", "API integration", "DEV-A1B2", "High", "8h"],
          ["TSK-102", "Form validation", "DEV-C3D4", "Medium", "32h"],
          ["TSK-103", "DB optimization", "DEV-E5F6", "Critical", "2h"],
        ],
      ),
    },
    {
      id: "blocked", label: "Blocked", icon: XCircle,
      eyebrow: "Stuck", title: "Blocked Tasks",
      description: "Tasks blocked on dependency, review or decision.",
      kpis: [
        kpi("Blocked", "18", "", "destructive", XCircle),
        kpi("Awaiting Dep", "8", "internal", "warning", Layers),
        kpi("Awaiting Review", "6", "", "warning", ClipboardList),
        kpi("Founder Decision", "2", "", "premium", Bell),
      ],
      ...rows(
        ["ID", "Title", "Blocked By", "Age"],
        [
          ["TSK-081", "Deploy release", "Approval", "2h"],
          ["TSK-082", "Publish app", "Legal review", "1d"],
        ],
      ),
    },
    {
      id: "overdue", label: "Overdue", icon: AlertTriangle,
      eyebrow: "Past Due", title: "Overdue Tasks",
      description: "Missed due date — needs immediate action.",
      kpis: [
        kpi("Overdue", "9", "", "destructive", AlertTriangle),
        kpi(">48h", "3", "", "destructive", Clock),
        kpi("Reassigned 7d", "6", "", "premium", Users),
        kpi("Recovered", "12", "closed", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Title", "Assignee", "Overdue By"],
        [
          ["TSK-041", "Renewal call", "SS-1", "6h"],
          ["TSK-046", "Report submit", "MKT-2", "1d"],
        ],
      ),
    },
    {
      id: "sla", label: "SLA Breach", icon: Radar,
      eyebrow: "Radar", title: "SLA Breach Alerts",
      description: "Breach risk radar with countdowns.",
      kpis: [
        kpi("At Risk", "22", "<20% left", "warning", Radar),
        kpi("Breached 24h", "4", "", "destructive", XCircle),
        kpi("Auto-Escalated", "3", "", "premium", Bell),
        kpi("MTTR", "5.2h", "-0.8h", "success", Zap),
      ],
      ...rows(
        ["ID", "SLA", "Remaining", "Owner"],
        [
          ["TSK-103", "8h", "2h", "DEV-E5F6"],
          ["TSK-118", "4h", "-14m", "DEV-A1B2"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: Bell,
      eyebrow: "Route", title: "Task Escalations",
      description: "Escalations to leads, managers and founder.",
      kpis: [
        kpi("Open", "8", "", "warning", Bell),
        kpi("Founder", "1", "", "destructive", Bell),
        kpi("Resolved 7d", "14", "+4", "success", CheckCircle2),
        kpi("Avg Age", "6h", "", "premium", Clock),
      ],
      ...rows(
        ["ID", "Subject", "Level", "Age"],
        [
          ["ESC-701", "Blocker on release", "Founder", "1h"],
          ["ESC-702", "Review needed", "Manager", "3h"],
        ],
      ),
    },
    {
      id: "flow", label: "Status Flow", icon: GitBranch,
      eyebrow: "Lifecycle", title: "Task Status Flow",
      description: "Configure allowed transitions and automations.",
      kpis: [
        kpi("States", "5", "", "default", Layers),
        kpi("Automations", "12", "", "premium", Bot),
        kpi("Guards", "8", "policy", "success", ShieldCheck),
        kpi("Deprecations", "1", "", "warning", AlertTriangle),
      ],
      ...rows(
        ["From", "To", "Guard", "Actor"],
        [
          ["Pending", "Assigned", "Auto-router", "Bot"],
          ["Assigned", "In Progress", "—", "Owner"],
          ["In Progress", "Completed", "Review", "Manager"],
          ["Blocked", "In Progress", "Reason cleared", "Owner"],
        ],
      ),
    },
  ],
};

/* ==================== SEO MANAGER ==================== */
const SEO: ManagerConfig = {
  id: "seo",
  label: "SEO Manager",
  icon: Search,
  tagline: "Health, keywords, backlinks, page fixes and AI suggestions.",
  sections: [
    {
      id: "health", label: "Health", icon: Activity,
      eyebrow: "Score", title: "SEO Health Overview",
      description: "Overall, on-page, technical and backlink scores.",
      kpis: [
        kpi("Overall", "78", "+3", "success", Activity),
        kpi("On-Page", "85", "", "success", CheckCircle2),
        kpi("Technical", "62", "-2", "warning", Zap),
        kpi("Backlinks", "71", "", "success", Globe),
      ],
      ...rows(
        ["Signal", "Score", "State", "Owner"],
        [
          ["Core Web Vitals", "82", "Healthy", "SEO-1"],
          ["Crawl budget", "74", "Warn", "SEO-2"],
          ["Schema coverage", "68", "Warn", "SEO-1"],
        ],
      ),
    },
    {
      id: "keywords", label: "Keywords", icon: Target,
      eyebrow: "SERP", title: "Keyword Performance",
      description: "Ranking movement across tracked keywords.",
      kpis: [
        kpi("Tracked", "1,284", "", "default", Target),
        kpi("Top 3", "184", "+22", "premium", Award),
        kpi("Top 10", "412", "+34", "success", TrendingUp),
        kpi("Dropped", "18", "review", "warning", TrendingDown),
      ],
      ...rows(
        ["Keyword", "Position", "Δ", "URL"],
        [
          ["software vala", "1", "0", "/"],
          ["ai marketplace", "4", "+2", "/marketplace"],
          ["nexus os login", "12", "-3", "/login"],
        ],
      ),
    },
    {
      id: "backlinks", label: "Backlinks", icon: Link2,
      eyebrow: "Authority", title: "Backlink Monitor",
      description: "New, lost and toxic backlinks.",
      kpis: [
        kpi("Referring", "2,412", "+42", "success", Link2),
        kpi("New 7d", "82", "", "premium", TrendingUp),
        kpi("Lost 7d", "18", "", "warning", TrendingDown),
        kpi("Toxic", "6", "disavow", "destructive", ShieldAlert),
      ],
      ...rows(
        ["Domain", "Authority", "Type", "State"],
        [
          ["techcrunch.com", "94", "dofollow", "Live"],
          ["news.example.com", "62", "dofollow", "New"],
          ["spam-farm.io", "12", "dofollow", "Toxic"],
        ],
      ),
    },
    {
      id: "pages", label: "Page Optimization", icon: FileText,
      eyebrow: "Fix", title: "Page Optimization",
      description: "Pages needing meta, content or schema fixes.",
      kpis: [
        kpi("Needs Fix", "42", "", "warning", Wrench),
        kpi("Missing Meta", "12", "", "warning", FileText),
        kpi("Thin Content", "8", "", "destructive", XCircle),
        kpi("Fixed 7d", "18", "+6", "success", CheckCircle2),
      ],
      ...rows(
        ["URL", "Issue", "Impact", "Owner"],
        [
          ["/pricing", "Missing meta", "High", "SEO-1"],
          ["/blog/42", "Thin content", "Medium", "MKT-1"],
        ],
      ),
    },
    {
      id: "technical", label: "Technical", icon: Wrench,
      eyebrow: "Crawl & Index", title: "Technical Alerts",
      description: "Crawl errors, sitemap, robots, canonical issues.",
      kpis: [
        kpi("Crawl Errors", "23", "-6", "warning", XCircle),
        kpi("Indexed", "1,847", "+12", "success", CheckCircle2),
        kpi("Broken Links", "8", "fix", "destructive", Link2),
        kpi("Sitemap", "OK", "", "success", ShieldCheck),
      ],
      ...rows(
        ["URL", "Error", "Type", "Detected"],
        [
          ["/old-page", "404", "Crawl", "2d ago"],
          ["/blog/89", "5xx", "Server", "3h ago"],
        ],
      ),
    },
    {
      id: "ai", label: "AI Suggestions", icon: Sparkles,
      eyebrow: "Auto-Improve", title: "AI SEO Suggestions",
      description: "AI-generated fixes ranked by impact.",
      kpis: [
        kpi("Suggestions", "34", "", "premium", Sparkles),
        kpi("Applied 7d", "18", "+9pt", "success", CheckCircle2),
        kpi("Rejected", "4", "", "warning", XCircle),
        kpi("Est. Uplift", "+12%", "traffic", "premium", TrendingUp),
      ],
      ...rows(
        ["Suggestion", "URL", "Impact", "State"],
        [
          ["Add meta description", "/pricing", "High", "Pending"],
          ["Add FAQ schema", "/", "Medium", "Applied"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "SEO Reports & Audit",
      description: "Ranking, traffic and change audit.",
      kpis: [
        kpi("Reports", "9", "ready", "success", FileText),
        kpi("Actions 24h", "84", "", "default", Activity),
        kpi("Findings", "0", "", "success", CheckCircle2),
        kpi("Retention", "3y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["Ranking report", "Dec 2024", "Ready"], ["Traffic audit", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== INFLUENCER MANAGER ==================== */
const INFLUENCER: ManagerConfig = {
  id: "influencer",
  label: "Influencer Manager",
  icon: Star,
  tagline: "Applications, active roster, campaigns, payouts, fraud & reputation.",
  sections: [
    {
      id: "applications", label: "Applications", icon: Inbox,
      eyebrow: "Onboarding", title: "Applications Queue",
      description: "New influencer applications awaiting review.",
      kpis: [
        kpi("Queued", "42", "", "warning", Inbox),
        kpi("Approved 7d", "18", "+6", "success", CheckCircle2),
        kpi("Rejected 7d", "9", "", "default", XCircle),
        kpi("Avg Review", "6h", "-1h", "premium", Zap),
      ],
      ...rows(
        ["ID", "Handle", "Platform", "Reach", "State"],
        [
          ["APP-101", "@creatorA", "Instagram", "128k", "Review"],
          ["APP-102", "@creatorB", "YouTube", "42k", "Review"],
        ],
      ),
    },
    {
      id: "active", label: "Active Influencers", icon: Users,
      eyebrow: "Roster", title: "Active Influencers",
      description: "Signed and delivering influencers.",
      kpis: [
        kpi("Active", "184", "+12", "success", Users),
        kpi("Tier A", "22", "", "premium", Award),
        kpi("Tier B", "68", "", "default", Star),
        kpi("Tier C", "94", "", "default", Star),
      ],
      ...rows(
        ["Handle", "Tier", "Reach", "Deliveries"],
        [
          ["@creatorA", "A", "128k", "18"],
          ["@creatorC", "B", "42k", "6"],
        ],
      ),
    },
    {
      id: "campaigns", label: "Campaigns", icon: Megaphone,
      eyebrow: "Collab", title: "Campaign Collaboration",
      description: "Briefs, deliverables and status per collab.",
      kpis: [
        kpi("Active", "24", "", "success", Megaphone),
        kpi("Pending Content", "8", "", "warning", ClipboardList),
        kpi("Awaiting Payout", "6", "", "premium", DollarSign),
        kpi("Completed 30d", "42", "", "success", CheckCircle2),
      ],
      ...rows(
        ["Campaign", "Influencer", "Stage", "Due"],
        [
          ["Q1 launch", "@creatorA", "Content Review", "3d"],
          ["Founder AMA", "@creatorB", "Draft", "6d"],
        ],
      ),
    },
    {
      id: "payouts", label: "Payouts", icon: DollarSign,
      eyebrow: "Wallet", title: "Payout Wallet",
      description: "Pending and completed influencer payouts.",
      kpis: [
        kpi("Pending", "$18.4K", "6 items", "warning", DollarSign),
        kpi("Paid MTD", "$62K", "", "success", CheckCircle2),
        kpi("Disputes", "1", "", "destructive", AlertTriangle),
        kpi("Avg Time", "2.4d", "-0.6d", "premium", Clock),
      ],
      ...rows(
        ["ID", "Influencer", "Amount", "State"],
        [
          ["PAY-701", "@creatorA", "$4,200", "Pending"],
          ["PAY-702", "@creatorC", "$1,800", "Paid"],
        ],
      ),
    },
    {
      id: "fraud", label: "Fraud Protection", icon: ShieldAlert,
      eyebrow: "AI Flags", title: "Fraud & AI Flags",
      description: "Bot traffic, fake engagement and click fraud.",
      kpis: [
        kpi("Flagged", "12", "review", "warning", ShieldAlert),
        kpi("Confirmed", "3", "sanction", "destructive", XCircle),
        kpi("Cleared", "18", "false-pos", "success", CheckCircle2),
        kpi("Est. Saved", "$8.2K", "MTD", "premium", DollarSign),
      ],
      ...rows(
        ["Handle", "Signal", "Score", "Action"],
        [
          ["@creatorX", "Bot followers", "92%", "Sanctioned"],
          ["@creatorY", "Click fraud", "68%", "Reviewing"],
        ],
      ),
    },
    {
      id: "reputation", label: "Reputation", icon: ShieldCheck,
      eyebrow: "Guard", title: "Reputation Guard",
      description: "Sentiment, controversy & risk scoring.",
      kpis: [
        kpi("Positive", "84%", "+2pp", "success", TrendingUp),
        kpi("Neutral", "12%", "", "default", Activity),
        kpi("Negative", "4%", "", "warning", TrendingDown),
        kpi("Watch List", "6", "", "destructive", Radar),
      ],
      ...rows(
        ["Handle", "Sentiment", "Risk", "Owner"],
        [
          ["@creatorA", "Positive", "Low", "IM-1"],
          ["@creatorZ", "Negative", "High", "IM-2"],
        ],
      ),
    },
    {
      id: "tiers", label: "Tiers & Badges", icon: Award,
      eyebrow: "Rewards", title: "Tier & Badge System",
      description: "Automatic tier progression, badges and rewards.",
      kpis: [
        kpi("Tier Ups 7d", "6", "", "premium", TrendingUp),
        kpi("Badges", "128", "issued", "success", Award),
        kpi("Reward Pool", "$14K", "MTD", "default", DollarSign),
        kpi("Retention", "92%", "", "success", ShieldCheck),
      ],
      ...rows(
        ["Handle", "From", "To", "Reason"],
        [
          ["@creatorC", "B", "A", "8 wins"],
          ["@creatorD", "C", "B", "3 wins"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Influencer program audit trail & reports.",
      kpis: [
        kpi("Reports", "6", "ready", "success", FileText),
        kpi("Actions 24h", "142", "", "default", Activity),
        kpi("Findings", "0", "", "success", CheckCircle2),
        kpi("Retention", "3y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["Performance", "Dec 2024", "Ready"], ["Fraud", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== RESELLER MANAGER ==================== */
const RESELLER: ManagerConfig = {
  id: "reseller",
  label: "Reseller Manager",
  icon: Handshake,
  tagline: "Applications, roster, commissions, escalations & compliance.",
  sections: [
    {
      id: "overview", label: "Overview", icon: Gauge,
      eyebrow: "Program", title: "Reseller Program Overview",
      description: "Live health of the reseller channel.",
      kpis: [
        kpi("Active", "184", "+12", "success", Handshake),
        kpi("Revenue MTD", "$482K", "+18%", "premium", DollarSign),
        kpi("Pending Payout", "$28K", "6 items", "warning", DollarSign),
        kpi("Fraud Flags", "3", "", "destructive", ShieldAlert),
      ],
      ...rows(
        ["Region", "Resellers", "Revenue", "Growth"],
        [
          ["NA", "62", "$188K", "+22%"],
          ["EU", "48", "$142K", "+14%"],
          ["APAC", "74", "$152K", "+18%"],
        ],
      ),
    },
    {
      id: "applications", label: "Applications", icon: Inbox,
      eyebrow: "Onboarding", title: "Reseller Applications",
      description: "New reseller applications awaiting review.",
      kpis: [
        kpi("Queued", "24", "", "warning", Inbox),
        kpi("Approved 7d", "8", "+3", "success", CheckCircle2),
        kpi("Rejected 7d", "4", "", "default", XCircle),
        kpi("Avg Review", "1d", "-4h", "premium", Zap),
      ],
      ...rows(
        ["ID", "Company", "Region", "Tier", "State"],
        [
          ["APP-R01", "Reseller A", "NA", "Silver", "Review"],
          ["APP-R02", "Reseller B", "EU", "Gold", "Review"],
        ],
      ),
    },
    {
      id: "roster", label: "Active Resellers", icon: Users,
      eyebrow: "Roster", title: "Active Resellers",
      description: "Every signed reseller across tiers.",
      kpis: [
        kpi("Total", "184", "", "default", Users),
        kpi("Platinum", "8", "", "premium", Award),
        kpi("Gold", "34", "", "premium", Star),
        kpi("Silver", "88", "", "default", Star),
      ],
      ...rows(
        ["ID", "Company", "Tier", "MRR", "Region"],
        [
          ["RES-101", "Reseller A", "Gold", "$4.2K", "NA"],
          ["RES-102", "Reseller B", "Silver", "$1.8K", "EU"],
        ],
      ),
    },
    {
      id: "commissions", label: "Commissions", icon: DollarSign,
      eyebrow: "Payouts", title: "Commissions & Payouts",
      description: "Earned, pending and paid commissions.",
      kpis: [
        kpi("Pending", "$28K", "", "warning", DollarSign),
        kpi("Paid MTD", "$142K", "", "success", CheckCircle2),
        kpi("Disputes", "2", "", "destructive", AlertTriangle),
        kpi("Avg Cycle", "3.2d", "", "premium", Clock),
      ],
      ...rows(
        ["Reseller", "Period", "Amount", "State"],
        [
          ["RES-101", "Dec 2024", "$4,240", "Pending"],
          ["RES-102", "Dec 2024", "$1,820", "Paid"],
        ],
      ),
    },
    {
      id: "hierarchy", label: "Category Hierarchy", icon: Layers,
      eyebrow: "Structure", title: "Category Hierarchy",
      description: "Product categories & reseller mapping.",
      kpis: [
        kpi("Categories", "42", "", "default", Layers),
        kpi("Sub-categories", "184", "", "default", Layers),
        kpi("Mapped", "94%", "", "success", CheckCircle2),
        kpi("Unmapped", "12", "review", "warning", AlertTriangle),
      ],
      ...rows(
        ["Category", "Sub", "Resellers", "Owner"],
        [
          ["ERP", "Manufacturing", "22", "PM-1"],
          ["POS", "Retail", "18", "PM-2"],
        ],
      ),
    },
    {
      id: "issues", label: "Issues & Escalations", icon: AlertTriangle,
      eyebrow: "Support", title: "Issues & Escalations",
      description: "Open issues by severity and owner.",
      kpis: [
        kpi("Open", "12", "", "warning", Inbox),
        kpi("Critical", "1", "", "destructive", AlertTriangle),
        kpi("Founder", "2", "waiting", "premium", Bell),
        kpi("Resolved 7d", "18", "+4", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "Reseller", "Issue", "Age"],
        [
          ["ISS-101", "RES-101", "Payout dispute", "1d"],
          ["ISS-102", "RES-108", "Access issue", "3h"],
        ],
      ),
    },
    {
      id: "compliance", label: "Compliance", icon: ShieldCheck,
      eyebrow: "Policy", title: "Reseller Compliance",
      description: "Contract, tax and policy adherence.",
      kpis: [
        kpi("Coverage", "92%", "+1pp", "success", ShieldCheck),
        kpi("Missing", "18", "docs", "warning", FileText),
        kpi("Expiring 30d", "6", "", "premium", Clock),
        kpi("Violations", "1", "review", "destructive", ShieldAlert),
      ],
      ...rows(
        ["Reseller", "Rule", "State"],
        [
          ["RES-101", "GST", "Verified"],
          ["RES-108", "Tax form", "Missing"],
        ],
      ),
    },
    {
      id: "insights", label: "AI Insights", icon: Sparkles,
      eyebrow: "Auto", title: "AI Insights",
      description: "Growth, churn risk and upsell suggestions.",
      kpis: [
        kpi("Upsell", "18", "$62K est.", "premium", Sparkles),
        kpi("Churn Risk", "6", "", "destructive", TrendingDown),
        kpi("Growth Stars", "12", "", "success", TrendingUp),
        kpi("Applied 7d", "9", "", "success", CheckCircle2),
      ],
      ...rows(
        ["Reseller", "Insight", "Impact"],
        [
          ["RES-101", "Upsell POS bundle", "$4.2K"],
          ["RES-108", "Churn risk high", "$1.8K"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Program audit trail & reports.",
      kpis: [
        kpi("Reports", "8", "ready", "success", FileText),
        kpi("Actions 24h", "212", "", "default", Activity),
        kpi("Findings", "1", "review", "warning", AlertTriangle),
        kpi("Retention", "5y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["Commissions", "Dec 2024", "Ready"], ["Compliance", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== FRANCHISE MANAGER ==================== */
const FRANCHISE: ManagerConfig = {
  id: "franchise",
  label: "Franchise Manager",
  icon: Building2,
  tagline: "Applications, active franchises, territory, escalations & fraud.",
  sections: [
    {
      id: "active", label: "Active Franchises", icon: Building2,
      eyebrow: "Roster", title: "Active Franchises",
      description: "All live franchises across regions.",
      kpis: [
        kpi("Active", "42", "+3", "success", Building2),
        kpi("Revenue MTD", "$1.8M", "+12%", "premium", DollarSign),
        kpi("Locations", "184", "", "default", Map),
        kpi("At Risk", "3", "", "warning", AlertTriangle),
      ],
      ...rows(
        ["ID", "Franchise", "Region", "Locations", "MRR"],
        [
          ["FR-01", "Mumbai HQ", "IN", "12", "$142K"],
          ["FR-02", "Dubai Central", "AE", "6", "$88K"],
        ],
      ),
    },
    {
      id: "applications", label: "Applications", icon: Inbox,
      eyebrow: "Pipeline", title: "Franchise Applications",
      description: "Prospects and applications in progress.",
      kpis: [
        kpi("Prospects", "84", "", "default", Inbox),
        kpi("In Diligence", "18", "", "warning", ClipboardList),
        kpi("Approved 30d", "3", "", "success", CheckCircle2),
        kpi("Rejected 30d", "6", "", "default", XCircle),
      ],
      ...rows(
        ["ID", "Applicant", "Region", "Stage"],
        [
          ["APP-F01", "Applicant A", "NA", "Diligence"],
          ["APP-F02", "Applicant B", "EU", "Review"],
        ],
      ),
    },
    {
      id: "territory", label: "Territory Map", icon: Map,
      eyebrow: "Geo", title: "Territory Map",
      description: "Territory availability and exclusivity.",
      kpis: [
        kpi("Territories", "128", "", "default", Map),
        kpi("Exclusive", "42", "", "premium", Lock),
        kpi("Available", "58", "", "success", CheckCircle2),
        kpi("Contested", "6", "", "warning", AlertTriangle),
      ],
      ...rows(
        ["Territory", "State", "Owner", "Since"],
        [
          ["Mumbai West", "Exclusive", "FR-01", "2023"],
          ["Dubai Marina", "Exclusive", "FR-02", "2024"],
          ["Berlin", "Available", "—", "—"],
        ],
      ),
    },
    {
      id: "performance", label: "Performance", icon: BarChart3,
      eyebrow: "Ops", title: "Performance Overview",
      description: "Revenue, satisfaction and compliance per franchise.",
      kpis: [
        kpi("Top", "FR-01", "$142K", "premium", Award),
        kpi("Avg CSAT", "4.5", "+0.1", "success", Star),
        kpi("Compliance", "94%", "", "success", ShieldCheck),
        kpi("Bottom Quartile", "4", "coach", "warning", TrendingDown),
      ],
      ...rows(
        ["Franchise", "MRR", "CSAT", "Compliance"],
        [
          ["FR-01", "$142K", "4.7", "98%"],
          ["FR-02", "$88K", "4.4", "92%"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: Bell,
      eyebrow: "Support", title: "Escalations",
      description: "Franchise issues escalated to HQ.",
      kpis: [
        kpi("Open", "8", "", "warning", Bell),
        kpi("Founder", "1", "", "destructive", Bell),
        kpi("Resolved 7d", "12", "", "success", CheckCircle2),
        kpi("MTTR", "2d", "-0.4d", "premium", Clock),
      ],
      ...rows(
        ["ID", "Franchise", "Subject", "Age"],
        [
          ["ESC-F01", "FR-01", "Supply outage", "1d"],
          ["ESC-F02", "FR-02", "Access dispute", "3h"],
        ],
      ),
    },
    {
      id: "fraud", label: "AI Fraud", icon: ShieldAlert,
      eyebrow: "Radar", title: "AI Fraud Alerts",
      description: "Suspicious ordering, refunds or margin.",
      kpis: [
        kpi("Flagged", "6", "", "warning", ShieldAlert),
        kpi("Confirmed", "1", "", "destructive", XCircle),
        kpi("Cleared", "12", "", "success", CheckCircle2),
        kpi("Est. Saved", "$18K", "MTD", "premium", DollarSign),
      ],
      ...rows(
        ["Franchise", "Signal", "Score"],
        [
          ["FR-04", "Refund spike", "88%"],
          ["FR-07", "Margin drop", "62%"],
        ],
      ),
    },
    {
      id: "compliance", label: "Compliance", icon: ShieldCheck,
      eyebrow: "Policy", title: "Compliance Status",
      description: "Contract, brand and operational compliance.",
      kpis: [
        kpi("Coverage", "94%", "", "success", ShieldCheck),
        kpi("Missing Docs", "8", "", "warning", FileText),
        kpi("Audits 90d", "4", "clean", "premium", ScrollText),
        kpi("Violations", "2", "review", "destructive", ShieldAlert),
      ],
      ...rows(
        ["Franchise", "Rule", "State"],
        [
          ["FR-01", "Brand kit", "Verified"],
          ["FR-06", "Signage", "Missing"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Program audit & performance reports.",
      kpis: [
        kpi("Reports", "9", "ready", "success", FileText),
        kpi("Actions 24h", "184", "", "default", Activity),
        kpi("Findings", "1", "review", "warning", AlertTriangle),
        kpi("Retention", "7y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["Franchise P&L", "Dec 2024", "Ready"], ["Compliance", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== PRODUCT DEMO MANAGER ==================== */
const PRODUCT_DEMO: ManagerConfig = {
  id: "product-demo",
  label: "Product Demo Manager",
  icon: Package,
  tagline: "Every demo tenant — schedules, health, conversions and cleanup.",
  sections: [
    {
      id: "active", label: "Active Demos", icon: Package,
      eyebrow: "Live", title: "Active Demo Tenants",
      description: "All demo tenants currently provisioned.",
      kpis: [
        kpi("Live", "184", "+22", "success", Package),
        kpi("Trial", "128", "", "premium", Clock),
        kpi("Expired 7d", "42", "", "warning", XCircle),
        kpi("Converted 30d", "34", "+8", "success", CheckCircle2),
      ],
      primaryAction: "Provision Demo",
      ...rows(
        ["ID", "Product", "Prospect", "Age", "State"],
        [
          ["DEMO-101", "ERP Cloud", "Acme", "2d", "Active"],
          ["DEMO-102", "POS Pro", "Contoso", "5d", "Trial"],
        ],
      ),
    },
    {
      id: "schedule", label: "Schedule", icon: Clock,
      eyebrow: "Upcoming", title: "Demo Schedule",
      description: "Booked live demos next 14 days.",
      kpis: [
        kpi("Booked", "42", "next 14d", "success", Clock),
        kpi("Awaiting Rep", "6", "assign", "warning", Users),
        kpi("Cancelled 7d", "4", "", "default", XCircle),
        kpi("Show-Up", "88%", "", "premium", CheckCircle2),
      ],
      ...rows(
        ["When", "Prospect", "Product", "Owner"],
        [
          ["Tomorrow 10:00", "Acme", "ERP", "AE-1"],
          ["Fri 15:30", "Contoso", "POS", "AE-2"],
        ],
      ),
    },
    {
      id: "health", label: "Tenant Health", icon: Activity,
      eyebrow: "Runtime", title: "Demo Tenant Health",
      description: "Provisioning success, uptime and data-seed status.",
      kpis: [
        kpi("Uptime 7d", "99.94%", "", "success", ShieldCheck),
        kpi("Provision Fails", "2", "", "warning", XCircle),
        kpi("Data-Seed Fails", "1", "", "warning", AlertTriangle),
        kpi("Auto-Healed", "6", "", "premium", Zap),
      ],
      ...rows(
        ["Tenant", "State", "Issue", "Owner"],
        [
          ["DEMO-081", "Warn", "Data seed slow", "Ops-1"],
          ["DEMO-088", "Healed", "—", "Auto"],
        ],
      ),
    },
    {
      id: "conversions", label: "Conversions", icon: Target,
      eyebrow: "Outcome", title: "Demo Conversions",
      description: "Demo → deal conversion rate by product.",
      kpis: [
        kpi("Conversion", "18.4%", "+2pp", "success", Percent),
        kpi("Won 30d", "34", "+8", "premium", Award),
        kpi("Lost 30d", "42", "", "default", XCircle),
        kpi("Avg Time", "18d", "-2d", "premium", Clock),
      ],
      ...rows(
        ["Product", "Demos", "Won", "CVR"],
        [
          ["ERP Cloud", "62", "12", "19%"],
          ["POS Pro", "48", "9", "18%"],
        ],
      ),
    },
    {
      id: "cleanup", label: "Cleanup", icon: Wrench,
      eyebrow: "Housekeeping", title: "Demo Cleanup",
      description: "Auto-expiry, teardown and quota reclaim.",
      kpis: [
        kpi("Expired", "42", "queue", "warning", XCircle),
        kpi("Teardown 24h", "38", "", "success", CheckCircle2),
        kpi("Quota Reclaimed", "128GB", "", "premium", HardDrive),
        kpi("Manual Needed", "4", "", "default", Users),
      ],
      ...rows(
        ["Tenant", "State", "Reclaim", "Owner"],
        [
          ["DEMO-071", "Expired", "12GB", "Auto"],
          ["DEMO-074", "Expired", "8GB", "Auto"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Reports & Audit",
      description: "Demo program audit & conversion reports.",
      kpis: [
        kpi("Reports", "6", "ready", "success", FileText),
        kpi("Actions 24h", "184", "", "default", Activity),
        kpi("Findings", "0", "", "success", CheckCircle2),
        kpi("Retention", "1y", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["Conversion", "Dec 2024", "Ready"], ["Uptime", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== API / AI MANAGER ==================== */
const API_AI: ManagerConfig = {
  id: "api-ai",
  label: "API / AI Manager",
  icon: Bot,
  tagline: "APIs, keys, rate limits, AI agents, decisions & security.",
  sections: [
    {
      id: "status", label: "API Status", icon: Activity,
      eyebrow: "Live", title: "API Status Monitor",
      description: "Uptime, latency and error rate per endpoint.",
      kpis: [
        kpi("Uptime 7d", "99.98%", "", "success", ShieldCheck),
        kpi("p95 Latency", "148ms", "-12ms", "premium", Zap),
        kpi("Errors 24h", "42", "0.02%", "warning", XCircle),
        kpi("Endpoints", "184", "", "default", Radio),
      ],
      ...rows(
        ["Endpoint", "Status", "p95", "Errors"],
        [
          ["/v1/orders", "Green", "112ms", "0.01%"],
          ["/v1/products", "Green", "148ms", "0.02%"],
          ["/v1/pay", "Warn", "482ms", "0.4%"],
        ],
      ),
    },
    {
      id: "keys", label: "API Keys", icon: KeyRound,
      eyebrow: "Registry", title: "API Keys Registry",
      description: "Every issued key with scope and expiry.",
      kpis: [
        kpi("Keys", "412", "", "default", KeyRound),
        kpi("Expiring 30d", "18", "", "warning", Clock),
        kpi("Revoked 7d", "4", "", "destructive", XCircle),
        kpi("Rotation Due", "22", "", "premium", Zap),
      ],
      primaryAction: "Issue Key",
      ...rows(
        ["Key", "Owner", "Scope", "Expiry"],
        [
          ["KEY-A1", "Reseller A", "read:products", "2025-06-01"],
          ["KEY-B2", "Vendor B", "write:orders", "2025-02-28"],
        ],
      ),
    },
    {
      id: "rate", label: "Rate Limits", icon: Gauge,
      eyebrow: "Throttle", title: "Rate Limit Monitor",
      description: "Live limit consumption and violations.",
      kpis: [
        kpi("Throttled 24h", "142", "", "warning", Gauge),
        kpi("Top Consumer", "KEY-A1", "82%", "premium", Zap),
        kpi("Blocked", "6", "abuse", "destructive", XCircle),
        kpi("Quota Uplifts", "3", "", "success", TrendingUp),
      ],
      ...rows(
        ["Key", "Consumption", "Limit", "State"],
        [
          ["KEY-A1", "82%", "10k/min", "Warn"],
          ["KEY-C4", "18%", "1k/min", "OK"],
        ],
      ),
    },
    {
      id: "integrations", label: "Integrations", icon: Link2,
      eyebrow: "Controls", title: "Integration Controls",
      description: "Toggle, throttle and audit each integration.",
      kpis: [
        kpi("Active", "34", "", "success", Link2),
        kpi("Disabled", "4", "", "warning", XCircle),
        kpi("Failing", "1", "", "destructive", AlertTriangle),
        kpi("New 30d", "3", "", "premium", TrendingUp),
      ],
      ...rows(
        ["Integration", "State", "Owner"],
        [
          ["Stripe", "Active", "Fin-1"],
          ["Segment", "Active", "Data-1"],
          ["Zapier", "Failing", "Ops-1"],
        ],
      ),
    },
    {
      id: "agents", label: "AI Agents", icon: Bot,
      eyebrow: "Models", title: "AI Models & Agents",
      description: "Every AI agent with model, cost and health.",
      kpis: [
        kpi("Agents", "24", "", "default", Bot),
        kpi("Requests 24h", "148K", "", "premium", Radio),
        kpi("Cost 24h", "$142", "-8%", "success", DollarSign),
        kpi("Errors", "0.4%", "", "warning", XCircle),
      ],
      ...rows(
        ["Agent", "Model", "Requests", "Cost"],
        [
          ["Lead scorer", "gpt-4.1-mini", "48K", "$38"],
          ["Support triage", "claude-sonnet", "22K", "$62"],
          ["SEO writer", "gpt-4.1", "8K", "$42"],
        ],
      ),
    },
    {
      id: "decisions", label: "AI Decisions", icon: Sparkles,
      eyebrow: "Log", title: "AI Decision Logs",
      description: "Every AI decision with rationale and outcome.",
      kpis: [
        kpi("Decisions 24h", "3,842", "", "default", Sparkles),
        kpi("Approved", "94%", "", "success", CheckCircle2),
        kpi("Overridden", "4%", "", "warning", XCircle),
        kpi("Explanations", "100%", "", "premium", FileText),
      ],
      ...rows(
        ["Time", "Agent", "Object", "Outcome"],
        [
          ["12:04", "Lead scorer", "LD-9002", "Qualified"],
          ["12:03", "Support triage", "TKT-8801", "Route: Payments"],
        ],
      ),
    },
    {
      id: "security", label: "Security Alerts", icon: ShieldAlert,
      eyebrow: "Radar", title: "API Security Alerts",
      description: "Abnormal traffic, credential leaks, abuse.",
      kpis: [
        kpi("Alerts", "6", "", "warning", ShieldAlert),
        kpi("Blocked IPs", "128", "24h", "premium", Lock),
        kpi("Leaked Keys", "0", "", "success", CheckCircle2),
        kpi("MTTA", "4m", "-1m", "premium", Zap),
      ],
      ...rows(
        ["Signal", "Score", "Source", "Action"],
        [
          ["Burst 429", "88%", "203.0.113.14", "Blocked"],
          ["Rare geo", "62%", "APAC", "Review"],
        ],
      ),
    },
    {
      id: "audit", label: "API Audit", icon: ScrollText,
      eyebrow: "Trail", title: "API Audit Logs",
      description: "Full audit of key issuance, rotation and use.",
      kpis: [
        kpi("Actions 24h", "1,412", "", "default", Activity),
        kpi("Rotations 7d", "18", "", "success", CheckCircle2),
        kpi("Revocations 7d", "4", "", "warning", XCircle),
        kpi("Retention", "3y", "", "premium", Lock),
      ],
      ...rows(
        ["Time", "Actor", "Action", "Object"],
        [
          ["12:04", "Sec-1", "Revoked", "KEY-Z9"],
          ["11:38", "Auto", "Rotated", "KEY-A1"],
        ],
      ),
    },
  ],
};

/* ==================== SERVER MANAGER ==================== */
const SERVER: ManagerConfig = {
  id: "server",
  label: "Server Manager",
  icon: Server,
  tagline: "Services, deployments, DB health, backups, secrets & incidents.",
  sections: [
    {
      id: "services", label: "Services Status", icon: Radio,
      eyebrow: "Fleet", title: "Services Status",
      description: "Every service, region and healthy replica.",
      kpis: [
        kpi("Services", "42", "", "default", Radio),
        kpi("Healthy", "40", "95%", "success", CheckCircle2),
        kpi("Degraded", "2", "", "warning", AlertTriangle),
        kpi("Down", "0", "", "success", ShieldCheck),
      ],
      ...rows(
        ["Service", "Region", "Replicas", "State"],
        [
          ["api", "us-east", "8/8", "Healthy"],
          ["worker", "us-east", "4/4", "Healthy"],
          ["billing", "eu-west", "1/2", "Degraded"],
        ],
      ),
    },
    {
      id: "deployments", label: "Deployments", icon: GitBranch,
      eyebrow: "Ship", title: "Deployments",
      description: "In-flight, ready and rolled-back deploys.",
      kpis: [
        kpi("In Flight", "2", "", "premium", Activity),
        kpi("Success 7d", "82", "", "success", CheckCircle2),
        kpi("Rolled Back", "1", "", "warning", XCircle),
        kpi("Avg Time", "6.4m", "-1m", "premium", Zap),
      ],
      primaryAction: "New Deploy",
      ...rows(
        ["Service", "Version", "State", "Author"],
        [
          ["api", "v4.2.1", "In Flight", "DEV-A1B2"],
          ["worker", "v1.8.0", "Success", "DEV-C3D4"],
        ],
      ),
    },
    {
      id: "db", label: "Database Health", icon: Database,
      eyebrow: "Storage", title: "Database Health",
      description: "Primary/replica lag, IOPS and slow queries.",
      kpis: [
        kpi("Replica Lag", "48ms", "", "success", Waves),
        kpi("IOPS", "12k", "", "default", Activity),
        kpi("Slow Queries", "6", ">1s", "warning", Clock),
        kpi("Storage", "1.4TB", "62%", "premium", HardDrive),
      ],
      ...rows(
        ["DB", "Role", "Lag", "IOPS"],
        [
          ["prod-a", "Primary", "—", "8k"],
          ["prod-b", "Replica", "48ms", "4k"],
        ],
      ),
    },
    {
      id: "backups", label: "Backups", icon: HardDrive,
      eyebrow: "Restore", title: "Backups",
      description: "Backup cadence, verification and restore drills.",
      kpis: [
        kpi("Success 7d", "42/42", "", "success", CheckCircle2),
        kpi("Last Verify", "Today", "green", "premium", ShieldCheck),
        kpi("Restore Drill", "Weekly", "", "default", Wrench),
        kpi("RPO", "5m", "", "success", Clock),
      ],
      ...rows(
        ["Job", "Cadence", "Last Run", "State"],
        [
          ["prod-a full", "Daily", "Today 03:00", "OK"],
          ["prod-b incr", "Hourly", "12m ago", "OK"],
        ],
      ),
    },
    {
      id: "secrets", label: "Secrets", icon: Lock,
      eyebrow: "Vault", title: "Secrets Vault",
      description: "Every secret with rotation, owner and access.",
      kpis: [
        kpi("Secrets", "128", "", "default", Lock),
        kpi("Due Rotation", "8", "", "warning", Clock),
        kpi("Rotated 7d", "22", "", "success", CheckCircle2),
        kpi("Exposed", "0", "", "success", ShieldCheck),
      ],
      ...rows(
        ["Name", "Owner", "Age", "State"],
        [
          ["STRIPE_KEY", "Fin-1", "24d", "OK"],
          ["JWT_SECRET", "Sec-1", "92d", "Rotate"],
        ],
      ),
    },
    {
      id: "logs", label: "Infra Logs", icon: Terminal,
      eyebrow: "Stream", title: "Infra Logs",
      description: "Structured stream across services.",
      kpis: [
        kpi("Lines/s", "1.4k", "", "default", Waves),
        kpi("Errors 5m", "18", "", "warning", XCircle),
        kpi("Retention", "30d", "", "premium", Lock),
        kpi("Cost 24h", "$14", "", "success", DollarSign),
      ],
      ...rows(
        ["Time", "Service", "Level", "Message"],
        [
          ["12:04:22", "api", "warn", "429 from downstream"],
          ["12:04:18", "worker", "info", "job DONE"],
        ],
      ),
    },
    {
      id: "incidents", label: "Incidents", icon: AlertTriangle,
      eyebrow: "Live", title: "Incidents",
      description: "Live and recent incidents with owner and severity.",
      kpis: [
        kpi("Open", "0", "", "success", CheckCircle2),
        kpi("Resolved 7d", "3", "", "premium", CheckCircle2),
        kpi("MTTR", "42m", "-8m", "success", Zap),
        kpi("Postmortems", "3", "published", "default", ScrollText),
      ],
      ...rows(
        ["ID", "Subject", "Severity", "State"],
        [
          ["INC-701", "Billing degraded EU", "SEV3", "Resolved"],
          ["INC-702", "Elevated 429s", "SEV2", "Resolved"],
        ],
      ),
    },
    {
      id: "health", label: "System Health", icon: Gauge,
      eyebrow: "Composite", title: "System Health",
      description: "Composite health score across the fleet.",
      kpis: [
        kpi("Composite", "97", "", "success", Gauge),
        kpi("Runtime", "99.98%", "", "success", ShieldCheck),
        kpi("Cost 24h", "$1,842", "-4%", "premium", DollarSign),
        kpi("Alerts", "2", "", "warning", Bell),
      ],
      ...rows(
        ["Pillar", "Score", "State"],
        [
          ["Availability", "99.98%", "Green"],
          ["Performance", "94%", "Green"],
          ["Cost", "97%", "Green"],
        ],
      ),
    },
  ],
};

/* ==================== DEV MANAGER ==================== */
const DEV: ManagerConfig = {
  id: "dev",
  label: "Dev Manager",
  icon: Code2,
  tagline: "Active tasks, blockers, capacity, SLA risk and team comms.",
  sections: [
    {
      id: "active", label: "Active Tasks", icon: Activity,
      eyebrow: "In Flight", title: "Active Dev Tasks",
      description: "Every dev task currently assigned or in progress.",
      kpis: [
        kpi("Active", "82", "", "default", Activity),
        kpi("In Progress", "48", "", "premium", Zap),
        kpi("On-Track", "88%", "", "success", CheckCircle2),
        kpi("At Risk", "6", "", "warning", AlertTriangle),
      ],
      ...rows(
        ["ID", "Title", "Owner", "State"],
        [
          ["DEV-101", "Order sync fix", "DEV-A1B2", "In Progress"],
          ["DEV-102", "Login rate limit", "DEV-C3D4", "Assigned"],
        ],
      ),
    },
    {
      id: "blocked", label: "Blocked", icon: XCircle,
      eyebrow: "Stuck", title: "Blocked Tasks",
      description: "Dev work blocked on dependency or decision.",
      kpis: [
        kpi("Blocked", "8", "", "destructive", XCircle),
        kpi("Awaiting Review", "4", "", "warning", ClipboardList),
        kpi("Waiting on Ops", "2", "", "warning", Server),
        kpi("Founder Call", "1", "", "premium", Bell),
      ],
      ...rows(
        ["ID", "Blocked By", "Age", "Owner"],
        [
          ["DEV-081", "PR review", "6h", "DEV-A1B2"],
          ["DEV-082", "Infra ticket", "1d", "DEV-C3D4"],
        ],
      ),
    },
    {
      id: "capacity", label: "Capacity", icon: Gauge,
      eyebrow: "Bandwidth", title: "Capacity Overview",
      description: "Per-engineer load, focus time & spare capacity.",
      kpis: [
        kpi("Utilization", "82%", "", "success", Gauge),
        kpi("Overload", "3", "engineers", "warning", TrendingUp),
        kpi("Focus Hrs", "6.2h", "avg", "premium", Clock),
        kpi("Spare", "12%", "", "default", Waves),
      ],
      ...rows(
        ["Engineer", "Load", "Focus", "State"],
        [
          ["DEV-A1B2", "92%", "6.4h", "Overload"],
          ["DEV-C3D4", "72%", "7.1h", "OK"],
        ],
      ),
    },
    {
      id: "performance", label: "Performance", icon: BarChart3,
      eyebrow: "Snapshot", title: "Performance Snapshot",
      description: "Shipping velocity, review turnaround, rework.",
      kpis: [
        kpi("Velocity", "48", "pts/wk", "success", TrendingUp),
        kpi("PR Review", "6h", "avg", "premium", Clock),
        kpi("Rework", "8%", "", "warning", XCircle),
        kpi("Bugs 30d", "12", "-4", "success", ShieldCheck),
      ],
      ...rows(
        ["Engineer", "Shipped", "Bugs", "Rework"],
        [
          ["DEV-A1B2", "18 PRs", "1", "4%"],
          ["DEV-C3D4", "22 PRs", "2", "9%"],
        ],
      ),
    },
    {
      id: "sla", label: "SLA Risk", icon: Radar,
      eyebrow: "Radar", title: "SLA Risk Alerts",
      description: "Dev deliverables at risk of breach.",
      kpis: [
        kpi("At Risk", "6", "", "warning", Radar),
        kpi("Breached 24h", "1", "", "destructive", XCircle),
        kpi("Auto-Escalated", "2", "", "premium", Bell),
        kpi("MTTR", "8h", "-1h", "success", Zap),
      ],
      ...rows(
        ["Task", "SLA", "Remaining", "Owner"],
        [
          ["DEV-101", "24h", "3h", "DEV-A1B2"],
          ["DEV-118", "8h", "-1h", "DEV-E5F6"],
        ],
      ),
    },
    {
      id: "escalations", label: "Escalations", icon: Bell,
      eyebrow: "Route", title: "Dev Escalations",
      description: "Cross-team escalations routed to engineering.",
      kpis: [
        kpi("Open", "4", "", "warning", Bell),
        kpi("From Support", "2", "", "default", LifeBuoy),
        kpi("From Legal", "1", "", "default", Scale),
        kpi("Resolved 7d", "9", "", "success", CheckCircle2),
      ],
      ...rows(
        ["ID", "From", "Subject", "Age"],
        [
          ["ESC-D01", "Support", "Payment failure", "3h"],
          ["ESC-D02", "Legal", "DPA update", "1d"],
        ],
      ),
    },
    {
      id: "comms", label: "Internal Comms", icon: MessageSquare,
      eyebrow: "Broadcast", title: "Internal Comms",
      description: "Team announcements & standup notes.",
      kpis: [
        kpi("Threads", "24", "active", "default", MessageSquare),
        kpi("Unread", "6", "", "warning", Inbox),
        kpi("Pinned", "4", "", "premium", Star),
        kpi("Announcements 7d", "3", "", "success", Radio),
      ],
      ...rows(
        ["Thread", "Author", "Updated"],
        [
          ["Release notes v4.2", "DEV-A1B2", "10m ago"],
          ["Sprint retro", "DEV-C3D4", "1h ago"],
        ],
      ),
    },
  ],
};

/* ==================== ASSIST MANAGER ==================== */
const ASSIST: ManagerConfig = {
  id: "assist",
  label: "Assist Manager",
  icon: Bot,
  tagline: "AI assist center — tools, prompts, memory and knowledge base.",
  sections: [
    {
      id: "overview", label: "Overview", icon: Gauge,
      eyebrow: "Now", title: "Assist Overview",
      description: "Assist volume, satisfaction and cost.",
      kpis: [
        kpi("Assists 24h", "4,812", "+12%", "success", Bot),
        kpi("CSAT", "4.6", "+0.2", "success", Star),
        kpi("Cost 24h", "$68", "", "premium", DollarSign),
        kpi("Errors", "0.4%", "", "warning", XCircle),
      ],
      ...rows(
        ["Surface", "Assists", "CSAT"],
        [
          ["Boss Panel", "1,842", "4.7"],
          ["Marketplace", "2,412", "4.5"],
          ["Support", "558", "4.6"],
        ],
      ),
    },
    {
      id: "prompts", label: "Prompts", icon: Sparkles,
      eyebrow: "Library", title: "Prompt Library",
      description: "Every prompt template with version and owner.",
      kpis: [
        kpi("Prompts", "128", "", "default", Sparkles),
        kpi("A/B Live", "6", "", "premium", Activity),
        kpi("Deprecated", "12", "", "warning", XCircle),
        kpi("Coverage", "94%", "", "success", ShieldCheck),
      ],
      primaryAction: "New Prompt",
      ...rows(
        ["Name", "Version", "Owner", "Usage 7d"],
        [
          ["lead_summary_v3", "v3", "AI-1", "12k"],
          ["support_triage_v2", "v2", "AI-2", "8k"],
        ],
      ),
    },
    {
      id: "tools", label: "Tools", icon: Wrench,
      eyebrow: "Actions", title: "Assist Tools",
      description: "Callable tools exposed to the AI.",
      kpis: [
        kpi("Tools", "42", "", "default", Wrench),
        kpi("Calls 24h", "8.4k", "", "premium", Zap),
        kpi("Errors", "0.2%", "", "warning", XCircle),
        kpi("Disabled", "2", "", "destructive", Lock),
      ],
      ...rows(
        ["Tool", "Calls", "Errors", "State"],
        [
          ["get_order", "3.2k", "0.1%", "Active"],
          ["issue_refund", "212", "0.4%", "Active"],
        ],
      ),
    },
    {
      id: "memory", label: "Memory", icon: BookOpen,
      eyebrow: "Context", title: "Memory Store",
      description: "Per-user and per-session memories.",
      kpis: [
        kpi("Users", "1,242", "", "default", Users),
        kpi("Entries", "18k", "", "default", FileText),
        kpi("Purges 7d", "42", "", "warning", XCircle),
        kpi("Retention", "180d", "", "premium", Lock),
      ],
      ...rows(
        ["User", "Entries", "Last"],
        [
          ["Founder", "184", "12m ago"],
          ["AE-1", "42", "1h ago"],
        ],
      ),
    },
    {
      id: "kb", label: "Knowledge Base", icon: BookOpen,
      eyebrow: "Corpus", title: "Knowledge Base",
      description: "Ingested docs, versions and coverage.",
      kpis: [
        kpi("Docs", "412", "", "default", FileText),
        kpi("Coverage", "88%", "", "success", ShieldCheck),
        kpi("Stale", "24", "re-index", "warning", Clock),
        kpi("New 7d", "12", "", "premium", TrendingUp),
      ],
      ...rows(
        ["Doc", "Version", "Updated"],
        [
          ["policies/refund.md", "v4", "2d ago"],
          ["playbook/onboarding.md", "v2", "6d ago"],
        ],
      ),
    },
    {
      id: "audit", label: "Reports & Audit", icon: ScrollText,
      eyebrow: "Trail", title: "Assist Reports & Audit",
      description: "Every assist logged with input, output and outcome.",
      kpis: [
        kpi("Actions 24h", "4,812", "", "default", Activity),
        kpi("Reports", "5", "ready", "success", FileText),
        kpi("Findings", "0", "", "success", CheckCircle2),
        kpi("Retention", "180d", "", "premium", Lock),
      ],
      ...rows(
        ["Report", "Period", "State"],
        [["CSAT report", "Dec 2024", "Ready"], ["Cost report", "Q4 2024", "Ready"]],
      ),
    },
  ],
};

/* ==================== EXPORT ==================== */

export const MANAGER_CONFIGS: Record<string, ManagerConfig> = {
  hr: HR,
  finance: FINANCE,
  marketing: MARKETING,
  lead: LEAD,
  "sales-support": SALES_SUPPORT,
  legal: LEGAL,
  performance: PERFORMANCE,
  task: TASK,
  seo: SEO,
  influencer: INFLUENCER,
  reseller: RESELLER,
  franchise: FRANCHISE,
  "product-demo": PRODUCT_DEMO,
  "api-ai": API_AI,
  server: SERVER,
  dev: DEV,
  assist: ASSIST,
};

export const MANAGER_ORDER: string[] = [
  "hr", "finance", "marketing", "lead", "sales-support", "legal", "performance",
  "task", "seo", "influencer", "reseller", "franchise", "product-demo",
  "api-ai", "server", "dev", "assist",
];
