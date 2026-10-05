import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";

async function Unknown(): Promise<never> {
  await connection();
  notFound();
}

export default function UnknownPage() {
  return (
    <Suspense>
      <Unknown />
    </Suspense>
  );
}
