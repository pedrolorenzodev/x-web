export type SearchDate = {
  month: string;
  day: string;
  year: string;
};

export type AdvancedSearchFields = {
  allWords: string;
  exactPhrase: string;
  anyWords: string;
  noneWords: string;
  hashtags: string;
  language: string;
  fromAccounts: string;
  toAccounts: string;
  mentionedAccounts: string;
  includeReplies: boolean;
  onlyReplies: boolean;
  includeLinks: boolean;
  onlyLinks: boolean;
  minReplies: string;
  minLikes: string;
  minReposts: string;
  since: SearchDate;
  until: SearchDate;
};

const ANY_LANGUAGE = "any";

export const searchLanguages = [
  { value: ANY_LANGUAGE, label: "Any language" },
  { value: "ar", label: "Arabic" },
  { value: "ar-x-fm", label: "Arabic (Feminine)" },
  { value: "bn", label: "Bangla" },
  { value: "bg", label: "Bulgarian" },
  { value: "ca", label: "Catalan" },
  { value: "hr", label: "Croatian" },
  { value: "cs", label: "Czech" },
  { value: "da", label: "Danish" },
  { value: "nl", label: "Dutch" },
  { value: "en", label: "English" },
  { value: "fi", label: "Finnish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "el", label: "Greek" },
  { value: "gu", label: "Gujarati" },
  { value: "he", label: "Hebrew" },
  { value: "hi", label: "Hindi" },
  { value: "hu", label: "Hungarian" },
  { value: "id", label: "Indonesian" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "kn", label: "Kannada" },
  { value: "ko", label: "Korean" },
  { value: "mr", label: "Marathi" },
  { value: "no", label: "Norwegian" },
  { value: "fa", label: "Persian" },
  { value: "pl", label: "Polish" },
  { value: "pt", label: "Portuguese" },
  { value: "ro", label: "Romanian" },
  { value: "ru", label: "Russian" },
  { value: "sr", label: "Serbian" },
  { value: "zh-cn", label: "Simplified Chinese" },
  { value: "sk", label: "Slovak" },
  { value: "es", label: "Spanish" },
  { value: "sv", label: "Swedish" },
  { value: "ta", label: "Tamil" },
  { value: "th", label: "Thai" },
  { value: "zh-tw", label: "Traditional Chinese" },
  { value: "tr", label: "Turkish" },
  { value: "uk", label: "Ukrainian" },
  { value: "ur", label: "Urdu" },
  { value: "vi", label: "Vietnamese" },
];

const emptyDate: SearchDate = { month: "", day: "", year: "" };

export function createAdvancedSearchFields(query: string): AdvancedSearchFields {
  return {
    allWords: query,
    exactPhrase: "",
    anyWords: "",
    noneWords: "",
    hashtags: "",
    language: ANY_LANGUAGE,
    fromAccounts: "",
    toAccounts: "",
    mentionedAccounts: "",
    includeReplies: true,
    onlyReplies: false,
    includeLinks: true,
    onlyLinks: false,
    minReplies: "",
    minLikes: "",
    minReposts: "",
    since: emptyDate,
    until: emptyDate,
  };
}

function split(value: string) {
  return value.split(/[\s,]+/).filter(Boolean);
}

function group(items: string[]) {
  return items.length > 1 ? `(${items.join(" OR ")})` : items[0];
}

function accounts(value: string, prefix: string) {
  const handles = split(value).map((item) => `${prefix}${item.replace(/^@/, "")}`);
  return handles.length ? `(${handles.join(" OR ")})` : undefined;
}

function minimum(value: string, operator: string) {
  const count = Number.parseInt(value, 10);
  return count > 0 ? `${operator}:${count}` : undefined;
}

function contentFilter(include: boolean, only: boolean, name: string) {
  if (!include) return `-filter:${name}`;
  return only ? `filter:${name}` : undefined;
}

function isoDate({ month, day, year }: SearchDate) {
  if (!month || !day || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function buildAdvancedQuery(fields: AdvancedSearchFields) {
  const anyWords = split(fields.anyWords);
  const hashtags = split(fields.hashtags).map((tag) => `#${tag.replace(/^#/, "")}`);
  const phrase = fields.exactPhrase.trim();
  const since = isoDate(fields.since);
  const until = isoDate(fields.until);

  return [
    split(fields.allWords).join(" "),
    phrase ? `"${phrase}"` : undefined,
    anyWords.length ? group(anyWords) : undefined,
    ...split(fields.noneWords).map((word) => `-${word}`),
    hashtags.length ? group(hashtags) : undefined,
    fields.language !== ANY_LANGUAGE ? `lang:${fields.language}` : undefined,
    accounts(fields.fromAccounts, "from:"),
    accounts(fields.toAccounts, "to:"),
    accounts(fields.mentionedAccounts, "@"),
    contentFilter(fields.includeReplies, fields.onlyReplies, "replies"),
    contentFilter(fields.includeLinks, fields.onlyLinks, "links"),
    minimum(fields.minReplies, "min_replies"),
    minimum(fields.minLikes, "min_faves"),
    minimum(fields.minReposts, "min_retweets"),
    since ? `since:${since}` : undefined,
    until ? `until:${until}` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}

export function advancedSearchResultsHref(query: string) {
  const params = new URLSearchParams({ q: query, src: "typed_query", f: "top" });
  return `/search?${params.toString()}`;
}
