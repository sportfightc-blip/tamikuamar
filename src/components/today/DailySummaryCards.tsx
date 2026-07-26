import { Coffee, Sparkles, LogIn, LogOut, Home } from "lucide-react";
import { DailyOperation } from "@/lib/types";
import { Card } from "@/components/ui/Card";

export function DailySummaryCards({ operation }: { operation: DailyOperation }) {
  const items = [
    { icon: Coffee, label: "Café", value: `${operation.breakfast.totalPeople}` },
    { icon: Sparkles, label: "Limpeza", value: `${operation.cleaning.length}` },
    { icon: LogIn, label: "Entradas", value: `${operation.checkins.length}` },
    { icon: LogOut, label: "Saídas", value: `${operation.checkouts.length}` },
    {
      icon: Home,
      label: "Ocupação",
      value: `${operation.occupiedCount}/${operation.totalRooms}`,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="flex flex-col items-center gap-1 py-3 text-center">
          <item.icon size={20} className="text-sea-700" />
          <span className="text-lg font-semibold text-sea-950">{item.value}</span>
          <span className="text-xs text-foreground/50">{item.label}</span>
        </Card>
      ))}
    </div>
  );
}
