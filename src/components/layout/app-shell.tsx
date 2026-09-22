import type { ReactNode } from "react";

type AppShellProps = {
  sidebar: ReactNode;
  panel: ReactNode;
  modal: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, panel, modal, children }: AppShellProps) {
  return (
    <div className="mx-auto flex w-fit items-start pr-[10px]">
      {sidebar}
      <main className="w-feed min-h-screen shrink-0 border-x border-border">
        {children}
      </main>
      <div className="ml-[30px] self-stretch">{panel}</div>
      {modal}
    </div>
  );
}
