"use client";

import { settingsCollection } from "../db/collections";
import { useCollection } from "./useCollection";
import { Settings } from "../types";

export function useSettings() {
  const settings = useCollection(settingsCollection);

  function updateSettings(patch: Partial<Settings>): void {
    settingsCollection.update((current) => ({ ...current, ...patch }));
  }

  return { settings, updateSettings };
}
