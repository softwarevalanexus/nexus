import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";

const PARTNER: Record<string, { title: string; tagline: string; commission: string; benefits: string[]; requirements: string[] }> = {
  reseller: { title: "Reseller Program", tagline: "Sell premium software. Keep up to 40% recurring commission.", commission: "Up to 40%", benefits: ["White-label storefront", "Co-marketing kit", "Dedicated partner manager", "Monthly payouts"], requirements: ["Active business entity", "Sales pipeline of 20+ leads/mo", "Onboarding training"] },
  vendor: { title: "Vendor Program", tagline: "List your products. Reach 50,000+ buyers. Zero listing fees.", commission: "85% revenue share", benefits: ["Self-serve product publishing", "Built-in payments & licensing", "Reviews & analytics", "Global tax handling"], requirements: ["Verified company profile", "Production-ready product", "Support SLA commitment"] },
  franchise: { title: "Franchise Program", tagline: "Exclusive city/region rights. Full training. Marketing included.", commission: "Territory exclusive", benefits: ["Protected region", "Brand & lead support", "Implementation training", "Quarterly business reviews"], requirements: ["Local presence", "Capital investment", "5+ person team"] },
  author: { title: "Author Program", tagline: "Publish and monetise your software products on Software Vala.", commission: "70-85% royalties", benefits: ["Royalty payouts", "Storefront page", "Marketing boost", "Author analytics"], requirements: ["Original IP", "Documentation included", "Buyer support response < 24h"] },
  affiliate: { title: "Affiliate Program", tagline: "Share links. Earn on every sale. Real-time tracking.", commission: "10-25% per sale", benefits: ["Tracking dashboard", "Asset library", "Coupon codes", "Net-30 payouts"], requirements: ["Audience or traffic source", "Compliant promotion practices"] },
  implementation: { title: "Implementation Partner", tagline: "Deliver projects on Software Vala stack and earn recurring revenue.", commission: "Project + revenue share", benefits: ["Certified badge", "Lead routing", "Solution architects on-call", "Co-sell opportunities"], requirements: ["Certified team (min 3)", "2+ successful deployments", "SLA-backed support"] },
};

export const Route = createFileRoute("/marketplace/partner/$slug")({
  component: PartnerPage,
});

function PartnerPage() {
  const { slug } = useParams({ from: "/marketplace/partner/$slug" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const p = PARTNER[slug] ?? { title: slug, tagline: "Partner program", commission: "—", benefits: [], requirements: [] };
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>
          <div className="mt-6 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-[oklch(0.2_0.08_260)] via-[oklch(0.22_0.1_280)] to-[oklch(0.2_0.09_320)] p-10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">Partner Program</div>
            <h1 className="mt-2 text-3xl font-bold text-foreground lg:text-4xl">{p.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-foreground/85 lg:text-base">{p.tagline}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Commission: {p.commission}
            </div>
            <button className="ml-3 mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-background">
              Apply now <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-foreground">Benefits</h2>
              <ul className="mt-3 space-y-2 text-xs text-foreground/85">
                {p.benefits.map((b) => <li key={b} className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> {b}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-foreground">Requirements</h2>
              <ul className="mt-3 space-y-2 text-xs text-foreground/85">
                {p.requirements.map((b) => <li key={b} className="flex gap-2"><Check className="h-3.5 w-3.5 text-cyan-300" /> {b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
