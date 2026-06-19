import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare, Search, Send, Paperclip, Smile, Mic, Phone, Video,
  MoreVertical, Shield, CheckCheck, Globe, Sparkles, Inbox, Users,
  Hash, Star, Pin, Archive, Bell, Plus, X, ChevronRight, IdCard,
  Languages, Bot, Filter, Settings2,
} from "lucide-react";
import { ME } from "@/lib/ams-data";

type ConvId = string;
type Conversation = {
  id: ConvId;
  partnerId: string;        // searchable Software Vala ID
  role: string;             // Vendor / Partner / Boss / etc
  module: string;           // current module scope
  unread: number;
  pinned?: boolean;
  online?: boolean;
};

// NO mock messages — empty by default. Real data flows in from the chat engine.
const INITIAL_CONVERSATIONS: Conversation[] = [];

type Message = {
  id: string;
  from: "me" | "them" | "system";
  text: string;
  at: number;
  status?: "sent" | "delivered" | "read";
};

const ROLE_FILTERS = [
  "All", "Boss", "Developer", "QA", "Support", "Sales", "Finance",
  "Marketing", "Author", "Vendor", "Reseller", "Affiliate", "Influencer",
  "Franchise", "Customer", "Employee",
];

// ──────────────────────────────────────────────────────────────
// Premium Enterprise Chat — Software Vala
// ──────────────────────────────────────────────────────────────
export function ChatScreen() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<ConvId | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [messagesByConv, setMessagesByConv] = useState<Record<ConvId, Message[]>>({});
  const [showNew, setShowNew] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (filter !== "All" && c.role !== filter) return false;
      if (query && !c.partnerId.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [conversations, filter, query]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId],
  );
  const messages = active ? messagesByConv[active.id] ?? [] : [];

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, activeId]);

  function send() {
    const text = composer.trim();
    if (!text || !active) return;
    const m: Message = { id: crypto.randomUUID(), from: "me", text, at: Date.now(), status: "sent" };
    setMessagesByConv((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), m] }));
    setComposer("");
  }

  function startConversation(partnerId: string, role: string) {
    const exists = conversations.find((c) => c.partnerId === partnerId);
    if (exists) { setActiveId(exists.id); setShowNew(false); return; }
    const conv: Conversation = {
      id: crypto.randomUUID(),
      partnerId,
      role,
      module: "AMS",
      unread: 0,
      online: true,
    };
    setConversations((c) => [conv, ...c]);
    setMessagesByConv((m) => ({
      ...m,
      [conv.id]: [{
        id: crypto.randomUUID(),
        from: "system",
        text: `Secure channel established with ${partnerId}. End-to-end audited · Permission validated.`,
        at: Date.now(),
      }],
    }));
    setActiveId(conv.id);
    setShowNew(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gold-frame relative overflow-hidden rounded-2xl">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[oklch(0.78_0.14_82/0.18)] blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_10px_30px_-8px_#d4a14a]">
              <MessageSquare className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">
                <Sparkles className="h-3 w-3" /> Enterprise Communication Engine
              </div>
              <h1 className="mt-1 font-display text-3xl font-semibold text-gold-gradient md:text-4xl">
                Software Vala Chat
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                One centralized, permission-aware chat across every dashboard, role and module. Signed in as{" "}
                <span className="text-[#f5d77a]">{ME.passportId}</span> · {ME.tier}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill icon={Shield} label="E2E Audited" />
            <Pill icon={Globe} label="125 Languages" />
            <Pill icon={Bot} label="AI Ready" />
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="gold-frame grid h-[calc(100vh-280px)] min-h-[640px] grid-cols-[320px_1fr_320px] overflow-hidden rounded-2xl">
        {/* ─── Sidebar: Conversations ─── */}
        <aside className="flex min-h-0 flex-col border-r border-gold bg-[oklch(0.12_0.025_250)]">
          <div className="border-b border-gold p-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4a14a]">Inbox</div>
              <button
                onClick={() => setShowNew(true)}
                className="grid h-7 w-7 place-items-center rounded-md bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_6px_18px_-6px_#d4a14a] transition-transform hover:scale-105"
                title="New conversation"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-2">
              <Search className="h-3.5 w-3.5 text-[#d4a14a]" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Software Vala ID…"
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* Role filter */}
          <div className="flex gap-1 overflow-x-auto border-b border-gold/60 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all ${
                  filter === r
                    ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]"
                    : "text-muted-foreground hover:bg-[oklch(0.78_0.14_82/0.1)] hover:text-[#f5d77a]"
                }`}
              >{r}</button>
            ))}
          </div>

          {/* Conversation list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <EmptyInbox onNew={() => setShowNew(true)} />
            ) : filtered.length === 0 ? (
              query
                ? <EmptySearch query={query} onClear={() => setQuery("")} onNew={() => setShowNew(true)} />
                : <EmptyFilter role={filter} onReset={() => setFilter("All")} />
            ) : (
              filtered.map((c) => (
                <ConversationRow
                  key={c.id} conv={c} active={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                />
              ))
            )}

          </div>

          {/* Footer presence */}
          <div className="border-t border-gold p-3">
            <div className="flex items-center gap-3 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] p-2.5">
              <div className="relative">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-[10px] font-bold text-[oklch(0.13_0.025_250)]">
                  {ME.initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[oklch(0.12_0.025_250)] bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-[#f5d77a]">{ME.name}</div>
                <div className="truncate text-[10px] text-muted-foreground">{ME.passportId}</div>
              </div>
              <button className="text-muted-foreground hover:text-[#f5d77a]"><Settings2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </aside>

        {/* ─── Conversation Stage ─── */}
        <section className="flex min-h-0 flex-col bg-[oklch(0.10_0.022_250)]">
          {active ? (
            <>
              {/* Conversation header */}
              <div className="flex items-center justify-between border-b border-gold bg-[oklch(0.13_0.025_250)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-[oklch(0.13_0.025_250)]">
                      {active.partnerId.slice(-2)}
                    </div>
                    {active.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[oklch(0.13_0.025_250)] bg-emerald-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-[#f5d77a]">{active.partnerId}</span>
                      <span className="rounded-full border border-gold px-2 py-[1px] text-[9px] uppercase tracking-[0.2em] text-[#d4a14a]">{active.role}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Shield className="h-3 w-3 text-emerald-400" /> Permission validated · Module {active.module}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn icon={Phone} />
                  <IconBtn icon={Video} />
                  <IconBtn icon={Languages} />
                  <IconBtn icon={Pin} />
                  <IconBtn icon={Bell} />
                  <IconBtn icon={MoreVertical} />
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollerRef} className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6">
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #f5d77a 0%, transparent 40%), radial-gradient(circle at 80% 80%, #d4a14a 0%, transparent 40%)" }}
                />
                {messages.length === 0 ? (
                  <EmptyConversation partnerId={active.partnerId} />
                ) : (
                  <div className="relative space-y-3">
                    {messages.map((m) => <MessageBubble key={m.id} m={m} />)}
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3">
                <div className="flex items-end gap-2 rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)] p-2 shadow-[inset_0_1px_0_oklch(0.78_0.14_82/0.15)] focus-within:shadow-[0_0_0_2px_oklch(0.78_0.14_82/0.35)]">
                  <IconBtn icon={Paperclip} small />
                  <IconBtn icon={Smile} small />
                  <textarea
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder={`Message ${active.partnerId}…`}
                    rows={1}
                    className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
                  />
                  <IconBtn icon={Mic} small />
                  <button
                    onClick={send}
                    disabled={!composer.trim()}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <Send className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Shield className="h-3 w-3 text-emerald-400" /> Audited · End-to-end · Scope: {active.module}</span>
                  <span>Enter to send · Shift+Enter for newline</span>
                </div>
              </div>
            </>
          ) : (
            <EmptyStage onNew={() => setShowNew(true)} />
          )}
        </section>

        {/* ─── Right rail: Context ─── */}
        <aside className="hidden min-h-0 flex-col border-l border-gold bg-[oklch(0.12_0.025_250)] lg:flex">
          {active ? <ContextPanel conv={active} /> : <ContextEmpty />}
        </aside>
      </div>

      {/* New Conversation Modal */}
      {showNew && <NewConversationModal onClose={() => setShowNew(false)} onStart={startConversation} />}
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────

function Pill({ icon: Icon, label }: { icon: typeof Shield; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5d77a]">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function IconBtn({ icon: Icon, small }: { icon: typeof Phone; small?: boolean }) {
  const s = small ? "h-8 w-8" : "h-9 w-9";
  return (
    <button className={`grid ${s} place-items-center rounded-lg text-muted-foreground transition-all hover:bg-[oklch(0.78_0.14_82/0.12)] hover:text-[#f5d77a]`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ConversationRow({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
        active
          ? "bg-[oklch(0.78_0.14_82/0.14)] shadow-[inset_0_0_0_1px_oklch(0.78_0.14_82/0.45)]"
          : "hover:bg-[oklch(0.78_0.14_82/0.06)]"
      }`}
    >
      <div className="relative">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-[11px] font-bold text-[oklch(0.13_0.025_250)]">
          {conv.partnerId.slice(-2)}
        </div>
        {conv.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[oklch(0.12_0.025_250)] bg-emerald-400" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`truncate text-xs font-semibold ${active ? "text-[#f5d77a]" : "text-foreground"}`}>{conv.partnerId}</span>
          {conv.pinned && <Pin className="h-3 w-3 text-[#d4a14a]" />}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="rounded border border-gold/60 px-1.5 py-[1px] text-[9px] uppercase tracking-[0.16em] text-[#d4a14a]">{conv.role}</span>
          <span className="truncate text-[10px] text-muted-foreground">{conv.module}</span>
        </div>
      </div>
      {conv.unread > 0 && (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-gradient px-1.5 text-[10px] font-bold text-[oklch(0.13_0.025_250)]">{conv.unread}</span>
      )}
    </button>
  );
}

function MessageBubble({ m }: { m: Message }) {
  if (m.from === "system") {
    return (
      <div className="flex justify-center">
        <span className="rounded-full border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#d4a14a]">
          <Shield className="mr-1.5 inline h-3 w-3 text-emerald-400" />{m.text}
        </span>
      </div>
    );
  }
  const mine = m.from === "me";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] ${
          mine
            ? "bg-gold-gradient text-[oklch(0.13_0.025_250)] rounded-br-md"
            : "border border-gold bg-[oklch(0.16_0.03_250)] text-foreground rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-[oklch(0.13_0.025_250)]/70" : "text-muted-foreground"}`}>
          <span>{new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {mine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}

function EmptyInbox({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-[oklch(0.78_0.14_82/0.25)] blur-2xl" />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)] shadow-[inset_0_1px_0_oklch(0.78_0.14_82/0.25)]">
          <Inbox className="h-7 w-7 text-[#f5d77a]" />
        </div>
      </div>
      <div className="mt-4 font-display text-sm font-semibold text-[#f5d77a]">No conversations yet</div>
      <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-muted-foreground">
        Your inbox is empty. Search a Software Vala ID to open your first permission-validated channel.
      </p>
      <button onClick={onNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a] transition-transform hover:scale-105">
        <Plus className="h-3 w-3" strokeWidth={2.8} /> New conversation
      </button>
      <div className="mt-5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-[#d4a14a]">
        <Shield className="h-2.5 w-2.5" /> End-to-end · Audited
      </div>
    </div>
  );
}

function EmptySearch({ query, onClear, onNew }: { query: string; onClear: () => void; onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)]">
        <Search className="h-6 w-6 text-[#f5d77a]" />
      </div>
      <div className="mt-3 font-display text-sm font-semibold text-[#f5d77a]">No matches</div>
      <p className="mt-1 max-w-[230px] text-[11px] leading-relaxed text-muted-foreground">
        No conversation in your inbox matches <span className="text-[#f5d77a]">"{query}"</span>.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button onClick={onClear} className="rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5d77a] hover:bg-[oklch(0.78_0.14_82/0.12)]">
          Clear search
        </button>
        <button onClick={onNew} className="rounded-lg bg-gold-gradient px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a]">
          Start with this ID
        </button>
      </div>
    </div>
  );
}

