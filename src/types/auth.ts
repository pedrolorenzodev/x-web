import type { UserSummary } from "@/types/user";

export type Session = {
  user: UserSummary;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = LoginInput & {
  handle: string;
  displayName: string;
};
