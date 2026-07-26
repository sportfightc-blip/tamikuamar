"use client";

import { useSyncExternalStore } from "react";
import { LocalCollection } from "../db/localCollection";

export function useCollection<T>(collection: LocalCollection<T>): T {
  return useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot,
    collection.getSnapshot,
  );
}