function EmptyFilter({ role, onReset }: { role: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)]">
        <Filter className="h-6 w-6 text-[#f5d77a]" />
      </div>
      <div className="mt-3 font-display text-sm font-semibold text-[#f5d77a]">No {role.toLowerCase()} conversations</div>
      <p className="mt-1 max-w-[230px] text-[11px] leading-relaxed text-muted-foreground">
        You don't have any open channels with the <span className="text-[#f5d77a]">{role}</span> role yet.
      </p>
      <button onClick={onReset} className="mt-4 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5d77a] hover:bg-[oklch(0.78_0.14_82/0.12)]">
        Show all roles
      </button>
    </div>
  );
}

function EmptyConversation({ partnerId }: { partnerId: string }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-sm text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 m-auto rounded-full bg-[oklch(0.78_0.14_82/0.25)] blur-2xl" />
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_14px_36px_-10px_#d4a14a]">
            <MessageSquare className="h-8 w-8" strokeWidth={2.4} />
          </div>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-gold-gradient">Channel ready</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Secure channel opened with <span className="text-[#f5d77a]">{partnerId}</span>. No messages yet — send the first one to start the conversation.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-[#d4a14a]">
          <Shield className="h-2.5 w-2.5 text-emerald-400" /> Permission validated · Audited
        </div>
      </div>
    </div>
  );
}

