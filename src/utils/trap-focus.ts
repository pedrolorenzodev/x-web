const FOCUSABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  const items = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
  ).filter((item) => item.checkVisibility());
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }

  const active = document.activeElement;
  const outside = !container.contains(active);
  if (event.shiftKey && (outside || active === first)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault();
    first.focus();
  }
}
