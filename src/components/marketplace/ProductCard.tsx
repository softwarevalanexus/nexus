import { useEffect, useState } from "react";
import { Eye, ShoppingCart, ShoppingBag, Heart, Star, Sparkles, Users, TrendingUp } from "lucide-react";
import type { Product } from "@/lib/marketplaceData";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [viewers, setViewers] = useState(12);

  const aiScore = Math.round(82 + (product.rating - 4) * 18);

  useEffect(() => {
    const t = setInterval(() => setViewers(8 + Math.floor(Math.random() * 40)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-fuchsia-500/0 to-cyan-500/0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:from-cyan-500/35 group-hover:via-fuchsia-500/25 group-hover:to-cyan-500/35 group-hover:opacity-100" />
      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-card to-[oklch(0.14_0.02_260)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-cyan-400/50 group-hover:shadow-[0_30px_60px_-20px_rgba(34,211,238,0.45),0_0_0_1px_rgba(34,211,238,0.25),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <span aria-hidden className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            {viewers} viewing
          </div>
          {hovered && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 backdrop-blur-sm animate-in fade-in duration-200">
              <button
                onClick={() => setIsFav(v => !v)}
                aria-pressed={isFav}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isFav ? "bg-primary text-primary-foreground" : "bg-card/90 text-muted-foreground hover:bg-primary hover:text-primary-foreground"}`}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                title="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          )}
          {product.status === "trending" && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-2 py-0.5 text-[10px] font-bold uppercase text-background shadow-lg">
              <TrendingUp className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {product.status === "new" && (
            <span className="absolute left-2 top-2 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase text-background">
              New
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-cyan-300">{product.category}</p>
            <span className="flex items-center gap-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-fuchsia-300">
              <Sparkles className="h-2.5 w-2.5" /> AI {aiScore}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-foreground truncate">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{product.shortDescription}</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-foreground">{product.rating.toFixed(1)}</span>
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" /> {product.users.toLocaleString()}
              </span>
            </div>
            <span className="text-sm font-bold text-foreground">${product.price}</span>
          </div>

          {hovered && (
            <div className="mt-3 flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.5)]">
                <Eye className="h-3.5 w-3.5" /> Details
              </button>
              <button className="group/cta relative flex flex-1 items-center justify-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 via-cyan-400 to-fuchsia-500 py-2 text-xs font-bold text-background shadow-[0_8px_24px_-8px_rgba(34,211,238,0.7)] transition-all hover:shadow-[0_12px_30px_-8px_rgba(34,211,238,0.9)]">
                <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
