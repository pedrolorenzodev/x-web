const REGIONAL_INDICATOR_OFFSET = 0x1f1e6 - "A".charCodeAt(0);

export function countryFlag(countryCode: string) {
  return String.fromCodePoint(
    ...Array.from(countryCode.toUpperCase(), (letter) =>
      letter.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET,
    ),
  );
}
