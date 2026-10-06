import Image from "next/image";
import { cn } from "@/lib/utils";

type CoverPalette = { background: string; line: string };

const palettes: CoverPalette[] = [
  { background: "#0b4590", line: "#2d7ad6" },
  { background: "#8fd3f7", line: "#1d9bf0" },
  { background: "#7856ff", line: "#a593ff" },
  { background: "#3e4144", line: "#6e767d" },
];

const LIST_GLYPH =
  "M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z";
const X_GLYPH =
  "M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z";

function paletteFor(listId: string) {
  const sum = [...listId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return palettes[sum % palettes.length];
}

type ListCoverProps = {
  listId: string;
  bannerUrl: string | null;
  className?: string;
};

export function ListThumbnail({
  listId,
  bannerUrl,
  size = 48,
  className,
}: ListCoverProps & { size?: number }) {
  if (bannerUrl) {
    return (
      <Image
        src={bannerUrl}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-xl object-cover", className)}
      />
    );
  }

  const palette = paletteFor(listId);
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, backgroundColor: palette.background }}
      className={cn("flex shrink-0 items-center justify-center rounded-xl", className)}
    >
      <svg viewBox="0 0 24 24" fill={palette.line} style={{ width: size / 2 }}>
        <path d={LIST_GLYPH} />
      </svg>
    </span>
  );
}

const glyphs: { d: string; x: number; y: number; size: number }[] = [
  { d: LIST_GLYPH, x: 40, y: -30, size: 110 },
  { d: X_GLYPH, x: 45, y: 105, size: 110 },
  { d: LIST_GLYPH, x: 235, y: 40, size: 130 },
  { d: X_GLYPH, x: 445, y: -5, size: 105 },
  { d: LIST_GLYPH, x: 440, y: 120, size: 115 },
];

export function ListBanner({ listId, bannerUrl, className }: ListCoverProps) {
  if (bannerUrl) {
    return (
      <div className={cn("relative aspect-[3/1] w-full overflow-hidden", className)}>
        <Image
          src={bannerUrl}
          alt=""
          fill
          sizes="600px"
          className="object-cover"
        />
      </div>
    );
  }

  const palette = paletteFor(listId);
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block aspect-[3/1] w-full", className)}
      style={{ backgroundColor: palette.background }}
    >
      <g stroke={palette.line} strokeWidth="3" fill="none">
        <path d="M195 0v200M405 0v200M0 80h195M405 110h195" />
      </g>
      {glyphs.map((glyph, index) => (
        <path
          key={index}
          d={glyph.d}
          fill={palette.line}
          transform={`translate(${glyph.x} ${glyph.y}) scale(${glyph.size / 24})`}
        />
      ))}
    </svg>
  );
}
