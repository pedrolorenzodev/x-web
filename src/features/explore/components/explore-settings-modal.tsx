"use client";

import Link from "next/link";
import { useState } from "react";
import type { ExploreSettings } from "@/types/preferences";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { ChevronRightIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { updateExploreSettings } from "@/features/explore/api/explore-settings";

const EXPLORE_LOCATIONS_HREF = "/settings/explore/location";

type ExploreSettingsModalProps = {
  initialSettings: ExploreSettings;
  dismiss: RouteModalDismiss;
};

export function ExploreSettingsModal({
  initialSettings,
  dismiss,
}: ExploreSettingsModalProps) {
  const close = useRouteModalClose(dismiss);
  const [settings, setSettings] = useState(initialSettings);

  function toggleLocalContent(showLocalContent: boolean) {
    const next = { ...settings, showLocalContent };
    setSettings(next);
    updateExploreSettings(next);
  }

  return (
    <Modal label="Explore settings" size="fixed" onClose={close} className="bg-elevated">
      <ModalHeader onClose={close} title="Explore settings" className="bg-elevated/85" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <h3 className="px-4 py-3 text-xl font-extrabold">Location</h3>
        <CheckboxRow
          title="Show content in this location"
          description="When this is on, you’ll see what’s happening around you right now."
          checked={settings.showLocalContent}
          onChange={toggleLocalContent}
        />
        {settings.showLocalContent ? null : (
          <Link
            href={EXPLORE_LOCATIONS_HREF}
            className="flex items-center justify-between px-4 py-3 text-base transition-colors duration-200 ease-[ease] hover:bg-white/3"
          >
            Explore locations
            <ChevronRightIcon className="size-[18.75px] text-muted" />
          </Link>
        )}
      </div>
    </Modal>
  );
}
