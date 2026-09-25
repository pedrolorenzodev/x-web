import { AppleIcon, PhoneIcon } from "@/components/ui/icons";
import { GoogleButton } from "@/features/auth/components/google-button";
import { PillButton } from "@/features/auth/components/pill-button";

type SocialSignInButtonsProps = {
  onPhoneClick: () => void;
  googleClassName?: string;
};

export function SocialSignInButtons({
  onPhoneClick,
  googleClassName,
}: SocialSignInButtonsProps) {
  return (
    <div className="flex flex-col justify-center gap-5 pt-2">
      <PillButton
        pressable
        icon={<PhoneIcon className="size-[22px]" />}
        onClick={onPhoneClick}
      >
        Continue with phone
      </PillButton>
      <GoogleButton className={googleClassName} />
      <PillButton icon={<AppleIcon className="size-[22px]" />}>
        Continue with Apple
      </PillButton>
    </div>
  );
}
