export const sidebarWidth =
  "w-[88px] max-[599px]:w-[68px] min-[989px]:max-[1007px]:w-[68px] min-[1265px]:w-sidebar max-[1264px]:layout-fullwidth:w-[88px]! min-[1265px]:layout-fullwidth:w-[70px]!";

export const sidebarGutter =
  "px-2 max-[599px]:px-1 min-[989px]:max-[1007px]:px-1 min-[1265px]:layout-fullwidth:px-0";

export const sidebarAlign =
  "items-center min-[1265px]:items-start layout-fullwidth:items-center!";

export const expandedOnly =
  "hidden min-[1265px]:inline layout-fullwidth:hidden!";

export const collapsedOnly =
  "inline min-[1265px]:hidden layout-fullwidth:inline!";

export const navLink =
  "group flex w-full justify-center py-1 outline-none min-[1265px]:justify-start layout-fullwidth:justify-center!";

export const navPill =
  "flex items-center gap-5 rounded-full p-3 transition-[background-color,box-shadow] duration-200 ease-[ease] group-hover:bg-foreground/10 group-focus-visible:shadow-[0_0_0_2px_rgb(135,138,140)] min-[1265px]:pr-7 layout-fullwidth:pr-3!";

export function isSidebarCollapsed(trigger: Element) {
  const label = trigger.querySelector("[data-nav-label]");
  return !label || !label.checkVisibility();
}
