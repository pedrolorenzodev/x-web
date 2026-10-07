import type { TweetRecord } from "@/mocks/tweets";

type IncomingTweet = Pick<TweetRecord, "authorId" | "text">;

const incomingBatches: IncomingTweet[][] = [
  [
    {
      authorId: "1767536918198194176",
      text: "Arrancamos la semana con 3 flotas nuevas en Córdoba. Despacito pero firme.",
    },
    {
      authorId: "431231040",
      text: "hot take: el mejor feature es el que borrás antes de shippear",
    },
    {
      authorId: "1149371887123873794",
      text: "Revisando onboarding con el equipo. Cada pantalla que sacamos sube la conversión.",
    },
  ],
  [
    {
      authorId: "14154963",
      text: "Café, VS Code y lluvia en Buenos Aires. Martes ideal para refactorizar.",
    },
    {
      authorId: "1281715860726517766",
      text: "Cuántas pestañas abiertas tienen ahora mismo? Yo 47 y no pienso cerrar ninguna",
    },
  ],
];

const deliveredIds = new Set<string>();
let nextBatch = 0;

export function peekIncomingBatch(): IncomingTweet[] {
  return incomingBatches[nextBatch] ?? [];
}

export function takeIncomingBatch(): IncomingTweet[] {
  const batch = peekIncomingBatch();
  if (batch.length) nextBatch += 1;
  return batch;
}

export function markIncomingDelivered(id: string) {
  deliveredIds.add(id);
}

export function isIncomingDelivered(id: string) {
  return deliveredIds.has(id);
}
