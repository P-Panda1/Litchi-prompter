interface LycheeIconProps {
  className?: string;
}

const LycheeIcon = ({ className = "w-10 h-10" }: LycheeIconProps) => {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main lychee body - oval shape */}
      <defs>
        <linearGradient id="lycheeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(352, 60%, 55%)" />
          <stop offset="50%" stopColor="hsl(350, 55%, 48%)" />
          <stop offset="100%" stopColor="hsl(348, 50%, 40%)" />
        </linearGradient>
        <linearGradient id="lycheeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <radialGradient id="bump" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Lychee body - slightly oval/heart shape */}
      <ellipse
        cx="32"
        cy="34"
        rx="22"
        ry="24"
        fill="url(#lycheeGradient)"
      />

      {/* Highlight on top-left */}
      <ellipse
        cx="24"
        cy="24"
        rx="10"
        ry="12"
        fill="url(#lycheeHighlight)"
        opacity="0.6"
      />

      {/* Bumpy texture - multiple small circles */}
      {/* Row 1 */}
      <circle cx="20" cy="20" r="3.5" fill="url(#bump)" />
      <circle cx="28" cy="18" r="3" fill="url(#bump)" />
      <circle cx="36" cy="19" r="3.2" fill="url(#bump)" />
      <circle cx="44" cy="22" r="3" fill="url(#bump)" />

      {/* Row 2 */}
      <circle cx="16" cy="28" r="3.2" fill="url(#bump)" />
      <circle cx="24" cy="26" r="3.5" fill="url(#bump)" />
      <circle cx="32" cy="25" r="3" fill="url(#bump)" />
      <circle cx="40" cy="27" r="3.3" fill="url(#bump)" />
      <circle cx="48" cy="30" r="2.8" fill="url(#bump)" />

      {/* Row 3 */}
      <circle cx="14" cy="36" r="3" fill="url(#bump)" />
      <circle cx="22" cy="34" r="3.4" fill="url(#bump)" />
      <circle cx="30" cy="33" r="3.2" fill="url(#bump)" />
      <circle cx="38" cy="34" r="3.5" fill="url(#bump)" />
      <circle cx="46" cy="37" r="3" fill="url(#bump)" />

      {/* Row 4 */}
      <circle cx="17" cy="44" r="3.2" fill="url(#bump)" />
      <circle cx="25" cy="42" r="3" fill="url(#bump)" />
      <circle cx="33" cy="41" r="3.3" fill="url(#bump)" />
      <circle cx="41" cy="43" r="3.1" fill="url(#bump)" />
      <circle cx="48" cy="45" r="2.5" fill="url(#bump)" />

      {/* Row 5 */}
      <circle cx="22" cy="50" r="2.8" fill="url(#bump)" />
      <circle cx="30" cy="49" r="3" fill="url(#bump)" />
      <circle cx="38" cy="50" r="2.9" fill="url(#bump)" />
      <circle cx="44" cy="52" r="2.5" fill="url(#bump)" />

      {/* Bottom row */}
      <circle cx="28" cy="55" r="2.5" fill="url(#bump)" />
      <circle cx="36" cy="55" r="2.3" fill="url(#bump)" />

      {/* Small stem/top */}
      <ellipse
        cx="32"
        cy="12"
        rx="4"
        ry="3"
        fill="hsl(90, 30%, 35%)"
      />
      <rect
        x="30"
        y="8"
        width="4"
        height="5"
        rx="1"
        fill="hsl(90, 25%, 30%)"
      />

      {/* Small leaf */}
      <path
        d="M36 10 Q42 6 38 2 Q34 6 36 10"
        fill="hsl(120, 35%, 40%)"
      />
    </svg>
  );
};

export default LycheeIcon;
