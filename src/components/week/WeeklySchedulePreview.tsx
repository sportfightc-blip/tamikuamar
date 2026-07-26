"use client";

import { Drawer } from "@/components/ui/Drawer";
import { WhatsAppMessagePreview } from "@/components/schedule/WhatsAppMessagePreview";
import { useWeeklyOperation } from "@/lib/hooks/useWeeklyOperation";
import { useSchedules } from "@/lib/hooks/useSchedules";
import { generateWeeklyMessage } from "@/lib/operations";

export function WeeklySchedulePreview({
  startDate,
  open,
  onClose,
}: {
  startDate: string;
  open: boolean;
  onClose: () => void;
}) {
  const { weekly, settings } = useWeeklyOperation(startDate);
  const { addSchedule } = useSchedules();
  const message = generateWeeklyMessage(weekly, settings);

  return (
    <Drawer open={open} onClose={onClose} title="Cronograma da semana">
      <WhatsAppMessagePreview
        initialMessage={message}
        onSave={(finalMessage) => {
          addSchedule(startDate, "weekly", finalMessage, weekly);
          onClose();
        }}
      />
    </Drawer>
  );
}
