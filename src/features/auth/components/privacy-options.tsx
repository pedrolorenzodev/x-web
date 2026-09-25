import { useState, type FocusEvent, type MouseEvent } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import { useEscapeToClose } from "@/features/auth/hooks/use-escape-to-close";
import { ToggleSwitch } from "@/features/auth/components/toggle-switch";

const TITLE = "Connect with friends you know";

export function PrivacyOptions() {
  const [open, setOpen] = useState(false);
  const [discoverable, setDiscoverable] = useState(true);

  useEscapeToClose(open, () => setOpen(false), { capture: true });

  function keepFocus(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (open && next && !event.currentTarget.contains(next)) setOpen(false);
  }

  return (
    <div onBlur={handleBlur} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full flex-col"
      >
        <span className="flex items-center gap-1 text-auth-subtle">
          <span className="text-[12px] leading-[18px] font-normal">
            Privacy Options
          </span>
          <ChevronDownIcon className="size-3" />
        </span>
      </button>
      {open ? (
        <>
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10"
          />
          <div
            onMouseDown={keepFocus}
            className="absolute bottom-[calc(100%+4px)] -start-2 z-20 flex w-[350px] max-w-[calc(100vw-24px)] flex-col rounded-xl bg-auth-popover p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_5px_12px_rgba(255,255,255,0.15)]"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[12px] leading-[18px] font-bold text-white">
                  {TITLE}
                </p>
                <p className="text-[12px] leading-[18px] font-normal text-auth-subtle">
                  Let people find your account by your phone number or email
                </p>
              </div>
              <ToggleSwitch
                checked={discoverable}
                label={TITLE}
                onChange={setDiscoverable}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
