import {
  AsYouType,
  getCountryCallingCode,
  isSupportedCountry,
} from "libphonenumber-js";

type ParsedPhoneInput = {
  countryCode: string | undefined;
  digits: string;
};

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhoneNumber(countryCode: string, digits: string) {
  if (!digits || !isSupportedCountry(countryCode)) return digits;
  const callingCode = getCountryCallingCode(countryCode);
  const international = new AsYouType(countryCode).input(`+${callingCode}${digits}`);
  return international
    .replace(`+${callingCode}`, "")
    .replace(/\D+/g, " ")
    .trim();
}

export function parsePhoneInput(value: string): ParsedPhoneInput {
  if (!value.trimStart().startsWith("+")) {
    return { countryCode: undefined, digits: onlyDigits(value) };
  }
  const typed = new AsYouType();
  typed.input(value);
  return {
    countryCode: typed.getCountry(),
    digits: typed.getNationalNumber(),
  };
}

export function withoutCharacterAt(value: string, index: number) {
  return value.slice(0, index) + value.slice(index + 1);
}

export function caretAfterDigits(value: string, digitCount: number) {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < value.length; index++) {
    if (/\d/.test(value[index]) && ++seen === digitCount) return index + 1;
  }
  return value.length;
}
