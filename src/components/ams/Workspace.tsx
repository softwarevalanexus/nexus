// Enterprise workspace shell — every non-dashboard screen gets:
//   breadcrumb · back · related actions · next action · context rail.
// No business logic; pure presentation that creates operational flow.

import { ChevronRight, ArrowLeft, Home, ArrowRight, Bookmark, Share2 } from "lucide-react";
import type { ReactNode } from "react";

export interface WorkspaceProps {
  module: string;            // "Recognition"
  screen: string;            // "Badges"
  related?: string[];        // sibling screens within module
  next?: string;             // suggested next screen
  onJump: (label: string) => void;
  onHome: () => void;
  children: ReactNode;
}

export function Workspace({
  module, screen, related = [], next, onJump, onHome, children,
}: WorkspaceProps) {
  return (
    <div className="space-y-4">
      {/* operational top bar */}
      <div className="sticky top-[57px] z-20 -mx-6 border-b border-gold bg-[oklch(0.13_0.025_250/0.85)] px-6 py-2.5 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* breadcrumb */}
          <nav className="flex min-w-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.18em]">
            <button onClick={onHome} className="flex items-center gap-1 text-muted-foreground hover:text-[#f5d77a]">
              <Home className="h-3 w-3" /> AMS
            </button>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-muted-foreground">{module}</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="truncate font-semibold text-[#f5d77a]">{screen}</span>
          </nav>

          {/* operational actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onHome}
              className="inline-flex items-center gap-1.5 rounded-md border border-gold bg-[oklch(0.18_0.03_250)] px-2.5 py-1 text-[11px] text-muted-foreground hover:text-[#f5d77a]"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-gold bg-[oklch(0.18_0.03_250)] px-2.5 py-1 text-[11px] text-muted-foreground hover:text-[#f5d77a]"
              title="Bookmark this workspace"
            >
              <Bookmark className="h-3 w-3" /> Pin
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-gold bg-[oklch(0.18_0.03_250)] px-2.5 py-1 text-[11px] text-muted-foreground hover:text-[#f5d77a]"
              title="Share this view"
            >
              <Share2 className="h-3 w-3" /> Share
            </button>
            {next && (
              <button
                onClick={() => onJump(next)}
                className="inline-flex items-center gap-1.5 rounded-md bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-[oklch(0.13_0.025_250)] shadow-[0_6px_16px_-6px_#d4a14a]"
              >
                Next: {next} <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* related screens chip row */}
        {related.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Related</span>
            {related.map((r) => (
              <button
                key={r}
                onClick={() => onJump(r)}
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  r === screen
                    ? "border-[#f5d77a] bg-[oklch(0.78_0.14_82/0.15)] text-[#f5d77a]"
                    : "border-gold text-muted-foreground hover:text-[#f5d77a]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
