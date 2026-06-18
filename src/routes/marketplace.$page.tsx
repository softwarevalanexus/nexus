import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";

const PAGE_META: Record<string, { title: string; sub: string }> = {
  industries: { title: "All Industries", sub: "Pre-built suites for every sector" },
  categories: { title: "All Categories", sub: "Browse the full catalog by category" },
  ai: { title: "AI Zone", sub: "Copilots, finders, recommenders & automation" },
  stories: { title: "Success Stories", sub: "How customers are scaling on Software Vala" },
  awards: { title: "Awards & Champions", sub: "Best of the marketplace, every quarter" },
  tv: { title: "Vala TV", sub: "Live demos, walkthroughs and customer films" },
  academy: { title: "Vala Academy", sub: "Certifications, learning paths & exams" },
  partners: { title: "Partner Ecosystem", sub: "Become a vendor, reseller, franchise, author or affiliate" },
  enterprise: { title: "Enterprise", sub: "Custom SLAs, SSO, residency and white-glove migration" },
  trust: { title: "Trust & Security Center", sub: "Compliance, certifications and platform controls" },
  collections: { title: "Curated Collections", sub: "Hand-picked bundles by use case" },
  bundles: { title: "Bundles & Deals", sub: "Save more when you buy a complete stack" },
  deals: { title: "Live Deals", sub: "Flash offers, lifetime drops and seasonal pricing" },
  news: { title: "Marketplace News", sub: "Product launches, vendor spotlights and platform updates" },
  blog: { title: "Blog", sub: "Playbooks, deep dives and industry takes" },
  downloads: { title: "Downloads", sub: "Latest builds, SDKs and installer packages" },
  events: { title: "Events", sub: "Webinars, summits and partner days" },
  releases: { title: "Release Notes", sub: "Every shipped feature, fix and platform change" },
  roadmap: { title: "Roadmap", sub: "What we're building next, in the open" },
  knowledge: { title: "Knowledge Base", sub: "How-to guides and best practices" },
  support: { title: "Support Center", sub: "Tickets, contact and live chat" },
  docs: { title: "Documentation", sub: "Developer and admin documentation" },
  api: { title: "API Center", sub: "Reference, SDKs and webhooks" },
  security: { title: "Security Center", sub: "Vulnerability disclosure and security practices" },
  compliance: { title: "Compliance Center", sub: "ISO, SOC, GDPR, HIPAA posture" },
  status: { title: "Status Page", sub: "Real-time platform availability" },
};

export const Route = createFileRoute("/marketplace/$page")({
  head: ({ params }) => ({
    meta: [
      { title: `${PAGE_META[params.page]?.title ?? "Marketplace"} — Software Vala` },
      { name: "description", content: PAGE_META[params.page]?.sub ?? "Software Vala marketplace page." },
    ],
  }),
  component: GenericPage,
});

function GenericPage() {
  const { page } = useParams({ from: "/marketplace/$page" });
  const meta = PAGE_META[page] ?? { title: page.replace(/-/g, " "), sub: "Marketplace section" };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>
          <div className="mt-6 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[oklch(0.2_0.06_265)] to-[oklch(0.14_0.05_265)] p-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3 w-3" /> Coming Soon
            </div>
            <h1 className="mt-4 text-3xl font-bold capitalize text-foreground lg:text-4xl">{meta.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground lg:text-base">{meta.sub}</p>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-muted-foreground">
              <Construction className="h-4 w-4 text-amber-300" />
              This module is wired into the navigation and routed end-to-end. Full UI ships in the next pass.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
