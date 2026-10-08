export type HighlightPart = {
  text: string;
  highlighted: boolean;
};

const WORD_CHAR = /[\p{L}\p{N}_]/u;

function foldChar(char: string) {
  return char.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function foldWithOffsets(text: string) {
  let folded = "";
  const offsets: number[] = [];
  let index = 0;
  for (const char of text) {
    for (const unit of foldChar(char)) {
      folded += unit;
      offsets.push(index);
    }
    index += char.length;
  }
  offsets.push(text.length);
  return { folded, offsets };
}

function isBoundary(folded: string, index: number) {
  return index < 0 || index >= folded.length || !WORD_CHAR.test(folded[index]);
}

export function splitHighlights(text: string, terms: string[]): HighlightPart[] {
  const needles = terms
    .map((term) => foldWithOffsets(term).folded.trim())
    .filter(Boolean);
  if (!needles.length) return [{ text, highlighted: false }];

  const { folded, offsets } = foldWithOffsets(text);
  const ranges: [number, number][] = [];
  for (const needle of needles) {
    let from = folded.indexOf(needle);
    while (from !== -1) {
      const to = from + needle.length;
      if (isBoundary(folded, from - 1) && isBoundary(folded, to)) {
        ranges.push([offsets[from], offsets[to]]);
      }
      from = folded.indexOf(needle, from + 1);
    }
  }
  if (!ranges.length) return [{ text, highlighted: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const parts: HighlightPart[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (end <= cursor) continue;
    const from = Math.max(start, cursor);
    if (from > cursor) parts.push({ text: text.slice(cursor, from), highlighted: false });
    parts.push({ text: text.slice(from, end), highlighted: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), highlighted: false });
  return parts;
}
