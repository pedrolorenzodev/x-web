import { cn } from "@/lib/utils";
import { GoogleIcon } from "@/components/ui/icons";

type GoogleButtonProps = {
  className?: string;
};

export function GoogleButton({ className }: GoogleButtonProps) {
  return (
    <button type="button" className={cn("flex h-[46px] w-full", className)}>
      <span className="flex h-10 w-[calc(100%/1.15)] shrink-0 origin-top-left scale-[1.15] items-center justify-center gap-2 overflow-hidden rounded-full border border-auth-google-border bg-white text-[14px] leading-5 font-medium text-auth-google-text">
        <GoogleIcon className="size-[22px]" />
        Continue with Google
      </span>
    </button>
  );
}
