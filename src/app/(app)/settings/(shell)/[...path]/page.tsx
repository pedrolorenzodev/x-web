import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { settingsRedirects } from "@/features/settings/config/settings-tree";
import {
  findSettingsPage,
  settingsPageTitle,
} from "@/features/settings/utils/find-settings-page";
import { SettingsCategoryView } from "@/features/settings/components/settings-category-view";
import { SettingsLeafView } from "@/features/settings/components/settings-leaf-view";

type SettingsPathProps = {
  params: Promise<{ path: string[] }>;
};

function toPathname(path: string[]) {
  return `/settings/${path.join("/")}`;
}

export async function generateMetadata({ params }: SettingsPathProps): Promise<Metadata> {
  const { path } = await params;
  const page = findSettingsPage(toPathname(path));
  return { title: page ? `${settingsPageTitle(page)} / X` : "Settings / X" };
}

async function SettingsDetail({ params }: Pick<SettingsPathProps, "params">) {
  const { path } = await params;
  const pathname = toPathname(path);
  const target = settingsRedirects[pathname];
  if (target) redirect(target);

  const page = findSettingsPage(pathname);
  if (!page) notFound();

  return page.kind === "category" ? (
    <SettingsCategoryView category={page.category} />
  ) : (
    <SettingsLeafView title={page.title} parent={page.parent} />
  );
}

export default function SettingsPathPage({ params }: SettingsPathProps) {
  return (
    <Suspense fallback={null}>
      <SettingsDetail params={params} />
    </Suspense>
  );
}
