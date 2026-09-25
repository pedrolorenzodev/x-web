import { GetAppQrCard } from "@/features/auth/components/get-app-qr-card";
import { LandingFooter } from "@/features/auth/components/landing-footer";
import { LandingForm } from "@/features/auth/components/landing-form";
import { LandingOnboardingProvider } from "@/features/auth/components/landing-onboarding";
import { LandingSignInLink } from "@/features/auth/components/landing-sign-in-link";
import { XArtwork } from "@/features/auth/components/x-artwork";

function DesktopLanding() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 max-[500px]:hidden">
      <div className="flex flex-1 items-center justify-center px-4 py-10 min-[851px]:justify-start min-[851px]:ps-9">
        <div className="w-full max-w-[400px]">
          <div className="mb-4 flex justify-center min-[851px]:hidden">
            <XArtwork tiny />
          </div>
          <h1 className="mb-8 pb-4 text-center text-[50px] leading-[0.9] font-semibold text-white min-[851px]:text-start min-[851px]:text-[64px] min-[851px]:tracking-[-1px]">
            Happening now.
          </h1>
          <div className="min-h-[440px] w-full overflow-hidden">
            <LandingForm />
          </div>
        </div>
      </div>
      <div className="hidden min-[851px]:flex min-[851px]:min-h-[45vh] min-[851px]:flex-1 min-[851px]:items-center min-[851px]:justify-center min-[851px]:overflow-hidden">
        <XArtwork />
      </div>
    </div>
  );
}

function MobileLanding() {
  return (
    <div className="hidden flex-1 flex-col items-center justify-center max-[500px]:flex">
      <div className="my-4 flex min-h-[30vh] w-full max-w-[250px] items-center justify-end self-center overflow-hidden">
        <XArtwork strokeWidth={6} />
      </div>
      <div className="mt-8 flex w-full flex-col items-center px-8">
        <h1 className="mb-8 text-[20px] leading-5 font-semibold text-white">
          See what’s happening
        </h1>
        <p className="mb-3 text-[14px] leading-4 font-bold text-white">
          Already have an account?
        </p>
        <LandingSignInLink />
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <LandingOnboardingProvider>
      <div className="flex min-h-dvh flex-1 flex-col">
        <DesktopLanding />
        <MobileLanding />
        <LandingFooter />
        <GetAppQrCard />
      </div>
    </LandingOnboardingProvider>
  );
}
