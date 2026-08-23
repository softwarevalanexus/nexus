import { useEffect, useMemo, useState } from "react";
import {
  Bell, Bot, ChevronDown, ChevronLeft, ChevronRight, CheckCheck, Command as CommandIcon,
  LogOut, KeySquare, Plus, Search, Settings, User as UserIcon,
} from "lucide-react";
import { SVLogo } from "./SVLogo";
import { AiChatPanel } from "./AiChatPanel";
import { SECTION_GROUPS, SECTIONS, type SectionId } from "./TopBar";

type NotifItem = { id: string; title: string; time: string; tone: "info" | "success" | "warning" };
const INITIAL_NOTIFS: NotifItem[] = [
  { id: "n1", title: "Homepage build deployed successfully", time: "just now", tone: "success" },
  { id: "n2", title: "3 products missing SEO description", time: "12m", tone: "warning" },
  { id: "n3", title: "New partner request from ByteForge", time: "1h", tone: "info" },
];

/**
 * Vertical command rail — replaces the former horizontal top bar.
 * All sections, quick actions, notifications, search and profile live here.
 */
export function MarketplaceManagerSidebar({
  active,
  onChange,
}: {
  active: SectionId;
  onChange: (id: SectionId) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTION_GROUPS.map((g) => [g.id, true])),
  );
  const [notifs, setNotifs] = useState<NotifItem[]>(INITIAL_NOTIFS);

  const activeSection = useMemo(() => SECTIONS.find((s) => s.id === active), [active]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest?.("[data-menu-root]")) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const q = query.trim().toLowerCase();
  const groups = SECTION_GROUPS.map((g) => ({
    ...g,
    items: q ? g.items.filter((it) => it.label.toLowerCase().includes(q)) : g.items,
  })).filter((g) => g.items.length > 0);

  const unread = notifs.length;

  return (
    <>
      <aside
        className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-[oklch(0.16_0.03_240/0.78)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />

        {/* Brand */}
        <div className="flex items-center gap-2 px-3 py-4">
          <SVLogo />
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Marketplace CMS
              </div>
              <div className="truncate text-sm font-bold text-foreground">Boss Console</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-2 pb-2">
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label="Search"
              className="grid h-9 w-full place-items-center rounded-lg border border-border bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-white/[0.04] px-2.5 py-1.5 focus-within:border-[oklch(0.80_0.13_192/0.35)]">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find section…"
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden shrink-0 items-center gap-1 rounded-md border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground xl:flex"
                aria-label="Open command palette"
              >
                <CommandIcon className="h-3 w-3" /> K
              </button>
            </div>
          )}
        </div>

        {/* Section nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2" aria-label="Manager sections">
          {groups.map((g) => {
            const open = q ? true : openGroups[g.id] !== false;
            return (
              <div key={g.id} className="mb-1">
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => setOpenGroups((s) => ({ ...s, [g.id]: !open }))}
                    className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    {g.label}
                  </button>
                )}
                {open && (
                  <div className="space-y-0.5">
                    {g.items.map((it) => {
                      const Icon = it.icon;
                      const isActive = it.id === active;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => onChange(it.id as SectionId)}
                          title={collapsed ? it.label : undefined}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-all ${
                            isActive
                              ? "bg-primary/15 text-foreground ring-1 ring-[oklch(0.80_0.13_192/0.30)]"
                              : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                          } ${collapsed ? "justify-center" : ""}`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-accent" : ""}`} />
                          {!collapsed && <span className="truncate">{it.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {groups.length === 0 && !collapsed && (
            <p className="px-2 py-3 text-[11px] text-muted-foreground">No section matches “{query}”.</p>
          )}
        </nav>

        {/* Footer utilities */}
        <div className="border-t border-border px-2 py-2">
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            title="Ask Vala AI"
            className={`mb-1.5 flex w-full items-center gap-2 rounded-lg border border-[oklch(0.80_0.13_192/0.30)] bg-[oklch(0.80_0.13_192/0.10)] px-2.5 py-2 text-[12px] font-semibold text-foreground transition-all hover:bg-[oklch(0.80_0.13_192/0.18)] ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Bot className="h-4 w-4 shrink-0 text-accent" />
            {!collapsed && <span>AI Chat</span>}
          </button>

          <button
            type="button"
            onClick={() => onChange("products")}
            title="Quick create"
            className={`mb-1.5 flex w-full items-center gap-2 rounded-lg border border-border bg-white/[0.04] px-2.5 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Quick create</span>}
          </button>

          <div data-menu-root className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setNotifOpen((v) => !v); setProfileOpen(false); }}
              title="Notifications"
              className={`mb-1.5 flex w-full items-center gap-2 rounded-lg border border-border bg-white/[0.04] px-2.5 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <span className="relative">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-3.5 min-w-[0.875rem] place-items-center rounded-full bg-accent px-1 font-mono text-[9px] font-bold text-accent-foreground">
                    {unread}
                  </span>
                )}
              </span>
              {!collapsed && <span>Notifications</span>}
            </button>
            {notifOpen && (
              <div className="absolute bottom-0 left-full z-50 ml-2 w-80 rounded-xl border border-border bg-[oklch(0.18_0.03_240/0.96)] p-1.5 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setNotifs([])}
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                </div>
                {notifs.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-muted-foreground">You’re all caught up.</p>
                ) : (
                  <div className="max-h-72 space-y-0.5 overflow-y-auto">
                    {notifs.map((n) => (
                      <div key={n.id} className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.05]">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            n.tone === "success" ? "bg-emerald-400" : n.tone === "warning" ? "bg-amber-400" : "bg-accent"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12px] font-semibold text-foreground">{n.title}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-1 border-t border-border pt-1">
                  <RailMenuItem
                    icon={Bell}
                    label="Open notifications center"
                    onClick={() => { onChange("notifications"); setNotifOpen(false); }}
                  />
                </div>
              </div>
            )}
          </div>

          <div data-menu-root className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setProfileOpen((v) => !v); setNotifOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg border border-border bg-white/[0.04] px-2 py-2 text-left transition-colors hover:bg-white/[0.08] ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-black text-primary-foreground">
                B
              </span>
              {!collapsed && (
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-foreground">Boss</span>
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {activeSection ? `${activeSection.groupLabel} · ${activeSection.label}` : "Production"}
                  </span>
                </span>
              )}
            </button>
            {profileOpen && (
              <div className="absolute bottom-0 left-full z-50 ml-2 w-56 rounded-xl border border-border bg-[oklch(0.18_0.03_240/0.96)] p-1.5 shadow-2xl backdrop-blur-2xl">
                <RailMenuItem icon={UserIcon} label="Profile" onClick={() => setProfileOpen(false)} />
                <RailMenuItem icon={Settings} label="Settings" onClick={() => { onChange("settings"); setProfileOpen(false); }} />
                <RailMenuItem icon={KeySquare} label="API keys" onClick={() => { onChange("api"); setProfileOpen(false); }} />
                <div className="my-1 h-px bg-border" />
                <RailMenuItem icon={LogOut} label="Sign out" onClick={() => setProfileOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </aside>

      {cmdOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-[oklch(0.18_0.03_240/0.97)] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="rounded-md px-2 py-0.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
              >
                ESC
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-1.5">
              {SECTIONS.filter((s) => !q || s.label.toLowerCase().includes(q)).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { onChange(s.id as SectionId); setCmdOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                >
                  <s.icon className="h-4 w-4" />
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="text-[10px] uppercase tracking-wider">{s.groupLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {chatOpen && <AiChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />}
    </>
  );
}

function RailMenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
