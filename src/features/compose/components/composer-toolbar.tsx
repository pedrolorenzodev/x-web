import type { ComponentType, Ref, SVGProps } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ComposerTool = {
  label: string;
  tooltip: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  active?: boolean;
  wideOnly?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  onClick?: () => void;
};

const easing = "duration-200 ease-[ease]";

export function ComposerToolbar({ tools }: { tools: ComposerTool[] }) {
  return (
    <div className="-ml-2 flex h-10 items-center">
      {tools.map(
        ({
          label,
          tooltip,
          icon: Icon,
          disabled,
          active,
          wideOnly,
          buttonRef,
          onClick,
        }) => (
          <Tooltip key={label} label={tooltip} disabled={disabled}>
            <button
              ref={buttonRef}
              type="button"
              aria-label={label}
              disabled={disabled}
              onClick={onClick}
              className={cn(
                "group/tool m-0.5 flex size-9 items-center justify-center rounded-full",
                wideOnly && "max-[599px]:hidden",
                disabled
                  ? "opacity-50"
                  : `transition-colors ${easing} hover:bg-inverted/10`,
              )}
            >
              <Icon
                className={cn(
                  "size-[23.25px]",
                  active
                    ? "text-accent"
                    : "text-border-strong brightness-[2.5]",
                  !disabled &&
                    `transition ${easing} group-hover/tool:scale-[1.12]`,
                  !disabled && !active && "group-hover/tool:brightness-[3.5]",
                )}
              />
            </button>
          </Tooltip>
        ),
      )}
    </div>
  );
}
