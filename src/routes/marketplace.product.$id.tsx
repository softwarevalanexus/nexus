import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Star, Users, Download, ShieldCheck, Sparkles, Play, ShoppingCart,
  Heart, Share2, GitCompare, Check, Code2, Globe2, Layers, Calendar, Award,
  Hospital, Tv, MessageSquare, ChevronRight, Building2,
} from "lucide-react";
import { products } from "@/lib/marketplaceData";
import { MarketplaceTopbar } from "@/components/marketplace/MarketplaceTopbar";
import { MarketplaceSidebar } from "@/components/marketplace/MarketplaceSidebar";

export const Route = createFileRoute("/marketplace/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.id} — Software Vala Marketplace` },
      { name: "description", content: "Enterprise SaaS product details, features, pricing, reviews and live demo." },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = useParams({ from: "/marketplace/product/$id" });
  const product = products.find((p) => p.id === id) ?? products[0];
  const [tab, setTab] = useState<"overview" | "features" | "pricing" | "reviews" | "vendor">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceTopbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <MarketplaceSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/marketplace" className="hover:text-foreground">Marketplace</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/marketplace/category/$slug" params={{ slug: product.categorySlug }} className="hover:text-foreground">{product.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <Link to="/marketplace" className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
          </Link>

          {/* Hero */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[oklch(0.2_0.06_265)] to-[oklch(0.14_0.05_265)]">
              <img src={product.thumbnail} alt={product.name} className="h-[360px] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-background">AI Ready</span>
                <span className="rounded-md border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">{product.category}</div>
              <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span className="font-bold text-foreground">{product.rating.toFixed(1)}</span> <span className="text-muted-foreground">({product.reviews})</span></div>
                <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {product.users.toLocaleString()} active</div>
                <div className="flex items-center gap-1 text-muted-foreground"><Download className="h-3 w-3" /> {(product.users * 1.7).toFixed(0)} downloads</div>
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">${product.price}</span>
                {product.originalPrice && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}
                <span className="text-xs text-emerald-300">/ lifetime license</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 text-sm font-bold text-background shadow-[0_10px_30px_-10px_rgba(34,211,238,0.7)]">
                  <ShoppingCart className="h-4 w-4" /> Buy Now
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground hover:bg-white/10">
                  <Play className="h-4 w-4" /> Live Demo
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-foreground/80 hover:bg-white/10"><Heart className="h-3.5 w-3.5" /> Wishlist</button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-foreground/80 hover:bg-white/10"><GitCompare className="h-3.5 w-3.5" /> Compare</button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 text-[11px] text-muted-foreground">
                <Spec icon={Code2} label="Version" value="4.2.1" />
                <Spec icon={Calendar} label="Updated" value="2 days ago" />
                <Spec icon={Layers} label="License" value="Lifetime" />
                <Spec icon={Globe2} label="Platforms" value="Web · iOS · Android" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 flex gap-1 border-b border-white/5">
            {(["overview", "features", "pricing", "reviews", "vendor"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t}
                {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <h2 className="text-lg font-bold text-foreground">About {product.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                  <h3 className="mt-6 text-sm font-bold text-foreground">Modules included</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.modules.map((m) => (
                      <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-foreground/80">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <h3 className="text-sm font-bold text-foreground">Requirements</h3>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> PHP 8.2+ / Node 20+</li>
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> MySQL 8 / PostgreSQL 15</li>
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> 2 vCPU · 4 GB RAM minimum</li>
                  </ul>
                  <h3 className="mt-6 text-sm font-bold text-foreground">Integrations</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                    {["Stripe", "Twilio", "Zoom", "Slack", "Zapier", "OpenAI"].map((i) => (
                      <span key={i} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "features" && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.features.map((f) => (
                  <div key={f} className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <Sparkles className="h-4 w-4 flex-shrink-0 text-cyan-300" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{f}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">Production-ready, configurable, API exposed.</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "pricing" && (
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  { name: "Monthly", price: product.subscription.monthly, sub: "/ month", perks: ["1 domain", "Email support", "Auto updates"] },
                  { name: "Yearly", price: product.subscription.yearly, sub: "/ year", perks: ["1 domain", "Priority support", "Auto updates", "Save 20%"], highlight: true },
                  { name: "Lifetime", price: product.price, sub: "one-time", perks: ["Unlimited domains", "Lifetime updates", "24/7 support", "Source code"] },
                ].map((plan) => (
                  <div key={plan.name} className={`rounded-2xl border p-6 ${plan.highlight ? "border-cyan-400/40 bg-cyan-500/[0.05]" : "border-white/[0.07] bg-white/[0.02]"}`}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{plan.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.sub}</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-foreground/85">
                      {plan.perks.map((p) => <li key={p} className="flex gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> {p}</li>)}
                    </ul>
                    <button className={`mt-5 w-full rounded-xl py-2.5 text-sm font-bold ${plan.highlight ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-background" : "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"}`}>
                      Choose {plan.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-xs font-bold text-background">U{i}</div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Verified Buyer</div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                          <span className="ml-2">3 weeks ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-foreground/85">Outstanding product, replaced 4 tools in our stack and the team adopted it in days. Support is sharp and fast.</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "vendor" && (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500"><Building2 className="h-7 w-7 text-background" /></div>
                  <div>
                    <div className="text-lg font-bold text-foreground">Software Vala Studios</div>
                    <div className="text-xs text-muted-foreground">Verified vendor · 84 products · 4.8 avg rating</div>
                  </div>
                  <Link to="/marketplace/vendor/$id" params={{ id: "softwarevala" }} className="ml-auto rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20">View profile</Link>
                </div>
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-foreground">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-fuchsia-500" /> Related products
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r) => (
                  <Link key={r.id} to="/marketplace/product/$id" params={{ id: r.id }} className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-cyan-400/40">
                    <img src={r.thumbnail} alt={r.name} className="aspect-[16/10] w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="p-3">
                      <div className="text-xs text-cyan-300">{r.category}</div>
                      <div className="mt-1 text-sm font-bold text-foreground">{r.name}</div>
                      <div className="mt-1 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{r.rating.toFixed(1)}</span>
                        <span className="font-bold text-foreground">${r.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-cyan-300" />
      <div>
        <div className="text-[10px] uppercase tracking-wider">{label}</div>
        <div className="text-[12px] font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}
