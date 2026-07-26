import { v4 as uuid } from "uuid";
import { Stay } from "../types";
import { addDaysISO, todayISO } from "../dates";
import { staysCollection, seededCollection } from "./collections";
import { DEFAULT_SETTINGS } from "../settings";

function makeStay(input: Omit<Stay, "id" | "status" | "createdAt" | "updatedAt">): Stay {
  const now = new Date().toISOString();
  return { ...input, id: uuid(), status: "active", createdAt: now, updatedAt: now };
}

/** Popula dados de demonstração na primeira execução, se ainda não houver dados. */
export function seedDemoData(): void {
  if (typeof window === "undefined") return;
  if (seededCollection.getSnapshot()) return;

  const today = todayISO();

  const demoStays: Stay[] = [
    // Kãdara: ocupado (entrada anterior, saída futura)
    makeStay({
      roomId: "kadara",
      guestName: "João Silva",
      adults: 2,
      children: 0,
      checkInDate: addDaysISO(today, -1),
      checkOutDate: addDaysISO(today, 2),
      checkInTime: DEFAULT_SETTINGS.defaultCheckInTime,
      checkOutTime: DEFAULT_SETTINGS.defaultCheckOutTime,
      notes: "",
    }),
    // Akuã: checkout amanhã
    makeStay({
      roomId: "akua",
      guestName: "Maria Souza",
      adults: 2,
      children: 0,
      checkInDate: addDaysISO(today, -2),
      checkOutDate: addDaysISO(today, 1),
      checkInTime: DEFAULT_SETTINGS.defaultCheckInTime,
      checkOutTime: DEFAULT_SETTINGS.defaultCheckOutTime,
      notes: "",
    }),
    // Takape: check-in amanhã
    makeStay({
      roomId: "takape",
      guestName: "Carlos Pereira",
      adults: 2,
      children: 0,
      checkInDate: addDaysISO(today, 1),
      checkOutDate: addDaysISO(today, 4),
      checkInTime: DEFAULT_SETTINGS.defaultCheckInTime,
      checkOutTime: DEFAULT_SETTINGS.defaultCheckOutTime,
      notes: "",
    }),
  ];

  staysCollection.set(demoStays);
  seededCollection.set(true);
}

/** Remove todos os dados de demonstração/atuais, voltando o sistema ao zero. */
export function clearAllData(): void {
  staysCollection.set([]);
  seededCollection.set(true);
}
