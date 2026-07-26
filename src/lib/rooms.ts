import { Room, RoomId } from "./types";

// Fonte única de verdade para os quartos da pousada.
export const ROOMS: Room[] = [
  { id: "itoha", name: "Itohã" },
  { id: "akua", name: "Akuã" },
  { id: "kadara", name: "Kãdara" },
  { id: "takape", name: "Takape" },
  { id: "raio", name: "Raiô" },
  { id: "tehe", name: "Tehé" },
];

export const ROOM_IDS: RoomId[] = ROOMS.map((r) => r.id);

export function getRoomName(roomId: RoomId): string {
  return ROOMS.find((r) => r.id === roomId)?.name ?? roomId;
}
