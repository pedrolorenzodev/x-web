import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";
import { FloatingDock } from "@/components/layout/floating-dock";

type AppShellProps = {
  sidebar: ReactNode;
  mobileNav: ReactNode;
  panel: ReactNode;
  modal: ReactNode;
  children: ReactNode;
};

export function AppShell({
  sidebar,
  mobileNav,
  panel,
  modal,
  children,
}: AppShellProps) {
  return (
    <div
      data-app-shell
      className="mx-auto flex w-fit items-start max-[499px]:w-full min-[988px]:pr-[10px]"
    >
      {sidebar}
      <main className="w-feed min-h-screen shrink-0 border-x border-border max-[687px]:w-[calc(100vw-88px)] max-[599px]:w-[calc(100vw-68px)] max-[499px]:w-full max-[499px]:border-x-0 max-[499px]:pb-14 layout-fullwidth:w-[min(1185px,calc(100vw-88px))]! layout-fullwidth:max-[499px]:w-full! layout-no-panel:w-auto!">
        {children}
        <Toaster />
      </main>
      <div className="ml-5 hidden self-stretch min-[988px]:block min-[1078px]:ml-[30px] layout-fullwidth:hidden! layout-no-panel:hidden!">
        {panel}
      </div>
      <FloatingDock />
      {mobileNav}
      {modal}
    </div>
  );
}
