import { VerifiedIcon } from "@/components/ui/icons";

const sparks = [
  { x: 22, y: 30, r: 2 },
  { x: 80, y: 10, r: 2.5 },
  { x: 182, y: 34, r: 2.5 },
  { x: 166, y: 74, r: 2 },
  { x: 128, y: 104, r: 2 },
  { x: 60, y: 62, r: 1.5 },
];

export function PremiumHero() {
  return (
    <div aria-hidden className="relative mx-auto h-[120px] w-[220px]">
      <svg viewBox="0 0 220 120" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="premium-hero-trail" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#1d9bf0" stopOpacity="0" />
            <stop offset="1" stopColor="#1d9bf0" />
          </linearGradient>
        </defs>
        <path
          d="M14 92 L104 6"
          stroke="url(#premium-hero-trail)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M160 108 L196 78"
          stroke="url(#premium-hero-trail)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        {sparks.map((spark) => (
          <circle
            key={`${spark.x}-${spark.y}`}
            cx={spark.x}
            cy={spark.y}
            r={spark.r}
            fill="#1d9bf0"
          />
        ))}
      </svg>
      <VerifiedIcon className="absolute top-[22px] left-[88px] size-[60px] text-accent" />
    </div>
  );
}
