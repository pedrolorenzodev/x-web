"use server";

import type { Gif } from "@/types/gif";
import { mockGifs, toGif } from "@/mocks/gifs";

export async function searchGifs(query: string): Promise<Gif[]> {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) {
    return mockGifs.filter((gif) => gif.trending).map(toGif);
  }

  return mockGifs
    .filter((gif) => {
      const haystack = `${gif.alt} ${gif.tags.join(" ")}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .map(toGif);
}
