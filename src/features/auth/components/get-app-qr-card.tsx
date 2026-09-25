"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { GET_APP_QR_URL } from "@/config/auth";
import { GetAppModal } from "@/features/auth/components/get-app-modal";
import { useLandingOnboarding } from "@/features/auth/components/landing-onboarding";

export function GetAppQrCard() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const onboarding = useLandingOnboarding();

  const handleModalClosed = useCallback(() => {
    setModalOpen(false);
    triggerRef.current?.focus();
  }, []);

  if (onboarding.isOpen) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setModalOpen(true)}
        className="fixed end-[3vw] bottom-[3vw] z-[1000] hidden origin-bottom-right cursor-pointer flex-col items-center gap-2 rounded-[21.6px] border border-white/15 bg-elevated p-4 shadow-auth-card outline-hidden transition-transform duration-200 ease-[cubic-bezier(0,0,0.2,1)] [corner-shape:squircle] focus-visible:ring-2 focus-visible:ring-auth-muted min-[851px]:flex motion-safe:animate-enter-fade-rise motion-safe:hover:scale-[1.08] motion-safe:focus-visible:scale-[1.08] motion-reduce:animate-enter-fade"
      >
        <span className="max-w-[19em] text-center text-[12px] leading-tight font-normal text-white/60 min-[1008px]:text-[13px] min-[1325px]:text-[14px]">
          Scan to get the app
        </span>
        <Image
          src={GET_APP_QR_URL}
          alt=""
          width={160}
          height={160}
          className="size-24 invert min-[1008px]:size-28 min-[1325px]:size-36"
        />
      </button>
      {modalOpen ? <GetAppModal onClosed={handleModalClosed} /> : null}
    </>
  );
}
