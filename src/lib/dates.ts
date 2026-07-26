// Utilidades de data em fuso local (Brasil), evitando bugs de UTC.
// Datas de hospedagem são tratadas como strings yyyy-MM-dd + construção local de Date.

const WEEKDAYS_FULL = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const WEEKDAYS_SHORT = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

const MONTHS_FULL = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

/** Converte yyyy-MM-dd em Date local (sem deslocamento de UTC). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Converte Date local em yyyy-MM-dd. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function compareISODate(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isBeforeISO(a: string, b: string): boolean {
  return a < b;
}

export function isAfterISO(a: string, b: string): boolean {
  return a > b;
}

/** Ex: "Domingo, 26 de julho" */
export function formatFullDatePt(iso: string): string {
  const date = parseISODate(iso);
  const weekday = WEEKDAYS_FULL[date.getDay()];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized}, ${date.getDate()} de ${MONTHS_FULL[date.getMonth()]}`;
}

/** Ex: "26/jul" */
export function formatShortDatePt(iso: string): string {
  const date = parseISODate(iso);
  return `${String(date.getDate()).padStart(2, "0")}/${MONTHS_SHORT[date.getMonth()]}`;
}

/** Ex: "26 de julho" */
export function formatDayMonthPt(iso: string): string {
  const date = parseISODate(iso);
  return `${date.getDate()} de ${MONTHS_FULL[date.getMonth()]}`;
}

/** Ex: { weekday: "SEG", day: "27", month: "JUL" } */
export function formatWeekdayShortPt(iso: string) {
  const date = parseISODate(iso);
  return {
    weekday: WEEKDAYS_SHORT[date.getDay()],
    day: String(date.getDate()).padStart(2, "0"),
    month: MONTHS_SHORT[date.getMonth()].toUpperCase(),
  };
}

/** Ex: "julho 2026" */
export function formatMonthYearPt(year: number, monthIndex0: number): string {
  return `${MONTHS_FULL[monthIndex0]} ${year}`;
}

/** yyyy-MM-dd do primeiro dia do mês. */
export function monthFirstDayISO(year: number, monthIndex0: number): string {
  return toISODate(new Date(year, monthIndex0, 1));
}

/** Quantidade de dias no mês. */
export function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

/** Diferença em dias inteiros entre duas datas ISO (b - a). */
export function diffDaysISO(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / msPerDay);
}
