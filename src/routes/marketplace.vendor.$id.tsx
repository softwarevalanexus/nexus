import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, Star, ShieldCheck } from "lucide-react";
import { products } from "@/lib/marketplaceData";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";
import { ProductCard } from "@/components/marketplace/ProductCard";

export const Route = createFileRoute("/marketplace/vendor/$id")({
  component: VendorPage,
});

function VendorPage() {
  const { id } = useParams({ from: "/marketplace/vendor/$id" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const list = products.slice(0, 8);
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="px-6 py-8">
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500"><Building2 className="h-8 w-8 text-background" /></div>
            <div>
              <h1 className="text-2xl font-bold capitalize text-foreground">{id} Studios</h1>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-300" /> Verified vendor</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.8 · {list.length * 47} reviews</span>
                <span>{list.length} products</span>
              </div>
            </div>
          </div>

          <h2 className="mt-8 mb-4 text-lg font-bold text-foreground">Products by this vendor</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
