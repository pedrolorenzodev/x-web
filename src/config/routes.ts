export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  composePost: "/compose/post",
  profile: (handle: string) => `/${handle}`,
  profileReplies: (handle: string) => `/${handle}/with_replies`,
  tweet: (handle: string, id: string) => `/${handle}/status/${id}`,
} as const;
