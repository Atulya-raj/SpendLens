import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="rim-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a2c3f" />
          <stop offset="50%" stopColor="#4a5d78" />
          <stop offset="100%" stopColor="#1a2c3f" />
        </linearGradient>
        <linearGradient id="handle-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b7e9b" />
          <stop offset="50%" stopColor="#bcd0e9" />
          <stop offset="100%" stopColor="#1a2c3f" />
        </linearGradient>
        <linearGradient id="gold-circuit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>
        <linearGradient id="orange-circuit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff751a" />
          <stop offset="100%" stopColor="#ff4d00" />
        </linearGradient>
        <radialGradient id="lens-shimmer" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#fdf8e2" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#bcd0e9" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Magnifier Lens Background Shimmer */}
      <circle cx="50" cy="50" r="38" fill="url(#lens-shimmer)" />

      {/* Circuit board tracks & nodes inside the lens */}
      {/* Track 1 (top-left) */}
      <path d="M 28 35 H 40 V 28" stroke="url(#gold-circuit)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="35" r="2" fill="#d4af37" />
      <circle cx="40" cy="28" r="2" fill="#d4af37" />

      {/* Track 2 (top-right) */}
      <path d="M 72 30 H 62 L 56 36" stroke="url(#orange-circuit)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="72" cy="30" r="2" fill="#ff4d00" />
      
      {/* Track 3 (bottom-left) */}
      <path d="M 26 62 H 34 L 38 68 H 44" stroke="url(#orange-circuit)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="26" cy="62" r="2" fill="#ff4d00" />

      {/* Track 4 (bottom-right connecting towards center) */}
      <path d="M 68 68 H 58 V 74" stroke="url(#gold-circuit)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="68" cy="68" r="2" fill="#d4af37" />
      <circle cx="58" cy="74" r="2" fill="#d4af37" />

      {/* Microchip representation (top-right area) */}
      <rect x="68" y="42" width="10" height="10" rx="1.5" fill="#1a2c3f" />
      {/* Chip pins */}
      <path d="M 66 44 h 2 M 66 47 h 2 M 66 50 h 2 M 78 44 h 2 M 78 47 h 2 M 78 50 h 2 M 70 40 v 2 M 73 40 v 2 M 75 40 v 2 M 70 52 v 2 M 73 52 v 2 M 75 52 v 2" stroke="#bcd0e9" strokeWidth="1" />

      {/* Gear representation (left area) */}
      <circle cx="28" cy="48" r="4" stroke="#1a2c3f" strokeWidth="1.5" />
      <path d="M 28 42 v 2 M 28 52 v 2 M 22 48 h 2 M 32 48 h 2 M 24 44 l 1.5 1.5 M 32 52 l -1.5 -1.5 M 32 44 l -1.5 1.5 M 24 52 l 1.5 -1.5" stroke="#1a2c3f" strokeWidth="1.5" />

      {/* Central Dollar Sign $ designed like high-tech circuit lines */}
      {/* Dollar vertical lines */}
      <path d="M 50 20 V 80" stroke="#1a2c3f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 50 22 V 78" stroke="url(#orange-circuit)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Dollar S-curve */}
      <path
        d="M 64 34 C 64 26, 36 24, 36 38 C 36 50, 64 48, 64 62 C 64 74, 36 74, 36 66"
        stroke="#1a2c3f"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 64 34 C 64 26, 36 24, 36 38 C 36 50, 64 48, 64 62 C 64 74, 36 74, 36 66"
        stroke="url(#gold-circuit)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Double Magnifier Rim */}
      {/* Inner Rim Shadow */}
      <circle cx="50" cy="50" r="38" stroke="#1a2c3f" strokeWidth="1" strokeOpacity="0.2" />
      {/* Main Outer Rim */}
      <circle cx="50" cy="50" r="38" stroke="url(#rim-gradient)" strokeWidth="4.5" />
      {/* Metallic highlight ring */}
      <circle cx="50" cy="50" r="36.5" stroke="#bcd0e9" strokeWidth="1.2" strokeOpacity="0.6" />

      {/* Magnifier Handle (Bottom-Right) */}
      {/* Handle Connector */}
      <path d="M 77 77 L 84 84" stroke="#1a2c3f" strokeWidth="9" strokeLinecap="round" />
      <path d="M 77 77 L 84 84" stroke="#bcd0e9" strokeWidth="5" strokeLinecap="round" />
      
      {/* Main Handle Body */}
      <path d="M 83 83 L 105 105" stroke="url(#handle-gradient)" strokeWidth="9.5" strokeLinecap="round" />
      {/* Handle Knurling / Ridges texture */}
      <path d="M 87 87 L 89 89 M 91 91 L 93 93 M 95 95 L 97 97 M 99 99 L 101 101" stroke="#1a2c3f" strokeWidth="9.5" strokeLinecap="butt" strokeOpacity="0.3" />
      <path d="M 87 87 L 89 89 M 91 91 L 93 93 M 95 95 L 97 97 M 99 99 L 101 101" stroke="#ffffff" strokeWidth="8.5" strokeLinecap="butt" strokeOpacity="0.2" />
    </svg>
  );
}
