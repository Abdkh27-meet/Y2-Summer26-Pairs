import type { GuideId } from "../types";

/**
 * Illustrated SVG avatars — distinct identity per guide, no external images.
 */
export function GuideAvatar({
  guide,
  size = 44,
}: {
  guide: GuideId;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden="true"
    >
      {guide === "entropo" && <EntropoAvatar />}
      {guide === "cs" && <CSAvatar />}
      {guide === "kazuha" && <KazuhaAvatar />}
    </svg>
  );
}

function EntropoAvatar() {
  return (
    <>
      <defs>
        <radialGradient id="ent-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2f6f4e" />
          <stop offset="100%" stopColor="#0c2014" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#ent-bg)" />
      {/* sprout */}
      <path d="M32 44 V30" stroke="#e0b341" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M32 34 C 22 30, 20 22, 28 20 C 30 26, 32 30, 32 34 Z"
        fill="#3f8a5c"
      />
      <path
        d="M32 32 C 42 28, 44 20, 36 18 C 34 24, 32 28, 32 32 Z"
        fill="#5fae7a"
      />
      {/* friendly face */}
      <circle cx="26" cy="48" r="1.6" fill="#f3ede0" />
      <circle cx="38" cy="48" r="1.6" fill="#f3ede0" />
      <path d="M28 52 Q32 55 36 52" stroke="#f3ede0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  );
}

function CSAvatar() {
  return (
    <>
      <defs>
        <radialGradient id="cs-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#050818" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#cs-bg)" />
      {/* hair */}
      <path d="M20 26 Q22 14 32 14 Q42 14 44 26 L42 30 Q38 22 32 22 Q26 22 22 30 Z" fill="#1a2240" />
      {/* face */}
      <circle cx="32" cy="34" r="11" fill="#e7d7c4" />
      {/* glasses */}
      <rect x="23" y="32" width="7" height="5" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.4" />
      <rect x="34" y="32" width="7" height="5" rx="2" fill="none" stroke="#22d3ee" strokeWidth="1.4" />
      <line x1="30" y1="34.5" x2="34" y2="34.5" stroke="#22d3ee" strokeWidth="1.4" />
      {/* smile */}
      <path d="M28 40 Q32 43 36 40" stroke="#7a5a3a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* hoodie */}
      <path d="M16 64 Q16 48 32 48 Q48 48 48 64 Z" fill="#22d3ee" opacity="0.85" />
    </>
  );
}

function KazuhaAvatar() {
  return (
    <>
      <defs>
        <radialGradient id="kaz-bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3b2f6b" />
          <stop offset="100%" stopColor="#070b22" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#kaz-bg)" />
      {/* hair (white/silver) */}
      <path d="M18 28 Q20 12 32 12 Q44 12 46 28 L44 34 Q40 22 32 22 Q24 22 20 34 Z" fill="#e8e6f0" />
      <path d="M22 22 Q26 16 32 16 Q38 16 42 22 Q38 20 32 20 Q26 20 22 22 Z" fill="#c2c0d8" />
      {/* face */}
      <circle cx="32" cy="34" r="10" fill="#f0e3d0" />
      {/* eyes (gentle) */}
      <path d="M26 33 Q27 31 29 33" stroke="#3b2f6b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M35 33 Q36 31 38 33" stroke="#3b2f6b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M28 39 Q32 41 36 39" stroke="#7a5a3a" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* maple leaf hairpin */}
      <g transform="translate(40,18) scale(0.5)">
        <path d="M16 2c3 5 9 7 9 14a9 9 0 1 1-18 0c0-7 6-9 9-14z" fill="#c0473b" />
      </g>
      {/* kimono collar */}
      <path d="M18 64 Q18 50 32 50 Q46 50 46 64 Z" fill="#5a2230" />
      <path d="M28 50 L32 56 L36 50" fill="#7a2c3a" />
    </>
  );
}
