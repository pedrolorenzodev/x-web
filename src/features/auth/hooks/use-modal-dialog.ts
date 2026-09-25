import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useEscapeToClose } from "@/features/auth/hooks/use-escape-to-close";
import { trapFocus } from "@/features/auth/utils/trap-focus";

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

  useEscapeToClose(true, onEscape);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab" && dialog) trapFocus(event, dialog);
    }

    const active = document.activeElement;
    if (returnFocusRef.current === null) {
      returnFocusRef.current = focusedBeforeOpen;
    } else if (!dialog.contains(active)) {
      returnFocusRef.current = active;
    }
    const returnFocus = returnFocusRef.current;

    const root = document.documentElement;
    const { overflow, scrollbarGutter } = root.style;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    moveFocusIn(dialog);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = overflow;
      root.style.scrollbarGutter = scrollbarGutter;
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
