"use client";

import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { CleaningChecklist } from "@/components/checklist/CleaningChecklist";
import { useDailyOperation } from "@/lib/hooks/useDailyOperation";
import { useTaskCompletions } from "@/lib/hooks/useTaskCompletions";
import { formatFullDatePt, todayISO } from "@/lib/dates";

export default function ChecklistPage() {
  const today = todayISO();
  const { operation } = useDailyOperation(today);
  const { isCompleted } = useTaskCompletions();

  const doneCount = operation.cleaning.filter((c) => isCompleted(today, c.roomId, c.type)).length;

  return (
    <div>
      <PageHeader title="Checklist" subtitle={formatFullDatePt(today)} />

      {operation.cleaning.length === 0 ? (
        <Card>
          <EmptyState icon={Sparkles} message="Nenhuma limpeza programada para hoje." />
        </Card>
      ) : (
        <>
          <Card className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-sea-950">Progresso geral</span>
              <span className="text-xs text-foreground/50">
                {doneCount} de {operation.cleaning.length} concluídas
              </span>
            </div>
            <ProgressBar value={doneCount} total={operation.cleaning.length} />
          </Card>

          <CleaningChecklist date={today} cleaning={operation.cleaning} />
        </>
      )}
    </div>
  );
}
