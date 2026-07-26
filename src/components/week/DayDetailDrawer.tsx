import { Drawer } from "@/components/ui/Drawer";
import { BreakfastCard } from "@/components/today/BreakfastCard";
import { CleaningCard } from "@/components/today/CleaningCard";
import { MovementCard } from "@/components/today/MovementCard";
import { DailyOperation } from "@/lib/types";
import { formatFullDatePt } from "@/lib/dates";

export function DayDetailDrawer({
  operation,
  open,
  onClose,
}: {
  operation: DailyOperation | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} title={operation ? formatFullDatePt(operation.date) : ""}>
      {operation && (
        <>
          <BreakfastCard breakfast={operation.breakfast} />
          <CleaningCard cleaning={operation.cleaning} />
          <MovementCard
            checkouts={operation.checkouts}
            checkins={operation.checkins}
            occupied={operation.occupied}
          />
        </>
      )}
    </Drawer>
  );
}
