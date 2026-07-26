"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Home } from "lucide-react";
import { TodayHeader } from "@/components/today/TodayHeader";
import { DailySummaryCards } from "@/components/today/DailySummaryCards";
import { BreakfastCard } from "@/components/today/BreakfastCard";
import { CleaningCard } from "@/components/today/CleaningCard";
import { MovementCard } from "@/components/today/MovementCard";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { DailySchedulePreview } from "@/components/schedule/DailySchedulePreview";
import { useDailyOperation } from "@/lib/hooks/useDailyOperation";
import { useTaskCompletions } from "@/lib/hooks/useTaskCompletions";
import { addDaysISO, todayISO } from "@/lib/dates";

export default function HomePage() {
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const { operation } = useDailyOperation(today);
  const { isCompleted } = useTaskCompletions();
  const [previewOpen, setPreviewOpen] = useState(false);

  const doneCount = operation.cleaning.filter((c) => isCompleted(today, c.roomId, c.type)).length;

  return (
    <div>
      <TodayHeader date={today} />

      <DailySummaryCards operation={operation} />

      {operation.cleaning.length > 0 && (
        <Card className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-sea-950">Progresso da limpeza</span>
            <span className="text-xs text-foreground/50">
              {doneCount} de {operation.cleaning.length} concluídas
            </span>
          </div>
          <ProgressBar value={doneCount} total={operation.cleaning.length} />
        </Card>
      )}

      <BreakfastCard breakfast={operation.breakfast} />
      <CleaningCard cleaning={operation.cleaning} />
      <MovementCard
        checkouts={operation.checkouts}
        checkins={operation.checkins}
        occupied={operation.occupied}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/quartos" className="flex-1">
          <Button size="lg" variant="secondary" className="w-full">
            <Home size={18} /> Atualizar quartos
          </Button>
        </Link>
        <Button size="lg" className="flex-1" onClick={() => setPreviewOpen(true)}>
          <Send size={18} /> Gerar cronograma de amanhã
        </Button>
      </div>

      <DailySchedulePreview date={tomorrow} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
