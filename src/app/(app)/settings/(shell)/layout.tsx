import type { ReactNode } from "react";
import { SettingsLayout } from "@/features/settings/components/settings-layout";

export default function SettingsShellLayout({ children }: { children: ReactNode }) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
