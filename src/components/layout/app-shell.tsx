import type { ReactNode } from "react";

type AppShellProps = {
  sidebar: ReactNode;
  modal: ReactNode;
  children: ReactNode;
};

export function AppShell({ sidebar, modal, children }: AppShellProps) {
  return (
    <div className="mx-auto flex w-fit items-start">
      {sidebar}
      <main className="w-feed min-h-screen shrink-0 border-x border-border">
        {children}
      </main>
      {modal}
    </div>
  );
}
