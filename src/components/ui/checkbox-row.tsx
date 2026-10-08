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
    <label className="flex cursor-pointer flex-col px-4 py-4 transition-colors duration-200 ease-[ease] hover:bg-white/3">
      <span className="flex h-5 items-center justify-between gap-4">
        <span className="min-w-0 text-base">{title}</span>
        <Checkbox
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="-my-2 -mr-2"
        />
      </span>
      <span className="mt-1 block text-xs text-muted">{description}</span>
    </label>
  );
}
