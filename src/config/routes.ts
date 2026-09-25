export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  logout: "/logout",
  landing: "/i/landing",
  expiredSession: "/i/session-expired",
  composePost: "/compose/post",
  profile: (handle: string) => `/${handle}`,
  profileReplies: (handle: string) => `/${handle}/with_replies`,
  tweet: (handle: string, id: string) => `/${handle}/status/${id}`,
} as const;
