import { useState } from "react";
import {
  Home, Grid3X3, AppWindow, Heart, Clock, CreditCard, ChevronLeft,
  Sparkles, Building2, Briefcase, Settings, Search, ShoppingCart, Bell, User,
  Store, Compass, Package, LifeBuoy, BarChart3,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface Props {
  open: boolean;
  onToggle: () => void;
}

// Storefront modules — previously the top bar tab strip, now part of the single sidebar.
const MODULES = [
  { label: "Marketplace", icon: Store },
  { label: "Browse", icon: Compass },
  { label: "My Apps", icon: AppWindow },
  { label: "Orders", icon: Package },
  { label: "Subscriptions", icon: CreditCard },
  { label: "Reseller", icon: Briefcase },
  { label: "Enterprise", icon: Building2 },
  { label: "Reports", icon: BarChart3 },
  { label: "Support", icon: LifeBuoy },
];

const items = [
  { label: "Home", icon: Home, key: "home" },
  { label: "Categories", icon: Grid3X3, key: "categories" },
  { label: "My Apps", icon: AppWindow, key: "apps" },
  { label: "Favorites", icon: Heart, key: "favorites" },
  { label: "Recently Used", icon: Clock, key: "recent" },
  { label: "Subscriptions", icon: CreditCard, key: "subs" },
  { label: "AI Picks", icon: Sparkles, key: "ai" },
  { label: "Enterprise", icon: Building2, key: "enterprise" },
  { label: "Reseller", icon: Briefcase, key: "reseller" },
  { label: "Settings", icon: Settings, key: "settings" },
];

export const MarketplaceSidebar = ({ open, onToggle }: Props) => {
  const [active, setActive] = useState("home");
  const [activeModule, setActiveModule] = useState("Marketplace");
  const [query, setQuery] = useState("");

  return (
    <aside
      data-testid="marketplace-sidebar"
      aria-label="Marketplace navigation"
      className={`fixed left-0 top-0 z-40 h-screen border-r border-border bg-background/90 backdrop-blur-xl transition-all duration-300 ${
        open ? "w-60" : "w-16"
      } overflow-hidden`}
    >
      <div className="flex h-full flex-col py-3">
        {/* Brand + collapse */}
        <div className="flex items-center gap-2 px-2.5">
          <BrandLogo variant="round" size={32} />
          {open && (
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-tight text-foreground">Software Vala</div>
              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Nexus Marketplace
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground ${
              open ? "" : "rotate-180"
            }`}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 px-2">
          {open ? (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-2.5 py-1.5 focus-within:border-cyan-400/40">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          ) : (
            <button
              className="flex h-9 w-full items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-2" data-testid="marketplace-sidebar-sections">
          {open && (
            <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Modules
            </p>
          )}
          {MODULES.map((m) => {
            const isActive = activeModule === m.label;
            return (
              <button
                key={m.label}
                onClick={() => setActiveModule(m.label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                } ${!open ? "justify-center" : ""}`}
                title={!open ? m.label : undefined}
              >
                <m.icon className="h-4 w-4 flex-shrink-0" />
                {open && <span className="truncate">{m.label}</span>}
              </button>
            );
          })}

          {open && (
            <p className="px-2 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Library
            </p>
          )}
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium shadow-[inset_0_0_0_1px_oklch(0.78_0.16_215/0.25)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                } ${!open ? "justify-center" : ""}`}
                title={!open ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Utilities (previously top-bar icons) */}
        <div className="mt-2 space-y-1 border-t border-border px-2 pt-2">
          <RailBtn label="Notifications" icon={Bell} badge={3} open={open} />
          <RailBtn label="Cart" icon={ShoppingCart} open={open} />
          <button
            className={`flex w-full items-center gap-3 rounded-lg border border-border bg-white/[0.03] px-2.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/5 ${
              !open ? "justify-center" : ""
            }`}
            title={!open ? "Sign In" : undefined}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-background">
              <User className="h-3.5 w-3.5" />
            </span>
            {open && <span>Sign In</span>}
          </button>
        </div>

        {open && (
          <div className="mx-2 mt-2 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-3 text-xs">
            <p className="font-semibold text-foreground">Software Vala™</p>
            <p className="mt-1 text-[10px] text-muted-foreground">12,000+ solutions, 2-hour delivery, lifetime updates.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

function RailBtn({
  label,
  icon: Icon,
  badge,
  open,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  open: boolean;
}) {
  return (
    <button
      aria-label={label}
      title={!open ? label : undefined}
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground ${
        !open ? "justify-center" : ""
      }`}
    >
      <span className="relative flex-shrink-0">
        <Icon className="h-4 w-4" />
        {badge != null && badge > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 px-1 text-[9px] font-bold text-background">
            {badge}
          </span>
        )}
      </span>
      {open && <span className="truncate">{label}</span>}
    </button>
  );
}
