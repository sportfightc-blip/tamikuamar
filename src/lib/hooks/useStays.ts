"use client";

import { v4 as uuid } from "uuid";
import { staysCollection } from "../db/collections";
import { useCollection } from "./useCollection";
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

export function useStays() {
  const stays = useCollection(staysCollection);

  function addStay(input: StayInput): Stay {
    const now = new Date().toISOString();
    const stay: Stay = {
      id: uuid(),
      ...input,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    staysCollection.update((current) => [...current, stay]);
    return stay;
  }

  function updateStay(id: string, input: Partial<StayInput>): void {
    staysCollection.update((current) =>
      current.map((s) =>
        s.id === id ? { ...s, ...input, updatedAt: new Date().toISOString() } : s,
      ),
    );
  }

  function releaseStay(id: string): void {
    staysCollection.update((current) =>
      current.map((s) =>
        s.id === id
          ? { ...s, status: "cancelled" as const, updatedAt: new Date().toISOString() }
          : s,
      ),
    );
  }

  function removeStay(id: string): void {
    staysCollection.update((current) => current.filter((s) => s.id !== id));
  }

  return { stays, addStay, updateStay, releaseStay, removeStay };
}
