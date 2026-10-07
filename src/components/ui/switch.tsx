import { cn } from "@/lib/utils";

type SwitchProps = {
  checked: boolean;
  label: string;
  size?: "md" | "sm";
  onChange: (checked: boolean) => void;
};

export function Switch({ checked, label, size = "md", onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="group relative flex shrink-0 items-center justify-center outline-none"
    >
      {size === "md" ? (
        <span
          className={cn(
            "relative block h-7 w-[50px] rounded-full transition-[background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-focus-visible:ring-3 group-focus-visible:ring-accent/30",
            checked
              ? "bg-accent group-hover:bg-auth-toggle-on-hover"
              : "bg-outline group-hover:bg-auth-toggle-off-hover",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] group-active:scale-95",
              checked && "translate-x-[22px]",
            )}
          />
        </span>
      ) : (
        <span className="relative flex h-5 w-10 items-center">
          <span
            className={cn(
              "h-3.5 w-full rounded-full transition-colors duration-200 ease-[ease]",
              checked ? "bg-accent/50" : "bg-outline",
            )}
          />
          <span
            className={cn(
              "absolute left-0 size-5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-[transform,background-color] duration-200 ease-[ease] group-focus-visible:ring-3 group-focus-visible:ring-accent/40",
              checked ? "translate-x-5 bg-accent" : "bg-foreground",
            )}
          />
        </span>
      )}
    </button>
  );
}
