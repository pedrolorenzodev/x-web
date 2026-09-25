type ModalityFocusOptions = FocusOptions & { focusVisible?: boolean };

export function focusWithModality(target: HTMLElement, focusVisible: boolean) {
  const options: ModalityFocusOptions = { preventScroll: true, focusVisible };
  target.focus(options);
}

export function focusKeepingModality(target: HTMLElement) {
  focusWithModality(
    target,
    document.activeElement?.matches(":focus-visible") ?? false,
  );
}
