import { useEffect, useRef } from "react";

/**
 * Canvas-based rainfall. Lightweight: a fixed number of drops recycled
 * as they fall past the viewport. Wind slants the rain.
 */
export function RainCanvas({
  density = 140,
  color = "rgba(180, 210, 255, 0.55)",
  wind = 1.4,
  speed = 9,
}: {
  density?: number;
  color?: string;
  wind?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Drop = { x: number; y: number; len: number; vy: number; vx: number; op: number };
    let drops: Drop[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: density }, () => makeDrop(true));
    };

    const makeDrop = (initial: boolean): Drop => {
      const len = 10 + Math.random() * 22;
      return {
        x: Math.random() * (w + 200) - 100,
        y: initial ? Math.random() * h : -20,
        len,
        vy: speed * (0.6 + Math.random() * 0.9),
        vx: wind * (0.6 + Math.random() * 0.7),
        op: 0.25 + Math.random() * 0.5,
      };
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = color;
      ctx.beginPath();
      for (const d of drops) {
        ctx.globalAlpha = d.op;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.vx * (d.len / speed), d.y + d.len);
        d.x += d.vx;
        d.y += d.vy;
        if (d.y > h + 20 || d.x > w + 120) {
          Object.assign(d, makeDrop(false));
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density, color, wind, speed]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Canvas-based "binary rain" — columns of falling characters (Matrix-style),
 * themed for the CS guide.
 */
export function BinaryRainCanvas({
  density = 28,
  color = "rgba(120, 220, 255, 0.7)",
  glow = "rgba(80, 200, 255, 0.35)",
}: {
  density?: number;
  color?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const chars = "01<>{}[]()=+-*/_#;:.,01アイウエオ";
    const fontSize = 14;
    let columns: { x: number; y: number; speed: number; chars: string[] }[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * -h,
        speed: 1 + Math.random() * 3,
        chars: Array.from({ length: 12 + Math.floor(Math.random() * 14) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ),
      }));
    };

    const tick = () => {
      ctx.fillStyle = "rgba(5, 8, 24, 0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
      for (const col of columns) {
        for (let i = 0; i < col.chars.length; i++) {
          const y = col.y - i * fontSize;
          if (y < -fontSize || y > h) continue;
          ctx.globalAlpha = i === 0 ? 1 : Math.max(0, 1 - i / col.chars.length);
          ctx.fillStyle = i === 0 ? "#ffffff" : color;
          if (i === 0) {
            ctx.shadowColor = glow;
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillText(col.chars[i], col.x, y);
        }
        col.y += col.speed;
        if (col.y - col.chars.length * fontSize > h) {
          col.y = -fontSize;
          col.x = Math.random() * w;
          col.chars = col.chars.map(() => chars[Math.floor(Math.random() * chars.length)]);
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density, color, glow]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.5,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Drifting particle field used for fireflies / pollen / sparks.
 */
export function ParticleField({
  count = 24,
  color = "rgba(255, 220, 130, 0.9)",
  sizeRange = [1.5, 4],
  driftRange = [8, 26],
}: {
  count?: number;
  color?: string;
  sizeRange?: [number, number];
  driftRange?: [number, number];
}) {
  const items = useRef(
    Array.from({ length: count }, (_, i) => {
      const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
      const drift = driftRange[0] + Math.random() * (driftRange[1] - driftRange[0]);
      const dur = 12 + Math.random() * 18;
      return {
        id: i,
        left: Math.random() * 100,
        top: 60 + Math.random() * 40,
        size,
        drift,
        dur,
        delay: -Math.random() * dur,
        glow: size > 2.5,
      };
    })
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      {items.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            boxShadow: p.glow ? `0 0 ${p.size * 4}px ${color}` : `0 0 ${p.size * 2}px ${color}`,
            animation: `floatUp ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Drifting maple leaves (or any SVG leaf) across the screen.
 */
export function LeafDrift({
  count = 10,
  color = "#c0473b",
  durationRange = [16, 30],
}: {
  count?: number;
  color?: string;
  durationRange?: [number, number];
}) {
  const leaves = useRef(
    Array.from({ length: count }, (_, i) => {
      const dur = durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]);
      return {
        id: i,
        top: 10 + Math.random() * 70,
        scale: 0.5 + Math.random() * 0.9,
        dur,
        delay: -Math.random() * dur,
        hue: Math.random() > 0.5 ? color : "#e0825a",
      };
    })
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      {leaves.map((l) => (
        <svg
          key={l.id}
          viewBox="0 0 32 32"
          style={{
            position: "absolute",
            top: `${l.top}%`,
            left: "-5%",
            width: 22 * l.scale,
            height: 22 * l.scale,
            animation: `drift ${l.dur}s linear ${l.delay}s infinite`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        >
          <path
            fill={l.hue}
            d="M16 2c3 5 9 7 9 14a9 9 0 1 1-18 0c0-7 6-9 9-14z"
          />
          <path
            d="M16 8v18M16 14l4-3M16 14l-4-3M16 20l5-3M16 20l-5-3"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}

/** Moving fog bands at the bottom of a scene. */
export function FogLayer({ color = "rgba(120,140,180,0.18)" }: { color?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: `${i * 14 - 6}%`,
            left: "-30%",
            width: "160%",
            height: `${30 - i * 6}%`,
            background: `radial-gradient(60% 100% at 50% 100%, ${color}, transparent 70%)`,
            filter: "blur(20px)",
            animation: `fogDrift ${28 + i * 10}s ease-in-out ${i * -6}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

/** Water ripple rings at the bottom of a rainy scene. */
export function WaterRipples({ color = "rgba(180,210,255,0.5)" }: { color?: string }) {
  const ripples = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 8 + Math.random() * 84,
      bottom: 4 + Math.random() * 14,
      dur: 4 + Math.random() * 3,
      delay: -Math.random() * 6,
    }))
  ).current;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            left: `${r.left}%`,
            bottom: `${r.bottom}%`,
            width: 40,
            height: 12,
            border: `1px solid ${color}`,
            borderRadius: "50%",
            opacity: 0,
            animation: `ripple ${r.dur}s ease-out ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
