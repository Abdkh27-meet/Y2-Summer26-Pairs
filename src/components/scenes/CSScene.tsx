import { BinaryRainCanvas, ParticleField, FogLayer } from "../effects/ParticleEffects";

/**
 * CS scene — cyber workspace: dark navy with neon cyan/purple,
 * binary rain, circuit grid, terminal glow.
 */
export function CSScene({ parallax }: { parallax: { x: number; y: number } }) {
  const px = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(120% 90% at 70% 10%, #14224a 0%, #0a1230 50%, #050818 100%)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* neon grid floor */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "55%",
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: `perspective(420px) rotateX(62deg) translate3d(${parallax.x * -8}px, ${parallax.y * -8}px, 0)`,
          transformOrigin: "bottom",
          maskImage: "linear-gradient(180deg, transparent 0%, black 60%, black 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 60%, black 100%)",
        }}
      />
      {/* circuit lines */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ position: "absolute", top: "10%", left: 0, width: "100%", height: "40%", opacity: 0.35, ...px(-12) }}
      >
        <g stroke="#22d3ee" strokeWidth="1.5" fill="none">
          <path d="M0 80 H200 V40 H420 V120 H640 V60 H900 V140 H1200 V80 H1440" />
          <path d="M0 200 H160 V160 H380 V240 H620 V180 H880 V260 H1140 V200 H1440" />
          <circle cx="200" cy="80" r="4" fill="#22d3ee" />
          <circle cx="420" cy="40" r="4" fill="#a78bfa" />
          <circle cx="640" cy="120" r="4" fill="#22d3ee" />
          <circle cx="900" cy="60" r="4" fill="#a78bfa" />
          <circle cx="1200" cy="140" r="4" fill="#22d3ee" />
        </g>
      </svg>
      {/* floating code snippet cards */}
      {[
        { top: "16%", left: "8%", text: "const mentor = await help()", c: "#22d3ee" },
        { top: "30%", right: "10%", text: "function debug(error) { … }", c: "#a78bfa" },
        { top: "62%", left: "14%", text: "if (understood) ship();", c: "#22d3ee" },
      ].map((s, i) => (
        <div
          key={i}
          className="glass"
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            right: s.right,
            padding: "10px 14px",
            borderRadius: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: s.c,
            opacity: 0.5,
            animation: `floatUp ${20 + i * 5}s linear ${i * -6}s infinite`,
            ...px(-6),
          }}
        >
          {s.text}
        </div>
      ))}
      <FogLayer color="rgba(80,160,220,0.16)" />
      <BinaryRainCanvas density={26} color="rgba(120,220,255,0.75)" glow="rgba(80,200,255,0.4)" />
      <ParticleField count={18} color="rgba(34,211,238,0.9)" sizeRange={[1.5, 3]} driftRange={[10, 24]} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 45%, rgba(3,6,18,0.7) 100%)",
        }}
      />
    </div>
  );
}
