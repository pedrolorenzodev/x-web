export function stripDisallowedCharacters(
  value: string,
  characterClassPattern: string,
) {
  const allowed = new RegExp(characterClassPattern);
  return Array.from(value)
    .filter((character) => allowed.test(character))
    .join("");
}
