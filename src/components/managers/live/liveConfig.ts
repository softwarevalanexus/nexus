import {
  AlertTriangle,
  Building2,
  ClipboardCheck,
  Coins,
  FileCheck2,
  Gauge,
  LifeBuoy,
  Map as MapIcon,
  Percent,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Live (database-backed) manager configuration.
 *
 * Every section below maps 1:1 to a real table in Lovable Cloud. Rows are read
 * with the app's Supabase client and created / edited / deleted through the same
 * client — there is no mock data and no simulated API in this path.
 */

export type FieldType = "text" | "number" | "money" | "percent" | "date" | "select" | "ref";

export type LiveField = {
  key: string;
  label: string;
  type: FieldType;
  /** Options for `select` fields. */
  options?: string[];
  /** For `ref` fields: the table + label column to resolve the foreign key. */
  refTable?: string;
  refLabel?: string;
  required?: boolean;
  /** Hidden in the create/edit form (read-only, derived, or system columns). */
  readOnly?: boolean;
  default?: string | number;
};

export type LiveKpi = {
  label: string;
  icon: LucideIcon;
  /** count = number of rows; sum/avg operate on `field`; countWhere counts matches. */
  kind: "count" | "sum" | "avg" | "countWhere";
  field?: string;
  match?: string;
  format?: "money" | "percent" | "number";
  tone?: "up" | "down" | "flat";
};

export type LiveSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  table: string;
  orderBy: { column: string; ascending?: boolean };
  primaryAction: string;
  /** Columns shown in the table (in order). */
  fields: LiveField[];
  kpis: LiveKpi[];
  /** Quick status filter chips built from this column. */
  filterField?: string;
};

export type LiveManagerConfig = {
  id: string;
  label: string;
  tagline: string;
  sections: LiveSection[];
};

const TIERS = ["Bronze", "Silver", "Gold", "Platinum"];
const REGIONS = ["NA", "EMEA", "APAC", "LATAM", "MEA"];

/* ------------------------------- Reseller -------------------------------- */

