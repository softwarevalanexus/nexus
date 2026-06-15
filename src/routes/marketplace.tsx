import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { ProductRow } from "@/components/marketplace/ProductRow";
import { products, sections } from "@/lib/marketplaceData";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Software Vala Nexus" },
      {
        name: "description",
        content:
          "Software Vala Marketplace — 12,000+ enterprise SaaS products across education, medical, hospitality, ecommerce, services, and manufacturing.",
      },
      { property: "og:title", content: "Marketplace — Software Vala Nexus" },
      {
        property: "og:description",
        content: "Premium SaaS marketplace with instant 2-hour delivery, no advance payment, lifetime updates.",
      },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <HeroBanner />

        <div className="py-4">
          {sections.map((section) => {
            const filtered = products.filter(section.filter);
            return <ProductRow key={section.title} title={section.title} products={filtered} />;
          })}
        </div>

        <footer className="border-t border-border py-12">
          <div className="mx-auto max-w-[1440px] px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { title: "Platform", items: ["Browse Apps", "Categories", "Pricing", "Enterprise"] },
                { title: "Resources", items: ["Documentation", "API Reference", "Tutorials", "Blog"] },
                { title: "Company", items: ["About", "Careers", "Partners", "Contact"] },
                { title: "Legal", items: ["Privacy", "Terms", "Security", "Compliance"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="mb-3 text-sm font-bold text-foreground">{col.title}</h4>
                  <div className="space-y-2">
                    {col.items.map((l) => (
                      <p
                        key={l}
                        className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-xs text-muted-foreground">
                © 2026 Software Vala. All rights reserved. Ultra Premium Software Marketplace.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
