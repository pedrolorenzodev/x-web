import { useEffect, useEffectEvent } from "react";

type EscapeToCloseOptions = {
  capture?: boolean;
};

export function useEscapeToClose(
  open: boolean,
  onClose: () => void,
  { capture = false }: EscapeToCloseOptions = {},
) {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      close();
    }
    document.addEventListener("keydown", onKeyDown, capture);
    return () => document.removeEventListener("keydown", onKeyDown, capture);
  }, [open, capture]);
}
