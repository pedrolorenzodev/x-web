function mask(value: string, visible: number) {
  return value.slice(0, visible) + "*".repeat(Math.max(0, value.length - visible));
}

export function maskEmail(email: string) {
  const [local, domain = ""] = email.split("@");
  const dot = domain.lastIndexOf(".");
  const name = dot === -1 ? domain : domain.slice(0, dot);
  const tld = dot === -1 ? "" : domain.slice(dot + 1);
  return `${mask(local, 2)}@${mask(name, 1)}${tld ? `.${mask(tld, 0)}` : ""}`;
}
