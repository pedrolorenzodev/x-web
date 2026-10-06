import type { Page } from "@/types/pagination";
import type { User } from "@/types/user";

export type ConnectTab = "who-to-follow" | "creators";

export type ConnectQuery = {
  tab: ConnectTab;
  userId: string | null;
};

export type ConnectPeoplePage = {
  tab: ConnectTab;
  seed: User | null;
  sectionTitle: string | null;
  users: Page<User>;
};
