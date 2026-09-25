import { cn } from "@/lib/utils";

type ToggleSwitchProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function ToggleSwitch({ checked, label, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="group relative flex shrink-0 items-center justify-center outline-none"
    >
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
    </button>
  );
}
