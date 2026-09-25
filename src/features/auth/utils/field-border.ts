export function fieldBorderClass(invalid: boolean) {
  return invalid
    ? "border-auth-error"
    : "border-auth-field-border focus-within:border-auth-focus";
}
