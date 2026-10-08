const tiles: { x: number; y: number; size: number; fill: string; outline?: boolean }[] = [
  { x: 0, y: 52, size: 40, fill: "#8ecdf8", outline: true },
  { x: 50, y: 28, size: 44, fill: "#8ecdf8" },
  { x: 50, y: 82, size: 42, fill: "#8ecdf8", outline: true },
  { x: 102, y: 4, size: 48, fill: "#1d9bf0", outline: true },
  { x: 102, y: 62, size: 50, fill: "#0b4590" },
  { x: 160, y: 20, size: 58, fill: "#1d9bf0" },
  { x: 160, y: 88, size: 56, fill: "#8ecdf8", outline: true },
  { x: 226, y: 0, size: 62, fill: "#0b4590" },
  { x: 226, y: 70, size: 62, fill: "#0b4590", outline: true },
  { x: 298, y: 32, size: 74, fill: "#1d9bf0" },
];

export function SuggestedListsHero() {
  return (
    <div className="border-b border-border">
      <div className="flex aspect-[3/1] items-center justify-center">
        <svg aria-hidden viewBox="0 0 372 150" className="w-[372px] max-w-full">
          {tiles.map((tile, index) => {
            const inset = tile.size * 0.22;
            const lineGap = tile.size * 0.18;
            const color = tile.outline ? tile.fill : "#ffffff";
            return (
              <g key={index}>
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.size}
                  height={tile.size}
                  rx={tile.size * 0.12}
                  fill={tile.outline ? "none" : tile.fill}
                  stroke={tile.fill}
                  strokeWidth={tile.outline ? 3 : 0}
                />
                {[0, 1, 2].map((line) => (
                  <rect
                    key={line}
                    x={tile.x + inset}
                    y={tile.y + inset + line * lineGap + tile.size * 0.08}
                    width={tile.size - inset * 2 - (line === 2 ? tile.size * 0.18 : 0)}
                    height={tile.size * 0.07}
                    rx={tile.size * 0.035}
                    fill={color}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="px-8 pt-8 pb-10">
        <h2 className="text-[26px] leading-8 font-extrabold">Choose your Lists</h2>
        <p className="mt-2 text-base text-muted">
          When you follow a List, you&apos;ll be able to quickly keep up with the
          experts on what you care about most.
        </p>
      </div>
    </div>
  );
}
