import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { analyticsPaywall } from "@/features/creator-studio/config/creator-studio";

export function AnalyticsPaywall() {
  return (
    <>
      <PageHeader title="Analytics" align="center" size="compact" />
      <div className="relative aspect-[598/265] w-full">
        <Image
          src={analyticsPaywall.imageUrl}
          alt=""
          fill
          sizes="600px"
          priority
          className="object-cover"
        />
      </div>
      <div className="px-6 pt-6 pb-16">
        <h1 className="text-[23px] leading-7 font-extrabold">
          {analyticsPaywall.title}
        </h1>
        <p className="mt-4 text-base text-muted">{analyticsPaywall.body}</p>
        <Link
          href={routes.premiumFrom("analytics")}
          className="mt-6 flex h-[50px] w-full items-center justify-center rounded-full bg-inverted text-base font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
        >
          Upgrade
        </Link>
      </div>
    </>
  );
}
