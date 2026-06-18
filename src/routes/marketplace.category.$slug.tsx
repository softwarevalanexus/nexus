import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { products, categories } from "@/lib/marketplaceData";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";
import { ProductCard } from "@/components/marketplace/ProductCard";

export const Route = createFileRoute("/marketplace/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/marketplace/category/$slug" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cat = categories.find((c) => c.slug === slug);
  const list = products.filter((p) => p.categorySlug === slug);
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="px-6 py-8">
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-foreground">{cat?.name ?? slug}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{list.length} apps in this category</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
