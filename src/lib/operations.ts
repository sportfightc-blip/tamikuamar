import { ROOMS, ROOM_IDS, getRoomName } from "./rooms";
import { addDaysISO, formatDayMonthPt, formatShortDatePt } from "./dates";
import {
  formatCleaningCount,
  formatEntryCount,
  formatExitCount,
  formatPeopleCount,
  formatRoomCount,
  formatTableCount,
} from "./format";
import {
  BreakfastGuest,
  BreakfastTotals,
  CleaningItem,
  DailyOperation,
  MovementItem,
  RoomId,
  Settings,
  Stay,
  WeeklyOperation,
} from "./types";

/** Total de pessoas de uma hospedagem (adultos + crianças). */
export function stayPeopleCount(stay: Stay): number {
  return stay.adults + stay.children;
}

function activeStays(stays: Stay[]): Stay[] {
  return stays.filter((s) => s.status === "active");
}

/** Hospedagem cujo período cobre a data (entrada <= date < saída). */
function staysCoveringDate(stays: Stay[], roomId: RoomId, date: string): Stay[] {
  return activeStays(stays).filter(
    (s) => s.roomId === roomId && s.checkInDate <= date && date < s.checkOutDate,
  );
}

/**
 * Hóspedes que tomam café no dia informado.
 * Regra: já fez check-in (checkInDate < date) e a saída é naquele dia ou depois (date <= checkOutDate).
 * Ou seja, o dia do checkout ainda conta café da manhã.
 */
export function getGuestsForBreakfast(date: string, stays: Stay[]): Stay[] {
  return activeStays(stays).filter(
    (s) => s.checkInDate < date && date <= s.checkOutDate,
  );
}

export function getBreakfastTotals(
  date: string,
  stays: Stay[],
  peoplePerTable: number,
): BreakfastTotals {
  const guests = getGuestsForBreakfast(date, stays);
  const items: BreakfastGuest[] = guests
    .map((s) => ({
      roomId: s.roomId,
      roomName: getRoomName(s.roomId),
      guestName: s.guestName,
      people: stayPeopleCount(s),
    }))
    .sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));

  const totalPeople = items.reduce((sum, g) => sum + g.people, 0);
  const totalTables = totalPeople > 0 ? Math.ceil(totalPeople / peoplePerTable) : 0;

  return { totalPeople, totalTables, guests: items };
}

/** Quartos ocupados de forma contínua no dia (não é dia de entrada nem de saída). */
export function getOccupiedRooms(date: string, stays: Stay[]): Stay[] {
  return activeStays(stays).filter(
    (s) => s.checkInDate < date && date < s.checkOutDate,
  );
}

export function getCheckins(date: string, stays: Stay[]): Stay[] {
  return activeStays(stays).filter((s) => s.checkInDate === date);
}

export function getCheckouts(date: string, stays: Stay[]): Stay[] {
  return activeStays(stays).filter((s) => s.checkOutDate === date);
}

/**
 * Tarefas de limpeza do dia.
 * Arrumação: quartos ocupados continuamente (sem check-in/checkout naquele dia).
 * Faxina: quartos com checkout naquele dia.
 */
export function getCleaningTasks(date: string, stays: Stay[]): CleaningItem[] {
  const faxinas: CleaningItem[] = getCheckouts(date, stays).map((s) => ({
    roomId: s.roomId,
    roomName: getRoomName(s.roomId),
    type: "faxina" as const,
  }));

  const arrumacoes: CleaningItem[] = getOccupiedRooms(date, stays).map((s) => ({
    roomId: s.roomId,
    roomName: getRoomName(s.roomId),
    type: "arrumacao" as const,
  }));

  faxinas.sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));
  arrumacoes.sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));

  return [...faxinas, ...arrumacoes];
}

/** Retorna a hospedagem existente que conflita com o período informado, se houver. */
export function findConflictingStay(
  roomId: RoomId,
  startDate: string,
  endDate: string,
  stays: Stay[],
  excludeStayId?: string,
): Stay | null {
  return (
    activeStays(stays).find((s) => {
      if (s.roomId !== roomId) return false;
      if (excludeStayId && s.id === excludeStayId) return false;
      // Sobreposição de intervalos [start,end) x [s.checkInDate, s.checkOutDate)
      return startDate < s.checkOutDate && endDate > s.checkInDate;
    }) ?? null
  );
}

export function hasBookingConflict(
  roomId: RoomId,
  startDate: string,
  endDate: string,
  stays: Stay[],
  excludeStayId?: string,
): boolean {
  return findConflictingStay(roomId, startDate, endDate, stays, excludeStayId) !== null;
}

export function getDailyOperation(date: string, stays: Stay[], settings: Settings): DailyOperation {
  const breakfast = getBreakfastTotals(date, stays, settings.peoplePerTable);
  const cleaning = getCleaningTasks(date, stays);

  const checkoutStays = getCheckouts(date, stays);
  const checkinStays = getCheckins(date, stays);
  const occupiedStays = getOccupiedRooms(date, stays);

  const checkouts: MovementItem[] = checkoutStays
    .map((s) => ({
      roomId: s.roomId,
      roomName: getRoomName(s.roomId),
      guestName: s.guestName,
      kind: "checkout" as const,
      time: s.checkOutTime,
    }))
    .sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));

  const checkins: MovementItem[] = checkinStays
    .map((s) => ({
      roomId: s.roomId,
      roomName: getRoomName(s.roomId),
      guestName: s.guestName,
      kind: "checkin" as const,
      time: s.checkInTime,
    }))
    .sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));

  const occupied: MovementItem[] = occupiedStays
    .map((s) => ({
      roomId: s.roomId,
      roomName: getRoomName(s.roomId),
      guestName: s.guestName,
      kind: "occupied" as const,
    }))
    .sort((a, b) => a.roomName.localeCompare(b.roomName, "pt-BR"));

  const occupiedRoomIds = new Set([
    ...checkoutStays.map((s) => s.roomId),
    ...checkinStays.map((s) => s.roomId),
    ...occupiedStays.map((s) => s.roomId),
  ]);
  const freeRooms = ROOM_IDS.filter((id) => !occupiedRoomIds.has(id));

  return {
    date,
    breakfast,
    cleaning,
    checkins,
    checkouts,
    occupied,
    freeRooms,
    occupiedCount: occupiedRoomIds.size,
    totalRooms: ROOMS.length,
  };
}

