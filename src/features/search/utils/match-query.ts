export type QueryTerms = {
  words: string[];
  phrases: string[];
  hashtags: string[];
  mentions: string[];
};

const TOKEN = /"([^"]+)"|(\S+)/g;
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}#@_]+|[^\p{L}\p{N}_]+$/gu;
const WORD_CHAR = "[\\p{L}\\p{N}_]";

export function normalizeText(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function parseQuery(query: string): QueryTerms {
  const terms: QueryTerms = { words: [], phrases: [], hashtags: [], mentions: [] };

  for (const match of normalizeText(query).matchAll(TOKEN)) {
    const phrase = match[1]?.trim();
    if (phrase) {
      terms.phrases.push(phrase);
      continue;
    }
    const token = (match[2] ?? "").replace(EDGE_PUNCTUATION, "");
    if (token.startsWith("#") && token.length > 1) terms.hashtags.push(token.slice(1));
    else if (token.startsWith("@") && token.length > 1) terms.mentions.push(token.slice(1));
    else if (token.replace(/[#@]/g, "")) terms.words.push(token.replace(/[#@]/g, ""));
  }

  return terms;
}

export function hasTerms(terms: QueryTerms) {
  return (
    terms.words.length + terms.phrases.length + terms.hashtags.length + terms.mentions.length > 0
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function containsWord(normalizedText: string, word: string) {
  return new RegExp(
    `(?<!${WORD_CHAR})${escapeRegExp(word)}(?!${WORD_CHAR})`,
    "u",
  ).test(normalizedText);
}

export function containsHashtag(normalizedText: string, tag: string) {
  return new RegExp(
    `(?<![\\p{L}\\p{N}_&])#${escapeRegExp(tag)}(?!${WORD_CHAR})`,
    "u",
  ).test(normalizedText);
}

export function containsMention(normalizedText: string, handle: string) {
  return new RegExp(
    `(?<!${WORD_CHAR})@${escapeRegExp(handle)}(?!${WORD_CHAR})`,
    "u",
  ).test(normalizedText);
}
