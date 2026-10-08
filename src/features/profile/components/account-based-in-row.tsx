"use client";

import { useId, useState } from "react";
import { InfoIcon, LocationIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import {
  AboutRowContent,
  aboutRowInteractive,
} from "@/features/profile/components/about-account-row";

function AccountLocationSheet({ onClose }: { onClose: () => void }) {
  const headingId = useId();

  return (
    <Modal
      labelledBy={headingId}
      onClose={onClose}
      restoreFocusOnUnmount
      className="h-auto min-h-0 gap-3 p-8"
    >
      <h2 id={headingId} className="text-[26px] leading-8 font-extrabold">
        How it works
      </h2>
      <p className="text-sm text-muted">
        The country or region that an account is based can be impacted by
        recent travel or temporary relocation. This data may not be accurate
        and can change periodically.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-full items-center justify-center rounded-full border border-transparent bg-inverted px-4 text-base font-bold text-inverted-foreground outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-inverted-hover focus-visible:bg-inverted-hover focus-visible:shadow-[0_0_0_2px_var(--color-button-focus-ring)] active:bg-inverted-pressed"
      >
        OK
      </button>
    </Modal>
  );
}

export function AccountBasedInRow({ country }: { country: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={aboutRowInteractive}
      >
        <AboutRowContent
          icon={<LocationIcon />}
          title="Account based in"
          value={country}
          trailing={<InfoIcon className="size-5" />}
        />
      </button>
      {open ? <AccountLocationSheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}
