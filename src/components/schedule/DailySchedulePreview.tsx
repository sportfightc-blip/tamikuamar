"use client";

import { Drawer } from "@/components/ui/Drawer";
import { WhatsAppMessagePreview } from "./WhatsAppMessagePreview";
import { formatFullDatePt } from "@/lib/dates";
import { useDailyOperation } from "@/lib/hooks/useDailyOperation";
import { generateWhatsAppMessage } from "@/lib/operations";
import { useSchedules } from "@/lib/hooks/useSchedules";

export function DailySchedulePreview({
  date,
  open,
  onClose,
}: {
  date: string;
  open: boolean;
  onClose: () => void;
}) {
  const { operation, settings } = useDailyOperation(date);
  const { addSchedule } = useSchedules();
  const message = generateWhatsAppMessage(operation, settings);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Cronograma de ${formatFullDatePt(date)}`}
    >
      <WhatsAppMessagePreview
        initialMessage={message}
        onSave={(finalMessage) => {
          addSchedule(date, "daily", finalMessage, operation);
          onClose();
        }}
      />
    </Drawer>
  );
}
