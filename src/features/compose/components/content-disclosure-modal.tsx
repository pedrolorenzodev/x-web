"use client";

import { useState, type ReactNode } from "react";
import { legalLinks } from "@/config/links";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import type { ContentDisclosure } from "@/features/compose/types/composer";

type ContentDisclosureModalProps = {
  value: ContentDisclosure;
  onDone: (value: ContentDisclosure) => void;
};

export function ContentDisclosureModal({
  value,
  onDone,
}: ContentDisclosureModalProps) {
  const [disclosure, setDisclosure] = useState(value);

  return (
    <Modal
      label="Content disclosure"
      placement="top"
      onClose={() => onDone(disclosure)}
      restoreFocusOnUnmount
      className="bg-elevated"
    >
      <div className="flex h-[53px] shrink-0 items-center justify-between px-4">
        <h2 className="text-xl font-bold">Content disclosure</h2>
        <button
          type="button"
          onClick={() => onDone(disclosure)}
          className="flex h-8 items-center rounded-full px-3 text-base font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
        >
          Done
        </button>
      </div>
      <div className="flex flex-col gap-8 pt-8 pb-4">
        <DisclosureRow
          title="Paid partnership"
          checked={disclosure.paidPartnership}
          onChange={(paidPartnership) =>
            setDisclosure((current) => ({ ...current, paidPartnership }))
          }
        >
          Let others know this post promotes a brand or business.{" "}
          <a
            href={legalLinks.paidPartnerships}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Learn more
          </a>
        </DisclosureRow>
        <DisclosureRow
          title="Made with AI"
          checked={disclosure.madeWithAi}
          onChange={(madeWithAi) =>
            setDisclosure((current) => ({ ...current, madeWithAi }))
          }
        >
          Mark this post as containing synthetically generated content.
        </DisclosureRow>
      </div>
    </Modal>
  );
}

type DisclosureRowProps = {
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

function DisclosureRow({ title, checked, onChange, children }: DisclosureRowProps) {
  return (
    <div className="flex items-start gap-4 px-4">
      <div className="min-w-0 flex-1">
        <p className="text-base">{title}</p>
        <p className="mt-3 text-xs text-muted">{children}</p>
      </div>
      <Switch size="sm" label={title} checked={checked} onChange={onChange} />
    </div>
  );
}
