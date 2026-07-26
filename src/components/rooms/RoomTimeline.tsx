"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ROOMS } from "@/lib/rooms";
import { useStays } from "@/lib/hooks/useStays";
import {
  daysInMonth,
  diffDaysISO,
  formatMonthYearPt,
  monthFirstDayISO,
  parseISODate,
  todayISO,
} from "@/lib/dates";
import { Stay } from "@/lib/types";

const DAY_WIDTH = 36;
const ROW_HEIGHT = 44;

export function RoomTimeline({
  onBarClick,
  onCellClick,
}: {
  onBarClick: (stay: Stay) => void;
  onCellClick: (roomId: (typeof ROOMS)[number]["id"], date: string) => void;
}) {
  const { stays } = useStays();
  const today = todayISO();
  const now = parseISODate(today);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const firstDay = monthFirstDayISO(viewYear, viewMonth);
  const numDays = daysInMonth(viewYear, viewMonth);
  const nextMonthFirst = useMemo(() => {
    const d = parseISODate(firstDay);
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  }, [firstDay]);

  function goToMonth(delta: number) {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewYear(y);
    setViewMonth(m);
  }

  function goToday() {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  }

  const activeStays = stays.filter((s) => s.status === "active");

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-sand-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-sea-950 capitalize">
          {formatMonthYearPt(viewYear, viewMonth)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToMonth(-1)}
            className="rounded-lg p-1.5 text-sea-900/60 hover:bg-sand-100"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToday}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-sea-800 hover:bg-sand-100"
          >
            Hoje
          </button>
          <button
            onClick={() => goToMonth(1)}
            className="rounded-lg p-1.5 text-sea-900/60 hover:bg-sand-100"
            aria-label="Próximo mês"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-20 shrink-0 border-r border-sand-200">
          <div className="h-8 border-b border-sand-200" />
          {ROOMS.map((room) => (
            <div
              key={room.id}
              className="flex items-center border-b border-sand-200/60 px-2 text-xs font-medium text-foreground/75 last:border-b-0"
              style={{ height: ROW_HEIGHT }}
            >
              {room.name}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div style={{ width: numDays * DAY_WIDTH }}>
            <div className="flex h-8 border-b border-sand-200">
              {Array.from({ length: numDays }, (_, i) => i + 1).map((dayNum) => {
                const iso = `${firstDay.slice(0, 8)}${String(dayNum).padStart(2, "0")}`;
                const isToday = iso === today;
                return (
                  <div
                    key={dayNum}
                    className="flex shrink-0 items-center justify-center text-[10px] font-medium text-foreground/50"
                    style={{ width: DAY_WIDTH }}
                  >
                    <span
                      className={
                        isToday
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-sea-800 text-white"
                          : ""
                      }
                    >
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>

            {ROOMS.map((room) => {
              const roomStays = activeStays.filter(
                (s) =>
                  s.roomId === room.id &&
                  s.checkOutDate > firstDay &&
                  s.checkInDate < nextMonthFirst,
              );

              return (
                <div
                  key={room.id}
                  className="relative border-b border-sand-200/60 last:border-b-0"
                  style={{ height: ROW_HEIGHT, width: numDays * DAY_WIDTH }}
                >
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: numDays }, (_, i) => i + 1).map((dayNum) => {
                      const iso = `${firstDay.slice(0, 8)}${String(dayNum).padStart(2, "0")}`;
                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => onCellClick(room.id, iso)}
                          className="h-full shrink-0 border-r border-sand-200/30 last:border-r-0 hover:bg-sea-50"
                          style={{ width: DAY_WIDTH }}
                          aria-label={`Nova hospedagem em ${room.name}, ${iso}`}
                        />
                      );
                    })}
                  </div>

                  {roomStays.map((stay) => {
                    const clampedStart = stay.checkInDate < firstDay ? firstDay : stay.checkInDate;
                    const clampedEnd =
                      stay.checkOutDate > nextMonthFirst ? nextMonthFirst : stay.checkOutDate;
                    const startIndex = diffDaysISO(firstDay, clampedStart);
                    const spanDays = Math.max(1, diffDaysISO(clampedStart, clampedEnd));

                    return (
                      <button
                        key={stay.id}
                        type="button"
                        onClick={() => onBarClick(stay)}
                        className="absolute top-1.5 flex items-center overflow-hidden rounded-lg bg-sea-800 px-2 text-left text-xs font-medium text-white shadow-sm hover:bg-sea-900"
                        style={{
                          left: startIndex * DAY_WIDTH + 2,
                          width: spanDays * DAY_WIDTH - 4,
                          height: ROW_HEIGHT - 12,
                        }}
                        title={stay.guestName}
                      >
                        <span className="truncate">{stay.guestName}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
