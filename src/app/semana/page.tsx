"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { WeeklyDayCard } from "@/components/week/WeeklyDayCard";
import { DayDetailDrawer } from "@/components/week/DayDetailDrawer";
import { WeeklySchedulePreview } from "@/components/week/WeeklySchedulePreview";
import { RoomTimeline } from "@/components/rooms/RoomTimeline";
import { StayEditDrawer } from "@/components/rooms/StayEditDrawer";
import { NewStayDrawer } from "@/components/rooms/NewStayDrawer";
import { useWeeklyOperation } from "@/lib/hooks/useWeeklyOperation";
import { todayISO } from "@/lib/dates";
import { DailyOperation, RoomId, Stay } from "@/lib/types";

export default function SemanaPage() {
  const today = todayISO();
  const { weekly } = useWeeklyOperation(today);
  const [selectedDay, setSelectedDay] = useState<DailyOperation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editingStay, setEditingStay] = useState<Stay | null>(null);
  const [newStayOpen, setNewStayOpen] = useState(false);
  const [newStayPrefill, setNewStayPrefill] = useState<{ roomId?: RoomId; date?: string }>({});

  return (
    <div>
      <PageHeader title="Semana" subtitle="Próximos 7 dias na pousada" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {weekly.summary.map((s, i) => (
          <WeeklyDayCard
            key={s.date}
            summary={s}
            onClick={() => setSelectedDay(weekly.days[i])}
          />
        ))}
      </div>

      <Button size="lg" className="my-6 w-full" onClick={() => setPreviewOpen(true)}>
        <CalendarCheck size={18} /> Gerar cronograma da semana
      </Button>

      <RoomTimeline
        onBarClick={(stay) => setEditingStay(stay)}
        onCellClick={(roomId, date) => {
          setNewStayPrefill({ roomId, date });
          setNewStayOpen(true);
        }}
      />

      <DayDetailDrawer
        operation={selectedDay}
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
      />

      <WeeklySchedulePreview
        startDate={today}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      <StayEditDrawer
        stay={editingStay}
        open={!!editingStay}
        onClose={() => setEditingStay(null)}
      />

      <NewStayDrawer
        open={newStayOpen}
        onClose={() => setNewStayOpen(false)}
        initialRoomId={newStayPrefill.roomId}
        initialCheckInDate={newStayPrefill.date}
      />
    </div>
  );
}
