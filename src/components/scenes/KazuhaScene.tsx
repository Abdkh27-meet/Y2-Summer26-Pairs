import {
  RainCanvas,
  ParticleField,
  LeafDrift,
  FogLayer,
  WaterRipples,
} from "../effects/ParticleEffects";

/**
 * Kazuha scene — rainy Japanese evening: midnight indigo, lanterns,
 * maple trees, rooftops, fog, ripples, fireflies.
 */
export function KazuhaScene({ parallax }: { parallax: { x: number; y: number } }) {
  const px = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth}px, 0)`,
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(120% 90% at 50% 12%, #202a6a 0%, #121848 45%, #070b22 100%)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {/* moon */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "18%",
          width: 110,
          height: 110,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,235,210,0.95) 0%, rgba(245,235,210,0.18) 45%, transparent 72%)",
          filter: "blur(1px)",
          ...px(-20),
        }}
      />
      {/* mountains */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "26%", left: 0, width: "100%", height: "32%", ...px(-14) }}
      >
        <path
          d="M0 400 L0 240 L140 160 L300 230 L440 130 L600 220 L760 150 L920 240 L1080 170 L1240 250 L1440 180 L1440 400 Z"
          fill="#1c2450"
          opacity="0.85"
        />
      </svg>
      {/* rooftops */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: "14%", left: 0, width: "100%", height: "20%", ...px(-6) }}
      >
        <g fill="#0a0e26">
          {[
            [80, 70],
            [260, 90],
            [460, 60],
            [680, 100],
            [900, 70],
            [1120, 90],
            [1300, 65],
          ].map(([x, h], i) => (
            <g key={i} transform={`translate(${x},160)`}>
              <path d={`M0 0 L40 -${h} L120 -${h} L160 0 Z`} />
            </g>
          ))}
        </g>
      </svg>
      {/* maple tree foreground */}
      <svg
        viewBox="0 0 240 320"
        style={{ position: "absolute", bottom: "10%", left: "-2%", width: 220, height: 280, ...px(-3) }}
      >
        <rect x="116" y="200" width="8" height="120" fill="#0a0e22" />
        <path
          d="M120 200 C 60 170, 40 110, 90 80 C 70 40, 120 30, 130 70 C 150 30, 200 50, 180 90 C 220 110, 190 180, 120 200 Z"
          fill="#5a2230"
          opacity="0.9"
        />
        <path
          d="M120 180 C 80 150, 70 100, 110 80 C 100 50, 140 50, 145 80 C 170 60, 200 90, 170 120 C 190 150, 150 180, 120 180 Z"
          fill="#7a2c3a"
          opacity="0.7"
        />
      </svg>
      {/* stone lanterns */}
      {[
        { left: "82%", bottom: "18%" },
        { left: "30%", bottom: "20%" },
      ].map((l, i) => (
        <div key={i} style={{ position: "absolute", left: l.left, bottom: l.bottom, ...px(-2) }}>
          <div
            style={{
              width: 18,
              height: 22,
              borderRadius: "40% 40% 30% 30%",
              background: "radial-gradient(circle, #ffd98a 0%, #e0823a 60%, #6b3a1a 100%)",
              boxShadow: "0 0 32px 14px rgba(255,180,90,0.5)",
              animation: `flicker ${3.5 + i}s ease-in-out ${i * -1.5}s infinite`,
            }}
          />
          <div style={{ width: 22, height: 8, background: "#1a1a2e", margin: "2px 0 0 -2px", borderRadius: 4 }} />
        </div>
      ))}
      <FogLayer color="rgba(140,150,210,0.24)" />
      <RainCanvas density={170} color="rgba(190,210,255,0.55)" wind={1.8} speed={9} />
      <WaterRipples color="rgba(190,210,255,0.42)" />
      <LeafDrift count={12} color="#c0473b" durationRange={[14, 26]} />
      <ParticleField count={26} color="rgba(255,220,140,0.95)" sizeRange={[1.5, 3.5]} driftRange={[8, 22]} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% 55%, transparent 42%, rgba(4,7,22,0.7) 100%)",
        }}
      />
    </div>
  );
}
