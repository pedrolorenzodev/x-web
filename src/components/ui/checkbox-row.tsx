import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxRowProps = {
  title: string;
  description: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function CheckboxRow({
  title,
  description,
  checked,
  onChange,
}: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3">
      <span className="min-w-0 flex-1">
        <span className="block text-base">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{description}</span>
      </span>
      <Checkbox
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="-mr-2"
      />
    </label>
  );
}
