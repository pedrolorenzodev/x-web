"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import {
  PasscodeIcon,
  PasscodeLockIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import {
  PASSCODE_LENGTH,
  PasscodeDigits,
} from "@/features/chat/components/passcode-digits";
import { cn } from "@/lib/utils";

type ChatPasscodeStep = "welcome" | "passcode";

type ChatPasscodeFlowProps = {
  initialStep?: ChatPasscodeStep;
  variant?: "page" | "modal";
};

type Feature = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    icon: PasscodeLockIcon,
    title: "End-to-End Encryption",
    body: "Messages are end-to-end encrypted across all your devices.",
  },
  {
    icon: ShieldCheckIcon,
    title: "State-of-the-Art Privacy",
    body: "There’s no way for anyone, including X, to read your messages.",
  },
  {
    icon: PasscodeIcon,
    title: "Set Passcode",
    body: "In order to secure your messages, you’ll need to set up a passcode.",
  },
];

function Welcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex w-[328px] max-w-full flex-col">
      <h1 className="text-[34px] leading-10 font-extrabold">
        Welcome to the new X Chat
      </h1>
      <ul className="mt-8 flex flex-col gap-6">
        {features.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-center gap-4">
            <Icon className="size-8 shrink-0" />
            <div className="w-[280px] min-w-0">
              <p className="text-base font-bold">{title}</p>
              <p className="mt-0.5 text-base text-foreground/60">{body}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onContinue}
        className="mt-8 flex h-10 w-full items-center justify-center rounded-full bg-inverted text-base font-medium text-inverted-foreground transition-colors duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inverted/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Create Passcode
      </button>
    </div>
  );
}

function CreatePasscode() {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: PASSCODE_LENGTH }, () => ""),
  );
  const complete = digits.every(Boolean);

  return (
    <div className="flex flex-col items-center text-center">
      <PasscodeIcon className="size-8" />
      <h1 className="mt-6 text-[23px] leading-7 font-bold">Create Passcode</h1>
      <p className="mt-2 text-base text-foreground/60">
        A personal key that secures your messages.
      </p>
      <div className="mt-10">
        <PasscodeDigits digits={digits} onChange={setDigits} />
      </div>
      <p
        role="status"
        className={cn(
          "mt-6 flex items-center gap-1 text-xs transition-colors duration-200 ease-[ease]",
          complete ? "text-foreground" : "text-muted",
        )}
      >
        <PasscodeLockIcon className="size-4 shrink-0" />
        Chat isn’t available in this clone — this is the last screen.
      </p>
    </div>
  );
}

export function ChatPasscodeFlow({
  initialStep = "welcome",
  variant = "page",
}: ChatPasscodeFlowProps) {
  const [step, setStep] = useState(initialStep);

  return (
    <div
      className={cn(
        "flex items-center justify-center px-4",
        variant === "page" ? "min-h-screen" : "min-h-0 flex-1",
      )}
    >
      {step === "welcome" ? (
        <Welcome onContinue={() => setStep("passcode")} />
      ) : (
        <CreatePasscode />
      )}
    </div>
  );
}
