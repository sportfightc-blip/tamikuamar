"use client";

import { useMemo } from "react";
import { supabase } from "../supabase/client";
import { useSupabaseTable } from "./useSupabaseTable";
import { Settings } from "../types";
import { DEFAULT_SETTINGS } from "../settings";

interface SettingsRow {
  id: number;
  pousada_name: string;
  default_checkin_time: string;
  default_checkout_time: string;
  people_per_table: number;
  greeting_message: string;
  closing_message: string;
}

function rowToSettings(row: SettingsRow): Settings {
  return {
    pousadaName: row.pousada_name,
    defaultCheckInTime: row.default_checkin_time,
    defaultCheckOutTime: row.default_checkout_time,
    peoplePerTable: row.people_per_table,
    greetingMessage: row.greeting_message,
    closingMessage: row.closing_message,
  };
}

export function useSettings() {
  const { rows } = useSupabaseTable<SettingsRow>("settings");
  const settings = useMemo(
    () => (rows.length > 0 ? rowToSettings(rows[0]) : DEFAULT_SETTINGS),
    [rows],
  );

  async function updateSettings(patch: Partial<Settings>): Promise<void> {
    const row: Record<string, unknown> = {};
    if (patch.pousadaName !== undefined) row.pousada_name = patch.pousadaName;
    if (patch.defaultCheckInTime !== undefined) row.default_checkin_time = patch.defaultCheckInTime;
    if (patch.defaultCheckOutTime !== undefined)
      row.default_checkout_time = patch.defaultCheckOutTime;
    if (patch.peoplePerTable !== undefined) row.people_per_table = patch.peoplePerTable;
    if (patch.greetingMessage !== undefined) row.greeting_message = patch.greetingMessage;
    if (patch.closingMessage !== undefined) row.closing_message = patch.closingMessage;

    const { error } = await supabase.from("settings").update(row).eq("id", 1);
    if (error) throw error;
  }

  return { settings, updateSettings };
}
