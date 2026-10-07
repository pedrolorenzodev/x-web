export type Shortcut = {
  label: string;
  keys: string[];
};

export type ShortcutGroup = {
  title: string;
  shortcuts: Shortcut[];
};

export const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { label: "Shortcut help", keys: ["?"] },
      { label: "Next post", keys: ["j"] },
      { label: "Previous post", keys: ["k"] },
      { label: "Page down", keys: ["Space"] },
      { label: "Load new posts", keys: ["."] },
      { label: "Home", keys: ["g", "h"] },
      { label: "Explore", keys: ["g", "e"] },
      { label: "Notifications", keys: ["g", "n"] },
      { label: "Mentions", keys: ["g", "r"] },
      { label: "Profile", keys: ["g", "p"] },
      { label: "Drafts", keys: ["g", "f"] },
      { label: "Scheduled posts", keys: ["g", "t"] },
      { label: "Likes", keys: ["g", "l"] },
      { label: "Lists", keys: ["g", "i"] },
      { label: "Chat", keys: ["g", "m"] },
      { label: "Grok", keys: ["g", "g"] },
      { label: "Creator Studio", keys: ["g", "c"] },
      { label: "Settings", keys: ["g", "s"] },
      { label: "Bookmarks", keys: ["g", "b"] },
      { label: "Go to user…", keys: ["g", "u"] },
      { label: "Display settings", keys: ["g", "d"] },
    ],
  },
  {
    title: "Actions",
    shortcuts: [
      { label: "New post", keys: ["n"] },
      { label: "Send post", keys: ["⌘", "Enter"] },
      { label: "Search", keys: ["/"] },
      { label: "Like", keys: ["l"] },
      { label: "Reply", keys: ["r"] },
      { label: "Repost", keys: ["t"] },
      { label: "Share post", keys: ["s"] },
      { label: "Bookmark", keys: ["b"] },
      { label: "Mute account", keys: ["u"] },
      { label: "Block account", keys: ["x"] },
      { label: "Open post details", keys: ["Enter"] },
      { label: "Expand photo", keys: ["o"] },
      { label: "Open/Close Messages dock", keys: ["i"] },
    ],
  },
  {
    title: "Media",
    shortcuts: [
      { label: "Pause/Play selected Video", keys: ["k"] },
      { label: "Pause/Play selected Video", keys: ["space"] },
      { label: "Mute selected Video", keys: ["m"] },
      { label: "Go to Audio Dock", keys: ["a", "d"] },
      { label: "Play/Pause Audio Dock", keys: ["a", "space"] },
      { label: "Mute/Unmute Audio Dock", keys: ["a", "m"] },
    ],
  },
];
