import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";
import { trapFocus } from "@/utils/trap-focus";

const openDialogs: HTMLElement[] = [];
let savedRootStyle = { overflow: "", scrollbarGutter: "" };

function isTopDialog(dialog: HTMLElement) {
  return openDialogs[openDialogs.length - 1] === dialog;
}

type ModalDialogOptions = {
  onEscape: () => void;
  focusOnOpen?: () => void;
  restoreFocusOnUnmount?: boolean;
};

export function useModalDialog(
  dialogRef: RefObject<HTMLElement | null>,
  { onEscape, focusOnOpen, restoreFocusOnUnmount = false }: ModalDialogOptions,
) {
  const [focusedBeforeOpen] = useState(() =>
    typeof document === "undefined" ? null : document.activeElement,
  );
  const returnFocusRef = useRef<Element | null>(null);
  const moveFocusIn = useEffectEvent((dialog: HTMLElement) => {
    if (focusOnOpen) focusOnOpen();
    else if (!dialog.contains(document.activeElement)) dialog.focus();
  });

  const escape = useEffectEvent(onEscape);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onKeyDown(event: KeyboardEvent) {
      if (!dialog || !isTopDialog(dialog)) return;
      if (event.key === "Tab") trapFocus(event, dialog);
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        escape();
      }
    }

    const active = document.activeElement;
    if (returnFocusRef.current === null) {
      returnFocusRef.current = focusedBeforeOpen;
    } else if (!dialog.contains(active)) {
      returnFocusRef.current = active;
    }
    const returnFocus = returnFocusRef.current;

    const root = document.documentElement;
    if (openDialogs.length === 0) {
      savedRootStyle = {
        overflow: root.style.overflow,
        scrollbarGutter: root.style.scrollbarGutter,
      };
    }
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    openDialogs.push(dialog);
    moveFocusIn(dialog);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      openDialogs.splice(openDialogs.indexOf(dialog), 1);
      if (openDialogs.length === 0) {
        root.style.overflow = savedRootStyle.overflow;
        root.style.scrollbarGutter = savedRootStyle.scrollbarGutter;
      }
      document.removeEventListener("keydown", onKeyDown);
      if (
        restoreFocusOnUnmount &&
        returnFocus instanceof HTMLElement &&
        returnFocus.isConnected
      ) {
        returnFocus.focus({ preventScroll: true });
      }
    };
  }, [dialogRef, restoreFocusOnUnmount, focusedBeforeOpen]);

  return returnFocusRef;
}