function EmptyStage({ onNew }: { onNew: () => void }) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #f5d77a 0%, transparent 50%), radial-gradient(circle at 70% 70%, #d4a14a 0%, transparent 50%)" }} />
      <div className="relative max-w-md px-6 text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 m-auto rounded-full bg-[oklch(0.78_0.14_82/0.3)] blur-3xl" />
          <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_20px_60px_-10px_#d4a14a]">
            <MessageSquare className="h-10 w-10" strokeWidth={2.2} />
          </div>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-gold-gradient">Select a conversation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a channel from your inbox or open a new one. Conversations are scoped to your current role, module and permissions automatically.
        </p>
        <button onClick={onNew} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-[oklch(0.13_0.025_250)] shadow-[0_10px_30px_-10px_#d4a14a] transition-transform hover:scale-105">
          <Plus className="h-4 w-4" strokeWidth={2.6} /> New Conversation
        </button>
        <div className="mt-6 grid grid-cols-3 gap-2 text-[9px] uppercase tracking-[0.2em] text-[#d4a14a]">
          <div className="rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] py-2"><Shield className="mx-auto h-3 w-3" /><div className="mt-1">E2E Audited</div></div>
          <div className="rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] py-2"><Globe className="mx-auto h-3 w-3" /><div className="mt-1">125 Languages</div></div>
          <div className="rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] py-2"><Bot className="mx-auto h-3 w-3" /><div className="mt-1">AI Ready</div></div>
        </div>
      </div>
    </div>
  );
}


