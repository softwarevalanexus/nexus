import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/marketplaceData";

interface Props {
  title: string;
  products: Product[];
}

export const ProductRow = ({ title, products }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -800 : 800, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="px-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground lg:text-2xl">
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-md transition-all hover:-translate-x-0.5 hover:scale-110 hover:border-cyan-400/40 hover:bg-white/10 hover:text-foreground hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.55)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-md transition-all hover:translate-x-0.5 hover:scale-110 hover:border-cyan-400/40 hover:bg-white/10 hover:text-foreground hover:shadow-[0_0_22px_-6px_rgba(34,211,238,0.55)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        <div
          ref={scrollRef}
          className="mp-hide-scrollbar grid auto-cols-[calc(50%-10px)] grid-flow-col gap-5 overflow-x-auto scroll-smooth px-6 pb-4 sm:auto-cols-[calc(33.333%-14px)] lg:auto-cols-[calc(25%-15px)]"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
