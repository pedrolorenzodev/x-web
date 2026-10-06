import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 133.5,
} as const;

type AvatarProps = {
  src: string;
  alt: string;
  size?: keyof typeof sizes;
  className?: string;
};

export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const px = sizes[size];

  return (
    <Image
      src={src}
      alt={alt}
      width={Math.ceil(px)}
      height={Math.ceil(px)}
      style={{ width: px, height: px }}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
