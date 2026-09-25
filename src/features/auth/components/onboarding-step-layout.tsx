import type { FormEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BackIcon, XLogoIcon } from "@/components/ui/icons";

type OnboardingStepLayoutProps = {
  heading: string;
  subheading?: ReactNode;
  column?: "narrow" | "wide";
  inlineLogoWhenCompact?: boolean;
  headerAction?: ReactNode;
  footer: ReactNode;
  onBack: () => void;
  onSubmit: () => void;
  children?: ReactNode;
};

const columnPadding = {
  narrow: "px-5 min-[600px]:px-[132px] md:px-[160px]",
  wide: "px-5 min-[600px]:px-[132px] md:px-[144px]",
};

export function OnboardingStepLayout({
  heading,
  subheading,
  column = "wide",
  inlineLogoWhenCompact = false,
  headerAction,
  footer,
  onBack,
  onSubmit,
  children,
}: OnboardingStepLayoutProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative h-full">
      <div className="absolute start-0 top-0 z-10 flex">
        <button
          type="button"
          aria-label="Back"
          data-onboarding-back
          onClick={onBack}
          className="m-4 flex rounded-full bg-black/80 p-1 text-white transition-all duration-75 ease-[ease-in-out] hover:bg-auth-back-hover active:opacity-80 max-narrow:m-2"
        >
          <BackIcon className="size-6" />
        </button>
      </div>
      <div className="absolute inset-0 flex scroll-pb-[128px] flex-col overflow-x-hidden overflow-y-scroll [scrollbar-color:rgba(170,170,170,0.5)_transparent] [scrollbar-gutter:stable_both-edges] [scrollbar-width:thin] max-narrow:scroll-pb-0">
        <div
          className={cn(
            "relative flex h-28 shrink-0 justify-center pt-8",
            inlineLogoWhenCompact && "max-md:hidden",
          )}
        >
          <XLogoIcon className="size-12 text-white" />
          {headerAction ? (
            <div className="absolute end-0 top-0 flex p-6">{headerAction}</div>
          ) : null}
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col gap-5 pb-4 max-narrow:flex-none max-narrow:pb-0",
            columnPadding[column],
          )}
        >
          <div className="flex flex-col items-start gap-2">
            <div
              className={cn(
                "flex self-stretch",
                inlineLogoWhenCompact &&
                  "max-md:mt-8 max-md:items-center max-md:justify-center max-md:gap-4",
              )}
            >
              {inlineLogoWhenCompact ? (
                <XLogoIcon className="hidden size-8 shrink-0 text-white max-md:block" />
              ) : null}
              <h1
                className={cn(
                  "text-[31px] leading-[38.75px] font-bold text-white",
                  inlineLogoWhenCompact
                    ? "max-md:text-[20px] max-md:leading-[25px]"
                    : "max-md:text-[26px] max-md:leading-[32.5px]",
                )}
              >
                {heading}
              </h1>
            </div>
            {subheading ? (
              <p
                className={cn(
                  "text-[15px] leading-5 font-normal text-auth-subtle",
                  inlineLogoWhenCompact && "max-md:hidden",
                )}
              >
                {subheading}
              </p>
            ) : null}
          </div>
          {children}
        </div>
        <div className="sticky bottom-0 flex bg-elevated pe-2 max-narrow:static max-narrow:bg-transparent max-narrow:pe-0">
          <div
            className={cn(
              "flex flex-1 flex-col gap-3 pt-2 pb-6 max-narrow:pt-9 max-narrow:pb-2",
              columnPadding[column],
            )}
          >
            {footer}
          </div>
        </div>
      </div>
    </form>
  );
}
