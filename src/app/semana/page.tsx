"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WeeklyDayCard } from "@/components/week/WeeklyDayCard";
import { DayDetailDrawer } from "@/components/week/DayDetailDrawer";
import { WeeklySchedulePreview } from "@/components/week/WeeklySchedulePreview";
import { useWeeklyOperation } from "@/lib/hooks/useWeeklyOperation";
import { todayISO } from "@/lib/dates";
import { DailyOperation } from "@/lib/types";

export default function SemanaPage() {
  const today = todayISO();
  const { weekly } = useWeeklyOperation(today);
  const [selectedDay, setSelectedDay] = useState<DailyOperation | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-sea-950">Semana</h1>
        <p className="mt-0.5 text-sm text-foreground/50">Próximos 7 dias na pousada</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {weekly.summary.map((s, i) => (
          <WeeklyDayCard
            key={s.date}
            summary={s}
            onClick={() => setSelectedDay(weekly.days[i])}
          />
        ))}
      </div>

      <Button size="lg" className="mt-6 w-full" onClick={() => setPreviewOpen(true)}>
        <CalendarCheck size={18} /> Gerar cronograma da semana
      </Button>

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
    </div>
  );
}
