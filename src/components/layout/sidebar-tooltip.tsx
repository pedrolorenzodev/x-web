"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { isSidebarCollapsed } from "@/components/layout/sidebar-styles";

export function SidebarTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label} showWhen={isSidebarCollapsed}>
      {children}
    </Tooltip>
  );
}
