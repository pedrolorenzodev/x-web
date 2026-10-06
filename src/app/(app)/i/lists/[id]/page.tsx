import type { Metadata } from "next";
import { getList } from "@/features/lists/api/get-list";
import { ListScreen } from "@/app/(app)/i/lists/[id]/_components/list-screen";

export async function generateMetadata({
  params,
}: PageProps<"/i/lists/[id]">): Promise<Metadata> {
  const { id } = await params;
  const list = await getList(id);
  return { title: list ? `${list.name} / X` : "Page not found / X" };
}

export default function ListPage({ params }: PageProps<"/i/lists/[id]">) {
  return <ListScreen params={params} />;
}
