export type ContentFilter = "only" | "exclude" | null;

export type QueryTerms = {
  words: string[];
  phrases: string[];
  hashtags: string[];
  mentions: string[];
  excluded: string[];
  anyOf: QueryTerms[][];
  from: string[];
  to: string[];
  minReplies: number;
  minLikes: number;
  minReposts: number;
  replies: ContentFilter;
  links: ContentFilter;
  since: string | null;
  until: string | null;
};

const TOKEN = /"([^"]+)"|\(([^)]*)\)|(\S+)/g;
const OR_SEPARATOR = /\s+or\s+/;
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}#@_]+|[^\p{L}\p{N}_]+$/gu;
const WORD_CHAR = "[\\p{L}\\p{N}_]";
const OPERATOR = /^(-?)([a-z_]+):(.+)$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeText(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function emptyTerms(): QueryTerms {
  return {
    words: [],
    phrases: [],
    hashtags: [],
    mentions: [],
    excluded: [],
    anyOf: [],
    from: [],
    to: [],
    minReplies: 0,
    minLikes: 0,
    minReposts: 0,
    replies: null,
    links: null,
    since: null,
    until: null,
  };
}

function stripHandle(value: string) {
  return value.replace(/^@/, "");
}

function applyOperator(
  terms: QueryTerms,
  negated: boolean,
  key: string,
  value: string,
) {
  const count = Number.parseInt(value, 10);
  switch (key) {
    case "from":
      terms.from.push(stripHandle(value));
      return true;
    case "to":
      terms.to.push(stripHandle(value));
      return true;
    case "min_replies":
      terms.minReplies = Number.isNaN(count) ? 0 : count;
      return true;
    case "min_faves":
      terms.minLikes = Number.isNaN(count) ? 0 : count;
      return true;
    case "min_retweets":
      terms.minReposts = Number.isNaN(count) ? 0 : count;
      return true;
    case "filter":
      if (value === "replies") terms.replies = negated ? "exclude" : "only";
      else if (value === "links") terms.links = negated ? "exclude" : "only";
      else return false;
      return true;
    case "since":
      terms.since = DATE.test(value) ? value : null;
      return true;
    case "until":
      terms.until = DATE.test(value) ? value : null;
      return true;
    case "lang":
      return true;
    default:
      return false;
  }
}

function addToken(terms: QueryTerms, raw: string) {
  const operator = raw.match(OPERATOR);
  if (operator && applyOperator(terms, operator[1] === "-", operator[2], operator[3])) {
    return;
  }

  if (raw.startsWith("-") && raw.length > 1) {
    const word = raw.slice(1).replace(EDGE_PUNCTUATION, "");
    if (word) terms.excluded.push(word);
    return;
  }

  const token = raw.replace(EDGE_PUNCTUATION, "");
  if (token.startsWith("#") && token.length > 1) terms.hashtags.push(token.slice(1));
  else if (token.startsWith("@") && token.length > 1) terms.mentions.push(token.slice(1));
  else if (token.replace(/[#@]/g, "")) terms.words.push(token.replace(/[#@]/g, ""));
}

function collect(terms: QueryTerms, query: string) {
  for (const match of query.matchAll(TOKEN)) {
    const phrase = match[1]?.trim();
    if (phrase) {
      terms.phrases.push(phrase);
      continue;
    }

    const group = match[2];
    if (group === undefined) {
      addToken(terms, match[3] ?? "");
      continue;
    }

    const options = group
      .split(OR_SEPARATOR)
      .map((option) => option.trim())
      .filter(Boolean);
    if (options.length > 1) terms.anyOf.push(options.map(parseFragment));
    else collect(terms, group);
  }
}

function parseFragment(fragment: string) {
  const terms = emptyTerms();
  collect(terms, fragment);
  return terms;
}

export function parseQuery(query: string): QueryTerms {
  return parseFragment(normalizeText(query));
}

export function hasTextTerms(terms: QueryTerms) {
  return (
    terms.words.length +
      terms.phrases.length +
      terms.hashtags.length +
      terms.mentions.length >
    0
  );
}

export function hasTerms(terms: QueryTerms) {
  return (
    hasTextTerms(terms) ||
    terms.excluded.length > 0 ||
    terms.anyOf.length > 0 ||
    terms.from.length > 0 ||
    terms.to.length > 0 ||
    terms.minReplies + terms.minLikes + terms.minReposts > 0 ||
    terms.replies !== null ||
    terms.links !== null ||
    terms.since !== null ||
    terms.until !== null
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
