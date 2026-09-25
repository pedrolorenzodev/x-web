export function readCssProperty(property: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
}

export function readCssPixels(property: string) {
  return parseFloat(readCssProperty(property)) || 0;
}

export function readCssMilliseconds(property: string) {
  const value = readCssProperty(property);
  const amount = parseFloat(value) || 0;
  return value.endsWith("ms") ? amount : amount * 1000;
}
