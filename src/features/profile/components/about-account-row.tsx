import type { ReactNode } from "react";

export const aboutRowInteractive =
  "flex w-full outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)]";

type AboutRowContentProps = {
  icon: ReactNode;
  title: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
};

export function AboutRowContent({ icon, title, value, trailing }: AboutRowContentProps) {
  return (
    <span className="flex w-full items-center px-4 py-3 text-left text-base">
      <span className="mr-4 flex size-6 shrink-0 [&>svg]:size-6">{icon}</span>
      <span className="flex min-w-0 grow flex-col">
        <span>{title}</span>
        {value ? <span className="text-muted">{value}</span> : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 text-muted">{trailing}</span>
      ) : null}
    </span>
  );
}
