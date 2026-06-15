import { useState } from "react";
import { Search, ShoppingCart, Bell, Menu, User } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface Props {
  onToggleSidebar: () => void;
}

// Sub-modules surfaced in the top bar (per single-sidebar rule)
const MODULES = [
  "Marketplace",
  "Browse",
  "My Apps",
  "Orders",
  "Subscriptions",
  "Reseller",
  "Enterprise",
  "Reports",
  "Support",
];

export const MarketplaceTopbar = ({ onToggleSidebar }: Props) => {
  const [active, setActive] = useState("Marketplace");
  const [query, setQuery] = useState("");

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center gap-3 px-3 lg:px-5">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 pr-2">
          <BrandLogo variant="round" size={36} />
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-tight text-foreground">
              Software Vala
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Nexus Marketplace
            </div>
          </div>
        </div>

        {/* Module tabs — sub-modules live here, not in a second sidebar */}
        <nav className="mp-hide-scrollbar hidden flex-1 overflow-x-auto md:block">
          <ul className="flex items-center gap-1">
            {MODULES.map((m) => {
              const isActive = active === m;
              return (
                <li key={m}>
                  <button
                    onClick={() => setActive(m)}
                    className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-[6px] h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search */}
        <div className="ml-auto flex flex-1 max-w-md items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-1.5 backdrop-blur-md focus-within:border-cyan-400/40 md:flex-none md:w-64 lg:w-80">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 12,000+ products…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
            ⌘K
          </kbd>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <IconBtn label="Notifications" badge={3}>
            <Bell className="h-4.5 w-4.5" />
          </IconBtn>
          <IconBtn label="Cart" badge={0}>
            <ShoppingCart className="h-4.5 w-4.5" />
          </IconBtn>
          <button className="ml-1 flex h-9 items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-white/5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-background">
              <User className="h-3.5 w-3.5" />
            </span>
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

function IconBtn({
  children,
  label,
  badge,
}: {
  children: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
    >
      {children}
      {badge != null && badge > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 px-1 text-[9px] font-bold text-background">
          {badge}
        </span>
      )}
    </button>
  );
}
