import {
  RainCanvas,
  ParticleField,
  LeafDrift,
  FogLayer,
  WaterRipples,
} from "../effects/ParticleEffects";

/**
 * Shared scene used on the landing page: rainy Japanese evening with
 * mountains, rooftops, lanterns, fireflies, fog, and water ripples.
 * Parallax is driven by mouse position via CSS variables on the root.
 */
export function LandingScene({ parallax }: { parallax: { x: number; y: number } }) {
  const px = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(120% 90% at 50% 10%, #1a2150 0%, #0c1336 45%, #060920 100%)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* moon glow */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "16%",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,235,200,0.95) 0%, rgba(245,235,200,0.2) 40%, transparent 70%)",
          filter: "blur(2px)",
          ...px(-22),
        }}
      />
      {/* distant mountains */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "26%", left: 0, width: "100%", height: "32%", ...px(-14) }}
      >
        <path
          d="M0 400 L0 230 L120 150 L260 220 L380 120 L520 210 L660 140 L820 230 L980 160 L1140 240 L1280 170 L1440 250 L1440 400 Z"
          fill="#1a2247"
          opacity="0.85"
        />
        <path
          d="M0 400 L0 290 L160 240 L320 300 L460 250 L620 320 L780 260 L940 320 L1080 270 L1240 330 L1440 280 L1440 400 Z"
          fill="#11183a"
          opacity="0.9"
        />
      </svg>

      {/* midground hills with maple trees */}
      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "18%", left: 0, width: "100%", height: "24%", ...px(-8) }}
      >
        <path
          d="M0 300 L0 200 Q200 140 400 180 T800 170 T1200 190 T1440 170 L1440 300 Z"
          fill="#0c1430"
        />
        {/* maple trees silhouettes */}
        {[
          [120, 150],
          [340, 130],
          [620, 145],
          [900, 130],
          [1180, 150],
        ].map(([x, h], i) => (
          <g key={i} transform={`translate(${x},200)`}>
            <rect x="-2" y="-30" width="4" height="40" fill="#0a1024" />
            <path
              d={`M0 -${h} C 18 -${h - 10}, 26 -${h * 0.6}, 14 -${h * 0.4} C 30 -${h * 0.5}, 22 -10, 0 -16 C -22 -10, -30 -${h * 0.5}, -14 -${h * 0.4} C -26 -${h * 0.6}, -18 -${h - 10}, 0 -${h} Z`}
              fill="#3a1f2e"
            />
          </g>
        ))}
      </svg>

      {/* traditional rooftops */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "12%", left: 0, width: "100%", height: "18%", ...px(-5) }}
      >
        <g fill="#0a0f24">
          {[
            [80, 60],
            [240, 80],
            [420, 50],
            [640, 90],
            [860, 60],
            [1080, 80],
            [1280, 55],
          ].map(([x, h], i) => (
            <g key={i} transform={`translate(${x},160)`}>
              <path d={`M0 0 L40 -${h} L120 -${h} L160 0 Z`} />
              <rect x="20" y="-20" width="120" height="20" opacity="0.6" />
            </g>
          ))}
        </g>
      </svg>

      {/* lantern glows */}
      {[
        { left: "18%", bottom: "22%" },
        { left: "72%", bottom: "20%" },
        { left: "46%", bottom: "24%" },
      ].map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: l.left,
            bottom: l.bottom,
            width: 10,
            height: 14,
            borderRadius: "40% 40% 50% 50%",
            background: "radial-gradient(circle, #ffd27a 0%, #e0823a 60%, transparent 100%)",
            boxShadow: "0 0 28px 12px rgba(255,180,90,0.55)",
            animation: `flicker ${3 + i}s ease-in-out ${i * -1.2}s infinite`,
            ...px(-4),
          }}
        />
      ))}

      <FogLayer color="rgba(140,160,210,0.22)" />
      <RainCanvas density={150} color="rgba(190,215,255,0.5)" wind={1.6} speed={9} />
      <WaterRipples color="rgba(190,215,255,0.4)" />
      <LeafDrift count={8} color="#c0473b" />
      <ParticleField count={22} color="rgba(255,210,130,0.9)" sizeRange={[1.5, 3.5]} driftRange={[10, 24]} />

      {/* warm vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% 60%, transparent 40%, rgba(5,8,20,0.6) 100%)",
        }}
      />
    </div>
  );
}