const RESELLER: LiveManagerConfig = {
  id: "reseller",
  label: "Reseller Manager",
  tagline:
    "Live reseller channel — roster, applications, payouts, support and compliance, all backed by the database.",
  sections: [
    {
      id: "roster",
      label: "Active Resellers",
      icon: Users,
      eyebrow: "Roster",
      title: "Reseller Roster",
      description: "Every signed reseller across tiers and regions, read live from the channel database.",
      table: "resellers",
      orderBy: { column: "mrr_cents", ascending: false },
      primaryAction: "New reseller",
      filterField: "status",
      fields: [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Company", type: "text", required: true },
        { key: "tier", label: "Tier", type: "select", options: TIERS, default: "Silver" },
        { key: "region", label: "Region", type: "select", options: REGIONS, default: "APAC", required: true },
        { key: "country", label: "Country", type: "text" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Onboarding", "Suspended", "Churned"],
          default: "Active",
        },
        { key: "mrr_cents", label: "MRR", type: "money" },
        { key: "growth_pct", label: "Growth", type: "percent" },
        { key: "contact_email", label: "Contact email", type: "text" },
        { key: "contact_phone", label: "Contact phone", type: "text" },
        { key: "onboarded_at", label: "Onboarded", type: "date" },
      ],
      kpis: [
        { label: "Resellers", icon: Users, kind: "count" },
        { label: "Active", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Active" },
        { label: "Channel MRR", icon: Wallet, kind: "sum", field: "mrr_cents", format: "money" },
        { label: "Avg growth", icon: Percent, kind: "avg", field: "growth_pct", format: "percent" },
      ],
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileCheck2,
      eyebrow: "Onboarding",
      title: "Reseller Applications",
      description: "Inbound reseller applications with reviewer decisions and notes.",
      table: "reseller_applications",
      orderBy: { column: "submitted_at", ascending: false },
      primaryAction: "New application",
      filterField: "status",
      fields: [
        { key: "code", label: "Ref", type: "text", required: true },
        { key: "company", label: "Company", type: "text", required: true },
        { key: "region", label: "Region", type: "select", options: REGIONS, default: "APAC" },
        { key: "tier_requested", label: "Tier requested", type: "select", options: TIERS, default: "Silver" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["Review", "Approved", "Rejected", "Withdrawn"],
          default: "Review",
        },
        { key: "reviewer_notes", label: "Reviewer notes", type: "text" },
        { key: "submitted_at", label: "Submitted", type: "date" },
      ],
      kpis: [
        { label: "Applications", icon: FileCheck2, kind: "count" },
        { label: "In review", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "Review" },
        { label: "Approved", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Approved" },
        { label: "Rejected", icon: AlertTriangle, kind: "countWhere", field: "status", match: "Rejected", tone: "down" },
      ],
    },
    {
      id: "payouts",
      label: "Commissions",
      icon: Coins,
      eyebrow: "Finance",
      title: "Reseller Commissions & Payouts",
      description: "Commission runs per reseller and period with settlement state.",
      table: "reseller_payouts",
      orderBy: { column: "period", ascending: false },
      primaryAction: "New payout",
      filterField: "status",
      fields: [
        { key: "reseller_id", label: "Reseller", type: "ref", refTable: "resellers", refLabel: "name", required: true },
        { key: "period", label: "Period", type: "text", required: true },
        { key: "amount_cents", label: "Amount", type: "money" },
        { key: "status", label: "Status", type: "select", options: ["Pending", "Approved", "Paid", "Failed"], default: "Pending" },
        { key: "paid_at", label: "Paid on", type: "date" },
      ],
      kpis: [
        { label: "Payout records", icon: Coins, kind: "count" },
        { label: "Total value", icon: Wallet, kind: "sum", field: "amount_cents", format: "money" },
        { label: "Paid", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Paid" },
        { label: "Pending", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "Pending" },
      ],
    },
    {
      id: "support",
      label: "Support",
      icon: LifeBuoy,
      eyebrow: "Service",
      title: "Reseller Support Queue",
      description: "Partner-raised tickets with priority and lifecycle state.",
      table: "reseller_tickets",
      orderBy: { column: "opened_at", ascending: false },
      primaryAction: "New ticket",
      filterField: "status",
      fields: [
        { key: "reseller_id", label: "Reseller", type: "ref", refTable: "resellers", refLabel: "name", required: true },
        { key: "subject", label: "Subject", type: "text", required: true },
        { key: "priority", label: "Priority", type: "select", options: ["Low", "Normal", "High", "Critical"], default: "Normal" },
        { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
        { key: "opened_at", label: "Opened", type: "date" },
      ],
      kpis: [
        { label: "Tickets", icon: LifeBuoy, kind: "count" },
        { label: "Open", icon: AlertTriangle, kind: "countWhere", field: "status", match: "Open", tone: "down" },
        { label: "In progress", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "In Progress" },
        { label: "Resolved", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Resolved", tone: "up" },
      ],
    },
    {
      id: "compliance",
      label: "Compliance",
      icon: ShieldCheck,
      eyebrow: "Policy",
      title: "Reseller Compliance",
      description: "Channel policy checks per reseller with audit outcomes.",
      table: "reseller_compliance",
      orderBy: { column: "checked_at", ascending: false },
      primaryAction: "New check",
      filterField: "state",
      fields: [
        { key: "reseller_id", label: "Reseller", type: "ref", refTable: "resellers", refLabel: "name", required: true },
        { key: "rule", label: "Rule", type: "text", required: true },
        { key: "state", label: "State", type: "select", options: ["Pass", "At Risk", "Fail"], default: "Pass" },
        { key: "notes", label: "Notes", type: "text" },
        { key: "checked_at", label: "Checked", type: "date" },
      ],
      kpis: [
        { label: "Checks", icon: ClipboardCheck, kind: "count" },
        { label: "Passing", icon: ShieldCheck, kind: "countWhere", field: "state", match: "Pass", tone: "up" },
        { label: "At risk", icon: AlertTriangle, kind: "countWhere", field: "state", match: "At Risk" },
        { label: "Failing", icon: AlertTriangle, kind: "countWhere", field: "state", match: "Fail", tone: "down" },
      ],
    },
  ],
};

/* ------------------------------- Franchise ------------------------------- */

const FRANCHISE: LiveManagerConfig = {
  id: "franchise",
  label: "Franchise Manager",
  tagline:
    "Live franchise network — outlets, applications, royalties, territories, escalations and staff from the database.",
  sections: [
    {
      id: "active",
      label: "Active Franchises",
      icon: Building2,
      eyebrow: "Network",
      title: "Franchise Network",
      description: "Every live franchise with locations, revenue and royalty terms.",
      table: "franchises",
      orderBy: { column: "mrr_cents", ascending: false },
      primaryAction: "New franchise",
      filterField: "status",
      fields: [
        { key: "code", label: "Code", type: "text", required: true },
        { key: "name", label: "Franchise", type: "text", required: true },
        { key: "region", label: "Region", type: "select", options: REGIONS, default: "APAC", required: true },
        { key: "city", label: "City", type: "text" },
        { key: "country", label: "Country", type: "text" },
        { key: "locations", label: "Locations", type: "number", default: 1 },
        { key: "mrr_cents", label: "MRR", type: "money" },
        { key: "royalty_pct", label: "Royalty", type: "percent", default: 8 },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Onboarding", "Probation", "Terminated"],
          default: "Active",
        },
        { key: "owner_name", label: "Owner", type: "text" },
        { key: "owner_email", label: "Owner email", type: "text" },
        { key: "opened_at", label: "Opened", type: "date" },
      ],
      kpis: [
        { label: "Franchises", icon: Building2, kind: "count" },
        { label: "Locations", icon: MapIcon, kind: "sum", field: "locations", format: "number" },
        { label: "Network MRR", icon: Wallet, kind: "sum", field: "mrr_cents", format: "money" },
        { label: "Avg royalty", icon: Percent, kind: "avg", field: "royalty_pct", format: "percent" },
      ],
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileCheck2,
      eyebrow: "Pipeline",
      title: "Franchise Applications",
      description: "Prospective franchisees, planned investment and decision state.",
      table: "franchise_applications",
      orderBy: { column: "submitted_at", ascending: false },
      primaryAction: "New application",
      filterField: "status",
      fields: [
        { key: "code", label: "Ref", type: "text", required: true },
        { key: "applicant", label: "Applicant", type: "text", required: true },
        { key: "territory", label: "Territory", type: "text", required: true },
        { key: "investment_cents", label: "Investment", type: "money" },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["Review", "Approved", "Rejected", "Withdrawn"],
          default: "Review",
        },
        { key: "submitted_at", label: "Submitted", type: "date" },
      ],
      kpis: [
        { label: "Applications", icon: FileCheck2, kind: "count" },
        { label: "In review", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "Review" },
        { label: "Approved", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Approved", tone: "up" },
        { label: "Pipeline value", icon: Wallet, kind: "sum", field: "investment_cents", format: "money" },
      ],
    },
    {
      id: "royalties",
      label: "Royalties",
      icon: Coins,
      eyebrow: "Finance",
      title: "Royalty Ledger",
      description: "Gross sales and royalty due per franchise and period.",
      table: "franchise_royalties",
      orderBy: { column: "period", ascending: false },
      primaryAction: "New royalty run",
      filterField: "status",
      fields: [
        { key: "franchise_id", label: "Franchise", type: "ref", refTable: "franchises", refLabel: "name", required: true },
        { key: "period", label: "Period", type: "text", required: true },
        { key: "gross_cents", label: "Gross sales", type: "money" },
        { key: "royalty_cents", label: "Royalty due", type: "money" },
        { key: "status", label: "Status", type: "select", options: ["Due", "Invoiced", "Paid", "Overdue"], default: "Due" },
        { key: "due_date", label: "Due", type: "date" },
      ],
      kpis: [
        { label: "Royalty records", icon: Coins, kind: "count" },
        { label: "Royalty value", icon: Wallet, kind: "sum", field: "royalty_cents", format: "money" },
        { label: "Paid", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Paid", tone: "up" },
        { label: "Due", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "Due" },
      ],
    },
    {
      id: "territories",
      label: "Territories",
      icon: MapIcon,
      eyebrow: "Coverage",
      title: "Territory Map",
      description: "Territory allocation, exclusivity and open white-space.",
      table: "franchise_territories",
      orderBy: { column: "population", ascending: false },
      primaryAction: "New territory",
      filterField: "status",
      fields: [
        { key: "name", label: "Territory", type: "text", required: true },
        { key: "region", label: "Region", type: "select", options: REGIONS, default: "APAC", required: true },
        { key: "country", label: "Country", type: "text" },
        { key: "exclusivity", label: "Exclusivity", type: "select", options: ["Exclusive", "Non-exclusive"], default: "Exclusive" },
        { key: "franchise_id", label: "Assigned to", type: "ref", refTable: "franchises", refLabel: "name" },
        { key: "population", label: "Population", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Open", "Reserved", "Assigned", "Blocked"], default: "Open" },
      ],
      kpis: [
        { label: "Territories", icon: MapIcon, kind: "count" },
        { label: "Assigned", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Assigned", tone: "up" },
        { label: "Open", icon: Gauge, kind: "countWhere", field: "status", match: "Open" },
        { label: "Population", icon: Users, kind: "sum", field: "population", format: "number" },
      ],
    },
    {
      id: "escalations",
      label: "Escalations",
      icon: AlertTriangle,
      eyebrow: "Risk",
      title: "Franchise Escalations",
      description: "Operational, brand and SLA escalations across the network.",
      table: "franchise_escalations",
      orderBy: { column: "opened_at", ascending: false },
      primaryAction: "New escalation",
      filterField: "status",
      fields: [
        { key: "franchise_id", label: "Franchise", type: "ref", refTable: "franchises", refLabel: "name", required: true },
        { key: "issue", label: "Issue", type: "text", required: true },
        { key: "severity", label: "Severity", type: "select", options: ["Low", "Medium", "High", "Critical"], default: "Medium" },
        { key: "status", label: "Status", type: "select", options: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
        { key: "opened_at", label: "Opened", type: "date" },
      ],
      kpis: [
        { label: "Escalations", icon: AlertTriangle, kind: "count" },
        { label: "Open", icon: AlertTriangle, kind: "countWhere", field: "status", match: "Open", tone: "down" },
        { label: "Critical", icon: AlertTriangle, kind: "countWhere", field: "severity", match: "Critical", tone: "down" },
        { label: "Resolved", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Resolved", tone: "up" },
      ],
    },
    {
      id: "staff",
      label: "Staff",
      icon: Users,
      eyebrow: "People",
      title: "Franchise Staff",
      description: "Owners and staff mapped to each franchise.",
      table: "franchise_staff",
      orderBy: { column: "joined_at", ascending: false },
      primaryAction: "New staff member",
      filterField: "status",
      fields: [
        { key: "franchise_id", label: "Franchise", type: "ref", refTable: "franchises", refLabel: "name", required: true },
        { key: "name", label: "Name", type: "text", required: true },
        { key: "role", label: "Role", type: "text", default: "Associate" },
        { key: "status", label: "Status", type: "select", options: ["Active", "On Leave", "Exited"], default: "Active" },
        { key: "joined_at", label: "Joined", type: "date" },
      ],
      kpis: [
        { label: "Staff", icon: Users, kind: "count" },
        { label: "Active", icon: ShieldCheck, kind: "countWhere", field: "status", match: "Active", tone: "up" },
        { label: "On leave", icon: ClipboardCheck, kind: "countWhere", field: "status", match: "On Leave" },
        { label: "Exited", icon: AlertTriangle, kind: "countWhere", field: "status", match: "Exited" },
      ],
    },
  ],
};

export const LIVE_MANAGERS: Record<string, LiveManagerConfig> = {
  reseller: RESELLER,
  franchise: FRANCHISE,
};
