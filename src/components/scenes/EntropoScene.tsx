import { ParticleField, LeafDrift, FogLayer } from "../effects/ParticleEffects";

/**
 * Entropo scene — innovation meets nature.
 * Growing vines, blueprint overlays, light rays, leaf particles.
 */
export function EntropoScene({ parallax }: { parallax: { x: number; y: number } }) {
  const px = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(120% 90% at 30% 20%, #16331f 0%, #0c2014 50%, #06120c 100%)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(224,179,65,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(224,179,65,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(80% 60% at 60% 30%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(80% 60% at 60% 30%, black 0%, transparent 80%)",
          ...px(-10),
        }}
      />
      {/* moving light rays */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-10%",
            left: `${20 + i * 22}%`,
            width: 120,
            height: "130%",
            background:
              "linear-gradient(180deg, rgba(224,179,65,0.18) 0%, transparent 90%)",
            transform: `rotate(${10 + i * 4}deg)`,
            filter: "blur(8px)",
            animation: `fogDrift ${18 + i * 4}s ease-in-out ${i * -5}s infinite alternate`,
          }}
        />
      ))}
      {/* vines climbing */}
      <svg
        viewBox="0 0 200 600"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: "4%", bottom: 0, width: 120, height: "70%", ...px(-6) }}
      >
        <path
          d="M100 600 C 60 500, 140 420, 80 340 C 130 260, 70 180, 110 100 C 90 60, 110 30, 100 0"
          stroke="#2f6f4e"
          strokeWidth="4"
          fill="none"
          opacity="0.6"
        />
        {[
          [120, 470],
          [70, 380],
          [130, 290],
          [80, 200],
          [115, 110],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <path
              d="M0 0 C 14 -8, 22 4, 10 14 C -4 8, -8 -2, 0 0 Z"
              fill="#3f8a5c"
              opacity="0.8"
            />
          </g>
        ))}
      </svg>
      <svg
        viewBox="0 0 200 600"
        preserveAspectRatio="none"
        style={{ position: "absolute", right: "6%", bottom: 0, width: 120, height: "65%", ...px(-4) }}
      >
        <path
          d="M100 600 C 140 500, 70 420, 130 340 C 80 260, 140 180, 100 100"
          stroke="#276244"
          strokeWidth="3"
          fill="none"
          opacity="0.5"
        />
      </svg>
      {/* floating business-diagram doodles */}
      <svg
        viewBox="0 0 200 200"
        style={{
          position: "absolute",
          top: "18%",
          right: "12%",
          width: 160,
          height: 160,
          opacity: 0.4,
          animation: "floatUp 22s linear infinite",
          ...px(-12),
        }}
      >
        <circle cx="40" cy="40" r="22" stroke="#e0b341" strokeWidth="2" fill="none" />
        <circle cx="140" cy="60" r="18" stroke="#e0b341" strokeWidth="2" fill="none" />
        <circle cx="100" cy="140" r="20" stroke="#e0b341" strokeWidth="2" fill="none" />
        <line x1="40" y1="40" x2="140" y2="60" stroke="#e0b341" strokeWidth="1.5" />
        <line x1="40" y1="40" x2="100" y2="140" stroke="#e0b341" strokeWidth="1.5" />
        <line x1="140" y1="60" x2="100" y2="140" stroke="#e0b341" strokeWidth="1.5" />
      </svg>
      <FogLayer color="rgba(120,200,150,0.14)" />
      <LeafDrift count={6} color="#3f8a5c" durationRange={[18, 30]} />
      <ParticleField count={20} color="rgba(224,179,65,0.9)" sizeRange={[1.5, 3.5]} driftRange={[8, 22]} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 45%, rgba(4,12,8,0.65) 100%)",
        }}
      />
    </div>
  );
}
