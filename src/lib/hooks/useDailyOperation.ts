"use client";

import { useMemo } from "react";
import { useStays } from "./useStays";
import { useSettings } from "./useSettings";
import { getDailyOperation } from "../operations";

export function useDailyOperation(date: string) {
  const { stays } = useStays();
  const { settings } = useSettings();

  const operation = useMemo(
    () => getDailyOperation(date, stays, settings),
    [date, stays, settings],
  );

  return { operation, stays, settings };
}
