import { MoreHorizontalIcon } from "@/components/ui/icons";

// TODO: decorative only. These pages do not exist in this project.
const links = ["Terms", "Privacy", "Cookies", "Accessibility", "Ads Info"];

const item = "my-0.5 flex h-5 items-center pr-3";
const label = "text-[11px] leading-3 text-muted";

export function PanelFooter() {
  return (
    <nav aria-label="Footer" className="mb-4 flex flex-wrap px-4">
      {links.map((link) => (
        <span key={link} className={item}>
          <span className={`${label} cursor-pointer hover:underline`}>
            {link}
          </span>
          <span aria-hidden className="text-base text-muted">
            &nbsp;·
          </span>
        </span>
      ))}
      <button
        type="button"
        className={`${item} gap-0.5 ${label} hover:underline`}
      >
        More
        <MoreHorizontalIcon className="size-3" />
      </button>
      <span className={`${item} ${label}`}>© 2026 X Corp.</span>
    </nav>
  );
}
