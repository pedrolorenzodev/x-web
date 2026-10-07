import { emojiSource } from "@/features/compose/utils/emoji-source";

export type EmojiCategoryId = keyof typeof emojiSource;

export type Emoji = {
  char: string;
  name: string;
  tonable: boolean;
};

export type EmojiCategory = {
  id: EmojiCategoryId;
  label: string;
  icon: string;
  emojis: Emoji[];
};

export const skinTones = [
  { label: "Default", modifier: "", swatch: "#ffcc4d" },
  { label: "Light", modifier: "\u{1F3FB}", swatch: "#f7dece" },
  { label: "Medium light", modifier: "\u{1F3FC}", swatch: "#f3d2a2" },
  { label: "Medium", modifier: "\u{1F3FD}", swatch: "#d5ab88" },
  { label: "Medium dark", modifier: "\u{1F3FE}", swatch: "#af7e57" },
  { label: "Dark", modifier: "\u{1F3FF}", swatch: "#7c533e" },
] as const;

const categoryMeta: Record<EmojiCategoryId, { label: string; icon: string }> = {
  people: { label: "Smileys & people", icon: "😀" },
  nature: { label: "Animals & nature", icon: "🐻" },
  food: { label: "Food & drink", icon: "🍔" },
  activity: { label: "Activity", icon: "⚽" },
  travel: { label: "Travel & places", icon: "🚘" },
  objects: { label: "Objects", icon: "💡" },
  symbols: { label: "Symbols", icon: "🔣" },
  flags: { label: "Flags", icon: "🚩" },
};

const TONABLE_MARK = "~";

function parseEmoji(entry: string): Emoji {
  const separator = entry.indexOf(" ");
  const head = entry.slice(0, separator);
  const tonable = head.endsWith(TONABLE_MARK);
  const name = entry.slice(separator + 1);
  return {
    char: tonable ? head.slice(0, -TONABLE_MARK.length) : head,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    tonable,
  };
}

export const emojiCategories: EmojiCategory[] = (
  Object.keys(emojiSource) as EmojiCategoryId[]
).map((id) => ({
  id,
  ...categoryMeta[id],
  emojis: emojiSource[id].split("|").map(parseEmoji),
}));

const allEmojis = emojiCategories.flatMap((category) => category.emojis);

export function searchEmojis(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return allEmojis.filter((emoji) => {
    const name = emoji.name.toLowerCase();
    return terms.every((term) => name.includes(term));
  });
}

export function findEmoji(char: string) {
  return allEmojis.find((emoji) => emoji.char === char);
}

export function applySkinTone(emoji: Emoji, modifier: string) {
  if (!emoji.tonable || !modifier) return emoji.char;
  const [first, ...rest] = [...emoji.char.replace(/️/g, "")];
  return `${first}${modifier}${rest.join("")}`;
}
