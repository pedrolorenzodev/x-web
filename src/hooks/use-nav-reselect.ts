import { useEffect, useEffectEvent } from "react";

const NAV_RESELECT_EVENT = "nav-reselect";

export function dispatchNavReselect(href: string) {
  const event = new CustomEvent(NAV_RESELECT_EVENT, {
    detail: href,
    cancelable: true,
  });
  return !window.dispatchEvent(event);
}

export function useNavReselect(href: string, onReselect: () => void) {
  const reselect = useEffectEvent(onReselect);

  useEffect(() => {
    function onNavReselect(event: Event) {
      if (!(event instanceof CustomEvent) || event.detail !== href) return;
      event.preventDefault();
      reselect();
    }

    window.addEventListener(NAV_RESELECT_EVENT, onNavReselect);
    return () => window.removeEventListener(NAV_RESELECT_EVENT, onNavReselect);
  }, [href]);
}
