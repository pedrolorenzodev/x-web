import { BackButton } from "@/components/layout/back-button";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-3">
      <div className="relative z-0 bg-background/65 backdrop-blur-[12px]">
        <div className="flex h-[53px] items-center px-4">
          <div className="min-w-14">
            <BackButton />
          </div>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate py-0.5 text-xl font-bold">{title}</h2>
            {subtitle ? (
              <span className="truncate text-xs text-muted">{subtitle}</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
