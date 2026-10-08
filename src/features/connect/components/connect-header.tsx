import Link from "next/link";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";

const CONTACTS_SETTINGS_HREF = `${routes.settings}/contacts`;

export function ConnectHeader() {
  return (
    <PageHeader
      title="Follow"
      action={
        <Tooltip label="Settings">
          <Link
            href={CONTACTS_SETTINGS_HREF}
            aria-label="Settings"
            className="-mr-[9px] flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
          >
            <SettingsIcon className="size-5" />
          </Link>
        </Tooltip>
      }
    />
  );
}
