import { ArrowRightLeft, LogIn, LogOut, DoorClosed } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/CardTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { MovementItem } from "@/lib/types";

export function MovementCard({
  checkouts,
  checkins,
  occupied,
}: {
  checkouts: MovementItem[];
  checkins: MovementItem[];
  occupied: MovementItem[];
}) {
  const empty = checkouts.length === 0 && checkins.length === 0 && occupied.length === 0;

  return (
    <Card className="mb-4">
      <CardTitle icon={ArrowRightLeft}>Movimentação</CardTitle>
      {empty ? (
        <EmptyState message="Nenhuma entrada ou saída hoje." />
      ) : (
        <div className="flex flex-col gap-3">
          {checkouts.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-alert-600">
                <LogOut size={14} /> Saída
              </p>
              <ul className="flex flex-col gap-1">
                {checkouts.map((m) => (
                  <li key={m.roomId} className="flex justify-between text-sm">
                    <span className="font-medium text-foreground/85">{m.roomName}</span>
                    <span className="text-foreground/55">{m.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {checkins.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-sea-700">
                <LogIn size={14} /> Entrada
              </p>
              <ul className="flex flex-col gap-1">
                {checkins.map((m) => (
                  <li key={m.roomId} className="flex justify-between text-sm">
                    <span className="font-medium text-foreground/85">{m.roomName}</span>
                    <span className="text-foreground/55">{m.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {occupied.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ok-600">
                <DoorClosed size={14} /> Ocupados
              </p>
              <ul className="flex flex-col gap-1">
                {occupied.map((m) => (
                  <li key={m.roomId} className="text-sm font-medium text-foreground/85">
                    {m.roomName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
