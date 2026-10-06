"use client";

import { startTransition, useOptimistic } from "react";
import { PinFilledIcon, PinIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { toggleListPin } from "@/features/lists/api/list-viewer-state";

type ListPinButtonProps = {
  listId: string;
  pinned: boolean;
};

export function ListPinButton({ listId, pinned }: ListPinButtonProps) {
  const [optimisticPinned, setOptimisticPinned] = useOptimistic(pinned);
  const label = optimisticPinned ? "Unpin List" : "Pin List";

  function toggle() {
    startTransition(async () => {
      setOptimisticPinned(!optimisticPinned);
      await toggleListPin(listId);
    });
  }

  return (
    <Tooltip label={optimisticPinned ? "Unpin" : "Pin"}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={optimisticPinned}
        onClick={toggle}
        className="relative flex size-9 shrink-0 items-center justify-center rounded-full text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
      >
        {optimisticPinned ? (
          <PinFilledIcon className="size-[18.75px]" />
        ) : (
          <PinIcon className="size-[18.75px]" />
        )}
      </button>
    </Tooltip>
  );
}
