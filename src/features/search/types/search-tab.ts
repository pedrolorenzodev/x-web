export type SearchTab = "top" | "live" | "user" | "media" | "list";

export type SearchSource =
  | { kind: "query"; query: string; src: string }
  | { kind: "hashtag"; tag: string };
