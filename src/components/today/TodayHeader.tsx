import { Hand } from "lucide-react";
import { formatFullDatePt } from "@/lib/dates";

export function TodayHeader({ date }: { date: string }) {
  return (
    <div className="mb-6">
      <p className="flex items-center gap-1.5 text-sm text-foreground/50">
        Olá! <Hand size={15} />
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-sea-950">Hoje na Pousada</h1>
      <p className="mt-0.5 text-sm font-medium text-sea-700">{formatFullDatePt(date)}</p>
    </div>
  );
}
