import { useCallback, useRef, useState } from "react";
import roundAsset from "@/assets/softwarevala-round.asset.json";
import longAsset from "@/assets/softwarevala-long.asset.json";

/* ---------------- Effect catalog ---------------- */

type Particle = {
  id: number;
  x: number; // px from center
  y: number;
  rot: number;
  scale: number;
  hue?: string;
  glyph: string;
  dur: number;
  delay: number;
};

const COMMON_GLYPHS = [
  "❤️","💋","🫧","✨","💎","🦋","🌸","🌟","🎉","⚡","🔥","🚀","🪙","🏆","👑","🎁","🌈","💫","🎊","🕊️",
];
const CURRENCY_GLYPHS = ["$","€","£","¥","₹","₿","AED","SAR"];
const RARE_GLYPHS = ["👑","💎","🚀","🏆","🌎","✨"];

function pickEffect(): { glyphs: string[]; count: number; rare: boolean } {
  const roll = Math.random();
  // 1% rare
  if (roll < 0.01) {
    return { glyphs: [RARE_GLYPHS[Math.floor(Math.random() * RARE_GLYPHS.length)]], count: 15, rare: true };
  }
  // 20% currency rain (global business)
  if (roll < 0.21) {
    return { glyphs: CURRENCY_GLYPHS, count: 10, rare: false };
  }
  // default: pick one glyph, repeat it
  const g = COMMON_GLYPHS[Math.floor(Math.random() * COMMON_GLYPHS.length)];
  return { glyphs: [g], count: 8, rare: false };
}

function buildParticles(): Particle[] {
  const { glyphs, count } = pickEffect();
  const parts: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 60 + Math.random() * 80;
    parts.push({
      id: Math.random(),
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 20,
      rot: (Math.random() - 0.5) * 90,
      scale: 0.8 + Math.random() * 0.8,
      glyph: glyphs[i % glyphs.length],
      dur: 900 + Math.random() * 700,
      delay: Math.random() * 120,
    });
  }
  return parts;
}

/* ---------------- Component ---------------- */

type Props = {
  variant?: "round" | "long";
  size?: number; // px (round) or height (long)
  className?: string;
  ariaLabel?: string;
};

export function BrandLogo({ variant = "round", size, className = "", ariaLabel = "Software Vala" }: Props) {
  const [bursts, setBursts] = useState<{ id: number; particles: Particle[]; rare: boolean }[]>([]);
  const [pulse, setPulse] = useState(0);
  const counter = useRef(0);

  const trigger = useCallback(() => {
    counter.current += 1;
    const id = counter.current;
    const particles = buildParticles();
    const rare = Math.random() < 0.01;
    setBursts((b) => [...b, { id, particles, rare }]);
    setPulse((p) => p + 1);
    window.setTimeout(() => {
      setBursts((b) => b.filter((x) => x.id !== id));
    }, 1900);
  }, []);

  const isRound = variant === "round";
  const dim = size ?? (isRound ? 40 : 36);

  return (
    <button
      type="button"
      onClick={trigger}
      aria-label={ariaLabel}
      className={`group relative inline-flex shrink-0 select-none items-center justify-center overflow-visible outline-none ${className}`}
      style={isRound ? { width: dim, height: dim } : { height: dim }}
    >
      {/* expanding glow ring on click */}
      <span
        key={pulse}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          animation: pulse ? "sv-ring 900ms ease-out forwards" : "none",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 250 / 0.55), oklch(0.78 0.18 250 / 0) 70%)",
        }}
      />
      {/* idle aura */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-md transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 250 / 0.35), transparent 65%)",
          animation: "sv-breathe 4.5s ease-in-out infinite",
        }}
      />

      {/* logo image */}
      <span
        className="relative z-[1] inline-flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-[0.96]"
        style={{
          animation: pulse ? "sv-pulse 700ms cubic-bezier(.2,.8,.2,1)" : undefined,
        }}
      >
        {isRound ? (
          <img
            src={roundAsset.url}
            alt=""
            draggable={false}
            className="rounded-full ring-1 ring-white/15 shadow-[0_8px_24px_-8px_rgba(59,107,224,.55)]"
            style={{ width: dim, height: dim, objectFit: "cover" }}
          />
        ) : (
          <img
            src={longAsset.url}
            alt=""
            draggable={false}
            className="block drop-shadow-[0_6px_18px_rgba(59,107,224,.35)]"
            style={{ height: dim, width: "auto" }}
          />
        )}
      </span>

      {/* particle bursts */}
      {bursts.map((b) => (
        <span key={b.id} aria-hidden className="pointer-events-none absolute inset-0">
          {b.particles.map((p) => (
            <span
              key={p.id}
              className="absolute left-1/2 top-1/2 inline-block font-semibold"
              style={{
                fontSize: b.rare ? 22 : 16,
                transform: "translate(-50%, -50%)",
                animation: `sv-float ${p.dur}ms cubic-bezier(.2,.7,.2,1) ${p.delay}ms forwards`,
                ["--sv-x" as string]: `${p.x}px`,
                ["--sv-y" as string]: `${p.y}px`,
                ["--sv-rot" as string]: `${p.rot}deg`,
                ["--sv-scale" as string]: `${p.scale}`,
                textShadow:
                  "0 2px 8px rgba(0,0,0,0.35), 0 0 14px oklch(0.78 0.18 250 / 0.5)",
              }}
            >
              {p.glyph}
            </span>
          ))}
        </span>
      ))}

      <style>{`
        @keyframes sv-ring {
          0% { transform: scale(0.7); opacity: 0.9; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        @keyframes sv-pulse {
          0% { transform: scale(1); }
          35% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes sv-breathe {
          0%,100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes sv-float {
          0% { transform: translate(-50%, -50%) scale(0.4) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% {
            transform:
              translate(calc(-50% + var(--sv-x)), calc(-50% + var(--sv-y) - 30px))
              scale(var(--sv-scale))
              rotate(var(--sv-rot));
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