export function generateWeeklySchedule(startDate: string, stays: Stay[], settings: Settings): WeeklyOperation {
  const days: DailyOperation[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(getDailyOperation(addDaysISO(startDate, i), stays, settings));
  }
  const summary = days.map((d) => ({
    date: d.date,
    breakfastPeople: d.breakfast.totalPeople,
    breakfastTables: d.breakfast.totalTables,
    cleaningCount: d.cleaning.length,
    checkinsCount: d.checkins.length,
    checkoutsCount: d.checkouts.length,
    occupiedCount: d.occupiedCount,
  }));
  return { startDate, days, summary };
}

export function generateWhatsAppMessage(op: DailyOperation, settings: Settings): string {
  const lines: string[] = [];
  lines.push(settings.greetingMessage);
  lines.push(`🗓️ Segue o cronograma de amanhã, ${formatShortDatePt(op.date)}:`);
  lines.push("");

  // Café
  if (op.breakfast.totalPeople > 0) {
    lines.push(
      `🍳 Café: ${formatTableCount(op.breakfast.totalTables)}, ${formatPeopleCount(op.breakfast.totalPeople)}`,
    );
    for (const g of op.breakfast.guests) {
      lines.push(`• ${g.roomName}: ${formatPeopleCount(g.people)}`);
    }
  } else {
    lines.push("🍳 Nenhum café programado.");
  }
  lines.push("");

  // Limpeza
  if (op.cleaning.length > 0) {
    lines.push(`🧼 Limpeza: ${formatRoomCount(op.cleaning.length)}`);
    for (const c of op.cleaning) {
      lines.push(`• ${c.roomName}: ${c.type === "faxina" ? "faxina" : "arrumação"}`);
    }
  } else {
    lines.push("✨ Nenhuma limpeza programada.");
  }
  lines.push("");

  // Movimentação: saídas, entradas, ocupados
  const movementTotal = op.checkouts.length + op.checkins.length + op.occupied.length;
  if (movementTotal > 0) {
    lines.push(`🚪 Movimentação: ${formatRoomCount(movementTotal)}`);
    for (const m of op.checkouts) {
      lines.push(`• ${m.roomName}: saída — checkout ${m.time}`);
    }
    for (const m of op.checkins) {
      lines.push(`• ${m.roomName}: entrada — check-in ${m.time}`);
    }
    for (const m of op.occupied) {
      lines.push(`• ${m.roomName}: ocupado`);
    }
  } else {
    lines.push("🏠 Nenhuma entrada ou saída amanhã.");
  }
  lines.push("");

  lines.push(settings.closingMessage);

  return lines.join("\n");
}

export type RoomStatus =
  | "livre"
  | "ocupado"
  | "entrada-hoje"
  | "saida-hoje"
  | "entrada-amanha"
  | "saida-amanha";

export interface RoomStatusInfo {
  status: RoomStatus;
  currentStay: Stay | null;
  nextStay: Stay | null;
}

/** Status visual do quarto, derivado das datas de entrada/saída em relação a hoje. */
export function getRoomStatusInfo(roomId: RoomId, stays: Stay[], today: string): RoomStatusInfo {
  const roomStays = activeStays(stays)
    .filter((s) => s.roomId === roomId)
    .sort((a, b) => (a.checkInDate < b.checkInDate ? -1 : 1));

  const current =
    roomStays.find((s) => s.checkInDate <= today && today < s.checkOutDate) ?? null;
  const future = roomStays.filter((s) => s.checkInDate > today);
  const next = future.length > 0 ? future[0] : null;

  const tomorrow = addDaysISO(today, 1);

  let status: RoomStatus = "livre";
  if (current) {
    if (current.checkOutDate === today) status = "saida-hoje";
    else if (current.checkInDate === today) status = "entrada-hoje";
    else if (current.checkOutDate === tomorrow) status = "saida-amanha";
    else status = "ocupado";
  } else if (next && next.checkInDate === tomorrow) {
    status = "entrada-amanha";
  }

  return { status, currentStay: current, nextStay: next };
}

export function generateWeeklyMessage(weekly: WeeklyOperation, settings: Settings): string {
  const lines: string[] = [];
  lines.push(settings.greetingMessage);
  lines.push(
    `🗓️ Cronograma da semana: ${formatDayMonthPt(weekly.startDate)} a ${formatDayMonthPt(
      addDaysISO(weekly.startDate, 6),
    )}`,
  );
  lines.push("");

  for (const day of weekly.days) {
    lines.push(`📅 ${formatShortDatePt(day.date)}`);
    lines.push(
      `🍳 ${formatTableCount(day.breakfast.totalTables)}, ${formatPeopleCount(day.breakfast.totalPeople)} · 🧼 ${formatCleaningCount(
        day.cleaning.length,
      )} · 🔵 ${formatEntryCount(day.checkins.length)} · 🔴 ${formatExitCount(day.checkouts.length)} · 🏠 ${
        day.occupiedCount
      }/${day.totalRooms} ocupados`,
    );
    lines.push("");
  }

  lines.push(settings.closingMessage);
  return lines.join("\n");
}
