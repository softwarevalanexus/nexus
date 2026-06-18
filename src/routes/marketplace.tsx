import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { ProductRow } from "@/components/marketplace/ProductRow";
import {
  IndustryGrid, CategoryStrip, AIZone, SuccessStories, AwardsRow,
  LiveActivity, ValaTV, Academy, PartnerEcosystem, FaqSection, EnterpriseCTA,
} from "@/components/marketplace/MarketplaceSections";
import { products } from "@/lib/marketplaceData";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Software Vala Nexus" },
      { name: "description", content: "Software Vala Marketplace — 12,000+ enterprise SaaS products across education, medical, hospitality, ecommerce, services, and manufacturing." },
      { property: "og:title", content: "Marketplace — Software Vala Nexus" },
      { property: "og:description", content: "Premium SaaS marketplace with instant 2-hour delivery, no advance payment, lifetime updates." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const featured = products.filter((p) => p.status === "featured" || p.rating >= 4.7).slice(0, 12);
  const trending = products.filter((p) => p.status === "trending").slice(0, 12);
  const topSelling = [...products].sort((a, b) => b.users - a.users).slice(0, 12);
  const newReleases = products.filter((p) => p.status === "new").slice(0, 12);

  const FOOTER = [
    { title: "Platform", items: [
      { l: "Browse Apps", h: "/marketplace" },
      { l: "Categories", h: "/marketplace/categories" },
      { l: "Industries", h: "/marketplace/industries" },
      { l: "Enterprise", h: "/marketplace/enterprise" },
    ]},
    { title: "Resources", items: [
      { l: "Documentation", h: "/marketplace/docs" },
      { l: "API Center", h: "/marketplace/api" },
      { l: "Academy", h: "/marketplace/academy" },
      { l: "Blog", h: "/marketplace/blog" },
    ]},
    { title: "Partners", items: [
      { l: "Reseller", h: "/marketplace/partner/reseller" },
      { l: "Vendor", h: "/marketplace/partner/vendor" },
      { l: "Franchise", h: "/marketplace/partner/franchise" },
      { l: "Affiliate", h: "/marketplace/partner/affiliate" },
    ]},
    { title: "Trust", items: [
      { l: "Trust Center", h: "/marketplace/trust" },
      { l: "Security", h: "/marketplace/security" },
      { l: "Compliance", h: "/marketplace/compliance" },
      { l: "Status", h: "/marketplace/status" },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <HeroBanner />

        <div className="py-4">
          {/* 01 — Featured */}
          <ProductRow title="Featured Software" products={featured} />

          {/* 02 — Shop by Industry */}
          <IndustryGrid />

          {/* 03 — Trending Now */}
          <ProductRow title="Trending Now" products={trending} />

          {/* 04 — Top Selling */}
          <ProductRow title="Top Selling" products={topSelling} />

          {/* 05 — New Releases */}
          <ProductRow title="New Releases" products={newReleases} />

          {/* 06 — Shop by Category */}
          <CategoryStrip />

          {/* Industry vertical rows */}
          <ProductRow title="Education Software" products={products.filter((p) => p.categorySlug === "education")} />
          <ProductRow title="Hospital & Medical" products={products.filter((p) => p.categorySlug === "medical")} />
          <ProductRow title="Hotel & Restaurant" products={products.filter((p) => p.categorySlug === "hotel")} />
          <ProductRow title="Ecommerce & Shops" products={products.filter((p) => p.categorySlug === "ecommerce")} />
          <ProductRow title="Service Providers" products={products.filter((p) => p.categorySlug === "services")} />
          <ProductRow title="Manufacturing" products={products.filter((p) => p.categorySlug === "manufacturing")} />

          {/* 07 — AI Zone */}
          <AIZone />

          {/* 08 — Success Stories */}
          <SuccessStories />

          {/* 09 — Awards & Champions */}
          <AwardsRow />

          {/* 10 — Live Marketplace Activity */}
          <LiveActivity />

          {/* 11 — Vala TV */}
          <ValaTV />

          {/* 12 — Vala Academy */}
          <Academy />

          {/* 13 — Partner Ecosystem */}
          <PartnerEcosystem />

          {/* 14 — FAQ */}
          <FaqSection />

          {/* 15 — Enterprise CTA */}
          <EnterpriseCTA />
        </div>

        {/* 16 — Footer */}
        <footer className="border-t border-border py-12">
          <div className="mx-auto max-w-[1440px] px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {FOOTER.map((col) => (
                <div key={col.title}>
                  <h4 className="mb-3 text-sm font-bold text-foreground">{col.title}</h4>
                  <div className="space-y-2">
                    {col.items.map((l) => (
                      <Link
                        key={l.l}
                        to={l.h as string}
                        className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.l}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">
                © 2026 Software Vala™. All rights reserved. Ultra Premium Enterprise Marketplace.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
