import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { ChevronRightIcon, HelpCircleIcon } from "@/components/ui/icons";
import {
  creatorHelpUrl,
  monetizationCards,
  monetizationPaywalls,
  type MonetizationProduct,
} from "@/features/creator-studio/config/creator-studio";

export function MonetizationPaywall({
  product,
}: {
  product: MonetizationProduct;
}) {
  const paywall = monetizationPaywalls[product];

  return (
    <>
      <PageHeader
        title=""
        size="compact"
        action={
          <a
            href={creatorHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Help"
            className="-mr-2 flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
          >
            <HelpCircleIcon className="size-6" />
          </a>
        }
      />
      <div className="px-6 pt-8 pb-16">
        <h1 className="text-center text-[23px] leading-7 font-bold">
          Make money on X
        </h1>
        <p className="mt-4 text-center text-lg text-muted">{paywall.body}</p>
        <Link
          href={routes.premiumFrom("creator_studio")}
          className="mt-6 flex h-[50px] w-full items-center justify-center rounded-full bg-inverted text-base font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
        >
          Become a Premium Creator
        </Link>
        <Link
          href={routes.premiumFrom("creator_studio")}
          className="mx-auto mt-7 flex w-fit items-center gap-2 text-sm leading-[21px] text-[rgb(14_165_233)] hover:underline"
        >
          {paywall.eligibility}
          <ChevronRightIcon className="size-4" />
        </Link>
        <div className="mt-8 grid grid-cols-2 gap-6 max-[599px]:grid-cols-1">
          {monetizationCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-border p-4"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-3 grow text-sm leading-[21px] text-muted">
                {card.body}
              </p>
              <div className="relative mt-3 aspect-[229/179] overflow-hidden rounded-xl">
                <Image
                  src={card.imageUrl}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
