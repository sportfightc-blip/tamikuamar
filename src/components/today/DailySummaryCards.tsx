import { DailyOperation } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function DailySummaryCards({ operation }: { operation: DailyOperation }) {
  const items = [
    { icon: "🍳", label: "Café", value: `${operation.breakfast.totalPeople}` },
    { icon: "🧹", label: "Limpeza", value: `${operation.cleaning.length}` },
    { icon: "🔵", label: "Entradas", value: `${operation.checkins.length}` },
    { icon: "🔴", label: "Saídas", value: `${operation.checkouts.length}` },
    {
      icon: "🏠",
      label: "Ocupação",
      value: `${operation.occupiedCount}/${operation.totalRooms}`,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="flex flex-col items-center gap-0.5 py-3 text-center">
          <span className="text-xl">{item.icon}</span>
          <span className="text-lg font-semibold text-sea-950">{item.value}</span>
          <span className="text-xs text-foreground/50">{item.label}</span>
        </Card>
      ))}
    </div>
  );
}
