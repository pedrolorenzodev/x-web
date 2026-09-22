import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type ComposerTool = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
};

const easing = "duration-200 ease-[ease]";

export function ComposerToolbar({ tools }: { tools: ComposerTool[] }) {
  return (
    <div className="-ml-2 flex h-10 items-center">
      {tools.map(({ label, icon: Icon, disabled }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          disabled={disabled}
          className={cn(
            "group/tool m-0.5 flex size-9 items-center justify-center rounded-full",
            disabled
              ? "opacity-50"
              : `transition-colors ${easing} hover:bg-inverted/10`,
          )}
        >
          <Icon
            className={cn(
              "size-[23.25px] text-border-strong brightness-[2.5]",
              !disabled &&
                `transition ${easing} group-hover/tool:scale-[1.12] group-hover/tool:brightness-[3.5]`,
            )}
          />
        </button>
      ))}
    </div>
  );
}
