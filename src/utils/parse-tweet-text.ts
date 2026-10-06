export type TextSegment =
  | { type: "text"; text: string }
  | { type: "url"; text: string; href: string }
  | { type: "mention"; text: string; handle: string }
  | { type: "hashtag"; text: string; tag: string }
  | { type: "cashtag"; text: string; symbol: string };

const TOP_LEVEL_DOMAINS =
  "com|net|org|dev|app|io|ai|co|me|mu|ar|uy|es|xyz|sh|gg|tv|so|fm|ly|to|link|site|page|vercel\\.app";

const ENTITY = new RegExp(
  [
    `(?<url>https?:\\/\\/[^\\s]+|\\b(?:[a-z0-9-]+\\.)+(?:${TOP_LEVEL_DOMAINS})\\b(?:\\/[^\\s]*)?)`,
    "(?<mention>(?<![\\p{L}\\p{N}_])@[A-Za-z0-9_]{1,15})",
    "(?<hashtag>(?<![\\p{L}\\p{N}_&])#[\\p{L}\\p{N}_]*\\p{L}[\\p{L}\\p{N}_]*)",
    "(?<cashtag>(?<![\\p{L}\\p{N}_])\\$[A-Za-z]{1,6}(?![\\p{L}\\p{N}_]))",
  ].join("|"),
  "giu",
);

const TRAILING_PUNCTUATION = /[.,!?;:)\]}'"]+$/;
const MAX_URL_DISPLAY = 26;

export function displayUrl(url: string) {
  const bare = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  return bare.length > MAX_URL_DISPLAY
    ? `${bare.slice(0, MAX_URL_DISPLAY - 1)}…`
    : bare;
}

export function parseTweetText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ENTITY)) {
    const groups = match.groups ?? {};
    let value = match[0];
    const start = match.index ?? 0;

    if (groups.url) {
      value = value.replace(TRAILING_PUNCTUATION, "");
    }
    if (start > cursor) {
      segments.push({ type: "text", text: text.slice(cursor, start) });
    }

    if (groups.url) {
      const href = /^https?:\/\//.test(value) ? value : `https://${value}`;
      segments.push({ type: "url", text: displayUrl(value), href });
    } else if (groups.mention) {
      segments.push({ type: "mention", text: value, handle: value.slice(1) });
    } else if (groups.hashtag) {
      segments.push({ type: "hashtag", text: value, tag: value.slice(1) });
    } else {
      segments.push({ type: "cashtag", text: value, symbol: value.slice(1) });
    }
    cursor = start + value.length;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", text: text.slice(cursor) });
  }
  return segments;
}

export const SHOW_MORE_LIMIT = 280;

export function truncateForCard(text: string) {
  const characters = Array.from(text);
  if (characters.length <= SHOW_MORE_LIMIT) return null;
  return characters.slice(0, SHOW_MORE_LIMIT).join("").trimEnd();
}
