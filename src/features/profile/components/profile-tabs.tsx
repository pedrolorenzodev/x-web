import { routes } from "@/config/routes";
import { ChevronDownIcon } from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";

export type ProfileTab = "posts" | "replies";

type ProfileTabsProps = {
  handle: string;
  active: ProfileTab;
};

export function ProfileTabs({ handle, active }: ProfileTabsProps) {
  return (
    <div role="tablist" className="flex border-b border-border">
      <Tab
        label="Posts"
        href={routes.profile(handle)}
        active={active === "posts"}
        icon={
          active === "posts" ? (
            <ChevronDownIcon className="size-[18.75px]" />
          ) : undefined
        }
      />
      <Tab
        label="Replies"
        href={routes.profileReplies(handle)}
        active={active === "replies"}
      />
      <Tab label="Reposts" />
      <Tab label="Media" />
    </div>
  );
}
