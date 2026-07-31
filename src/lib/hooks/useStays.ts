"use client";

import { useMemo } from "react";
import { supabase } from "../supabase/client";
import { useSupabaseTable } from "./useSupabaseTable";
import { Stay } from "../types";

export type StayInput = {
  roomId: Stay["roomId"];
  guestName: string;
  adults: number;
  children: number;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  notes: string;
};

interface StayRow {
  id: string;
  room_id: string;
  guest_name: string;
  adults: number;
  children: number;
  check_in_date: string;
  check_out_date: string;
  check_in_time: string;
  check_out_time: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToStay(row: StayRow): Stay {
  return {
    id: row.id,
    roomId: row.room_id as Stay["roomId"],
    guestName: row.guest_name,
    adults: row.adults,
    children: row.children,
    checkInDate: row.check_in_date,
    checkOutDate: row.check_out_date,
    checkInTime: row.check_in_time,
    checkOutTime: row.check_out_time,
    notes: row.notes,
    status: row.status as Stay["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(input: StayInput & { roomId: Stay["roomId"] }) {
  return {
    room_id: input.roomId,
    guest_name: input.guestName,
    adults: input.adults,
    children: input.children,
    check_in_date: input.checkInDate,
    check_out_date: input.checkOutDate,
    check_in_time: input.checkInTime,
    check_out_time: input.checkOutTime,
    notes: input.notes,
  };
}

export function useStays() {
  const { rows } = useSupabaseTable<StayRow>("stays", { column: "check_in_date" });
  const stays = useMemo(() => rows.map(rowToStay), [rows]);

  async function addStay(input: StayInput): Promise<void> {
    const { error } = await supabase.from("stays").insert(inputToRow(input));
    if (error) throw error;
  }

  async function updateStay(id: string, input: Partial<StayInput>): Promise<void> {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.roomId !== undefined) patch.room_id = input.roomId;
    if (input.guestName !== undefined) patch.guest_name = input.guestName;
    if (input.adults !== undefined) patch.adults = input.adults;
    if (input.children !== undefined) patch.children = input.children;
    if (input.checkInDate !== undefined) patch.check_in_date = input.checkInDate;
    if (input.checkOutDate !== undefined) patch.check_out_date = input.checkOutDate;
    if (input.checkInTime !== undefined) patch.check_in_time = input.checkInTime;
    if (input.checkOutTime !== undefined) patch.check_out_time = input.checkOutTime;
    if (input.notes !== undefined) patch.notes = input.notes;

    const { error } = await supabase.from("stays").update(patch).eq("id", id);
    if (error) throw error;
  }

  async function releaseStay(id: string): Promise<void> {
    const { error } = await supabase
      .from("stays")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }

  async function removeStay(id: string): Promise<void> {
    const { error } = await supabase.from("stays").delete().eq("id", id);
    if (error) throw error;
  }

  return { stays, addStay, updateStay, releaseStay, removeStay };
}
