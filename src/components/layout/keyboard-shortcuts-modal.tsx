"use client";

import { Fragment } from "react";
import { shortcutGroups } from "@/config/keyboard-shortcuts";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";

function KeyCap({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-6 min-w-[25px] items-center justify-center rounded border border-keycap-border bg-menu-hover px-1 font-mono text-[15px] leading-5 font-normal">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal({
  dismiss,
}: {
  dismiss: RouteModalDismiss;
}) {
  const close = useRouteModalClose(dismiss);

  return (
    <Modal
      label="Keyboard shortcuts"
      onClose={close}
      animated={false}
      className="h-auto w-[822px] max-w-[95vw] bg-elevated"
    >
      <ModalHeader
        onClose={close}
        title="Keyboard shortcuts"
        className="bg-elevated/85"
      />
      <div className="grid grid-cols-[auto_auto_auto] justify-between overflow-y-auto px-6 pt-2 pb-6 max-[702px]:grid-cols-1">
        {shortcutGroups.map((group, index) => (
          <section
            key={group.title}
            className={
              index > 0
                ? "border-l border-border pl-6 max-[702px]:border-l-0 max-[702px]:pl-0"
                : "pr-6"
            }
          >
            <h3 className="py-3 text-xl font-extrabold">{group.title}</h3>
            <dl className="flex flex-col gap-1">
              {group.shortcuts.map((shortcut) => (
                <div
                  key={`${shortcut.label}-${shortcut.keys.join()}`}
                  className="flex items-center justify-between gap-3"
                >
                  <dt className="text-base">{shortcut.label}</dt>
                  <dd className="flex shrink-0 items-center gap-1 text-base">
                    {shortcut.keys.map((key, keyIndex) => (
                      <Fragment key={`${key}-${keyIndex}`}>
                        {keyIndex > 0 ? <span>+</span> : null}
                        <KeyCap>{key}</KeyCap>
                      </Fragment>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Modal>
  );
}
