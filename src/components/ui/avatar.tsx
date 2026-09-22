import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  md: 40,
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
      width={px}
      height={px}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}
