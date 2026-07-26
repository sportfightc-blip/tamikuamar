import { Card } from "@/components/ui/Card";
import { RoomStatusBadge } from "./RoomStatusBadge";
import { RoomStatusInfo, stayPeopleCount } from "@/lib/operations";
import { formatShortDatePt } from "@/lib/dates";
import { formatPeopleCount } from "@/lib/format";
import { Room } from "@/lib/types";

export function RoomCard({
  room,
  statusInfo,
  onClick,
}: {
  room: Room;
  statusInfo: RoomStatusInfo;
  onClick: () => void;
}) {
  const stay = statusInfo.currentStay;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-sea-950">{room.name}</h3>
        <RoomStatusBadge status={statusInfo.status} />
      </div>

      {stay ? (
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-medium text-foreground/85">{stay.guestName}</p>
          <p className="text-foreground/55">👥 {formatPeopleCount(stayPeopleCount(stay))}</p>
          <p className="text-foreground/55">
            {formatShortDatePt(stay.checkInDate)} → {formatShortDatePt(stay.checkOutDate)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-foreground/40">Sem hóspede no momento</p>
      )}
    </Card>
  );
}
