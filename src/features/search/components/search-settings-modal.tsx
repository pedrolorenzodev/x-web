"use client";

import { useState } from "react";
import type { SearchSettings } from "@/types/preferences";
import { legalLinks } from "@/config/links";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { updateSearchSettings } from "@/features/search/api/search-settings";

function LearnMore() {
  return (
    <a
      href={legalLinks.searchSettingsHelp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="text-accent hover:underline"
    >
      Learn more
    </a>
  );
}

type SearchSettingsModalProps = {
  initialSettings: SearchSettings;
  dismiss: RouteModalDismiss;
};

export function SearchSettingsModal({
  initialSettings,
  dismiss,
}: SearchSettingsModalProps) {
  const close = useRouteModalClose(dismiss);
  const [settings, setSettings] = useState(initialSettings);

  function update(change: Partial<SearchSettings>) {
    const next = { ...settings, ...change };
    setSettings(next);
    updateSearchSettings(next);
  }

  return (
    <Modal label="Search settings" size="fixed" onClose={close} className="bg-elevated">
      <ModalHeader onClose={close} title="Search settings" className="bg-elevated/85" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CheckboxRow
          title="Hide sensitive content"
          description={
            <>
              This prevents posts with potentially sensitive content from
              displaying in your search results. <LearnMore />
            </>
          }
          checked={settings.hideSensitiveContent}
          onChange={(hideSensitiveContent) => update({ hideSensitiveContent })}
        />
        <CheckboxRow
          title="Remove blocked and muted accounts"
          description={
            <>
              Use this to eliminate search results from accounts you’ve blocked
              or muted. <LearnMore />
            </>
          }
          checked={settings.removeBlockedAndMuted}
          onChange={(removeBlockedAndMuted) => update({ removeBlockedAndMuted })}
        />
      </div>
    </Modal>
  );
}
