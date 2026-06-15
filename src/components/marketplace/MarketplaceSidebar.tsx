import { useState } from "react";
import {
  Home, Grid3X3, AppWindow, Heart, Clock, CreditCard, ChevronLeft,
  Sparkles, Building2, Briefcase, Settings,
} from "lucide-react";

interface Props {
  open: boolean;
  onToggle: () => void;
}

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

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r border-border bg-background/85 backdrop-blur-xl transition-all duration-300 ${
        open ? "w-56" : "w-16"
      } overflow-hidden`}
    >
      <div className="flex h-full flex-col py-4">
        <button
          onClick={onToggle}
          className={`mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground ${
            open ? "" : "rotate-180"
          }`}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <nav className="flex-1 space-y-1 px-2">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary font-medium shadow-[inset_0_0_0_1px_oklch(0.78_0.16_215/0.25)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                } ${!open ? "justify-center" : ""}`}
                title={!open ? item.label : undefined}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {open && (
          <div className="mx-3 mt-2 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-3 text-xs">
            <p className="font-semibold text-foreground">Software Vala™</p>
            <p className="mt-1 text-[10px] text-muted-foreground">12,000+ solutions, 2-hour delivery, lifetime updates.</p>
          </div>
        )}
      </div>
    </aside>
  );
};
