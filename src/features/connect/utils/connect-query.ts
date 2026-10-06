import { routes } from "@/config/routes";
import type { ConnectQuery, ConnectTab } from "@/features/connect/types/connect";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function toConnectQuery(params: SearchParams): ConnectQuery {
  const userId = first(params.user_id)?.trim();

  return {
    tab: first(params.is_creator_only) === "true" ? "creators" : "who-to-follow",
    userId: userId ? userId : null,
  };
}

export function connectTabHref(tab: ConnectTab) {
  return tab === "creators"
    ? `${routes.connectPeople}?is_creator_only=true`
    : `${routes.connectPeople}?show_topics=false`;
}
