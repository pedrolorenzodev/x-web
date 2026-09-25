import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

type PasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityToggle({
  visible,
  onToggle,
}: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onToggle}
      className="flex text-auth-eye"
    >
      {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
    </button>
  );
}
