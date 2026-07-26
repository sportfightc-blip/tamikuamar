"use client";

import { useMemo } from "react";
import { useStays } from "./useStays";
import { useSettings } from "./useSettings";
import { generateWeeklySchedule } from "../operations";

export function useWeeklyOperation(startDate: string) {
  const { stays } = useStays();
  const { settings } = useSettings();

  const weekly = useMemo(
    () => generateWeeklySchedule(startDate, stays, settings),
    [startDate, stays, settings],
  );

  return { weekly, settings };
}
