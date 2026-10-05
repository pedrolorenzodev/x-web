type SearchSource = "typed_query" | "trend_click" | "hashtag_click";

export function searchHref(query: string, src: SearchSource = "typed_query") {
  const params = new URLSearchParams({ q: query, src });
  if (src === "trend_click") params.set("vertical", "trends");
  return `/search?${params.toString()}`;
}

export function trendSearchHref(name: string) {
  const query = !name.startsWith("#") && name.includes(" ") ? `"${name}"` : name;
  return searchHref(query, "trend_click");
}
