import { routes } from "@/config/routes";

export function profileAllPath(handle: string) {
  return `${routes.profile(handle)}/all`;
}