function ContextEmpty() {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div>
        <Users className="mx-auto h-8 w-8 text-[#d4a14a]" />
        <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Conversation context appears here
        </div>
      </div>
    </div>
  );
}

function ContextPanel({ conv }: { conv: Conversation }) {
  return (
    <div className="flex min-h-0 flex-col">
      <div className="border-b border-gold p-5 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold-gradient text-sm font-bold text-[oklch(0.13_0.025_250)] shadow-[0_12px_30px_-10px_#d4a14a]">
          {conv.partnerId.slice(-2)}
        </div>
        <div className="mt-3 font-display text-base font-semibold text-[#f5d77a]">{conv.partnerId}</div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#d4a14a]">{conv.role}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 text-xs">
        <SectionLabel icon={IdCard} label="Identity" />
        <KV k="Software Vala ID" v={conv.partnerId} />
        <KV k="Role" v={conv.role} />
        <KV k="Module Scope" v={conv.module} />
        <KV k="Permission" v="Validated" accent />

        <SectionLabel icon={Hash} label="Channel" className="mt-5" />
        <KV k="Encryption" v="End-to-end" accent />
        <KV k="Audit" v="Enabled" accent />
        <KV k="Language" v="Auto-translate" />

        <SectionLabel icon={Star} label="Quick Actions" className="mt-5" />
        <div className="grid grid-cols-2 gap-2">
          <QuickAction icon={Pin} label="Pin" />
          <QuickAction icon={Archive} label="Archive" />
          <QuickAction icon={Bell} label="Mute" />
          <QuickAction icon={Filter} label="Rules" />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, label, className = "" }: { icon: typeof Hash; label: string; className?: string }) {
  return (
    <div className={`mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#d4a14a] ${className}`}>
      <Icon className="h-3 w-3" /> {label}
    </div>
  );
}

function KV({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gold/40 py-2">
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{k}</span>
      <span className={`text-[11px] font-semibold ${accent ? "text-emerald-400" : "text-foreground"}`}>{v}</span>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof Pin; label: string }) {
  return (
    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f5d77a] transition-all hover:bg-[oklch(0.78_0.14_82/0.12)]">
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

// ─── New Conversation Modal: search by Software Vala ID ───
function NewConversationModal({ onClose, onStart }: { onClose: () => void; onStart: (id: string, role: string) => void }) {
  const [id, setId] = useState("");
  const [role, setRole] = useState("Employee");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, []);

  const valid = id.trim().length >= 3;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[oklch(0.08_0.02_250/0.7)] p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl border border-gold bg-[oklch(0.13_0.025_250)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-gold px-5 py-4">
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-[#f5d77a]" />
            <div className="font-display text-sm font-semibold text-gold-gradient">Start a new conversation</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-[#f5d77a]"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#d4a14a]">Software Vala ID</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-2">
              <Search className="h-3.5 w-3.5 text-[#d4a14a]" />
              <input
                ref={inputRef} value={id} onChange={(e) => setId(e.target.value.toUpperCase())}
                placeholder="e.g. SV-EMP-00421 · SV-VEN-1820 · SV-BOSS-001"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                onKeyDown={(e) => { if (e.key === "Enter" && valid) onStart(id.trim(), role); }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">Search by ID only — no email, no mobile, no personal profile.</p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#d4a14a]">Role Scope</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ROLE_FILTERS.slice(1).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                  role === r ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]"
                  : "border border-gold/60 text-muted-foreground hover:text-[#f5d77a]"
                }`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] p-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2 text-[#f5d77a]"><Shield className="h-3.5 w-3.5" /> Permission Validation</div>
            <p className="mt-1">A secure channel is created only after the recipient and your role permissions are validated.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-gold bg-[oklch(0.12_0.025_250)] px-5 py-3">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">Cancel</button>
          <button
            disabled={!valid}
            onClick={() => onStart(id.trim(), role)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Open Channel <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
