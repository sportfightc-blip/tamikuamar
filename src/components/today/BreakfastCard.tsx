import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BreakfastTotals } from "@/lib/types";
import { formatPeopleCount, formatTableCount } from "@/lib/format";

export function BreakfastCard({ breakfast }: { breakfast: BreakfastTotals }) {
  return (
    <Card className="mb-4">
      <h2 className="mb-3 text-sm font-semibold text-sea-950">🍳 Café da manhã</h2>
      {breakfast.totalPeople === 0 ? (
        <EmptyState message="Nenhum café programado." />
      ) : (
        <>
          <p className="mb-2 text-xs text-foreground/50">
            {formatTableCount(breakfast.totalTables)} — {formatPeopleCount(breakfast.totalPeople)}
          </p>
          <ul className="flex flex-col gap-1.5">
            {breakfast.guests.map((g) => (
              <li key={g.roomId} className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground/85">{g.roomName}</span>
                <span className="text-foreground/55">{formatPeopleCount(g.people)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
