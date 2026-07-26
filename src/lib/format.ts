// Helpers de gramática automática (singular/plural) usados em toda a interface.

export function formatPeopleCount(n: number): string {
  return `${n} ${n === 1 ? "pessoa" : "pessoas"}`;
}

export function formatRoomCount(n: number): string {
  return `${n} ${n === 1 ? "quarto" : "quartos"}`;
}

export function formatTableCount(n: number): string {
  return `${n} ${n === 1 ? "mesa" : "mesas"}`;
}

export function formatChildrenCount(n: number): string {
  return `${n} ${n === 1 ? "criança" : "crianças"}`;
}

export function formatCleaningCount(n: number): string {
  return `${n} ${n === 1 ? "limpeza" : "limpezas"}`;
}

export function formatEntryCount(n: number): string {
  return `${n} ${n === 1 ? "entrada" : "entradas"}`;
}

export function formatExitCount(n: number): string {
  return `${n} ${n === 1 ? "saída" : "saídas"}`;
}
