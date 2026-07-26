// Tipos centrais do domínio Tamikuã Mar

export type RoomId = "itoha" | "akua" | "kadara" | "takape" | "raio" | "tehe";

export interface Room {
  id: RoomId;
  name: string;
}

export type StayStatus = "active" | "cancelled";

export interface Stay {
  id: string;
  roomId: RoomId;
  guestName: string;
  adults: number;
  children: number;
  checkInDate: string; // ISO yyyy-MM-dd (data local, sem hora)
  checkOutDate: string; // ISO yyyy-MM-dd
  checkInTime: string; // HH:mm
  checkOutTime: string; // HH:mm
  notes: string;
  status: StayStatus;
  createdAt: string;
  updatedAt: string;
}

export type CleaningType = "arrumacao" | "faxina";

export interface CleaningTask {
  roomId: RoomId;
  type: CleaningType;
  stayId: string;
}

export interface TaskCompletion {
  id: string; // `${date}:${roomId}:${type}`
  date: string;
  roomId: RoomId;
  type: CleaningType;
  completed: boolean;
  completedAt: string | null;
}

export type ScheduleType = "daily" | "weekly";

export interface Schedule {
  id: string;
  date: string; // data de referência do cronograma (o dia retratado)
  type: ScheduleType;
  generatedMessage: string;
  snapshot: DailyOperation | WeeklyOperation;
  createdAt: string;
}

export interface Settings {
  pousadaName: string;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  peoplePerTable: number;
  greetingMessage: string;
  closingMessage: string;
}

export interface BreakfastGuest {
  roomId: RoomId;
  roomName: string;
  guestName: string;
  people: number;
}

export interface BreakfastTotals {
  totalPeople: number;
  totalTables: number;
  guests: BreakfastGuest[];
}

export interface CleaningItem {
  roomId: RoomId;
  roomName: string;
  type: CleaningType;
}

export interface MovementItem {
  roomId: RoomId;
  roomName: string;
  guestName: string;
  kind: "checkin" | "checkout" | "occupied";
  time?: string;
}

export interface DailyOperation {
  date: string; // yyyy-MM-dd
  breakfast: BreakfastTotals;
  cleaning: CleaningItem[];
  checkins: MovementItem[];
  checkouts: MovementItem[];
  occupied: MovementItem[];
  freeRooms: RoomId[];
  occupiedCount: number;
  totalRooms: number;
}

export interface WeeklyDaySummary {
  date: string;
  breakfastPeople: number;
  breakfastTables: number;
  cleaningCount: number;
  checkinsCount: number;
  checkoutsCount: number;
  occupiedCount: number;
}

export interface WeeklyOperation {
  startDate: string;
  days: DailyOperation[];
  summary: WeeklyDaySummary[];
}
