import { Hand } from "lucide-react";
import { formatFullDatePt } from "@/lib/dates";

export function TodayHeader({ date }: { date: string }) {
  return (
    <div className="mb-6">
      <p className="flex items-center gap-1.5 text-sm text-white/60">
        Olá! <Hand size={15} />
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Hoje na Pousada</h1>
      <p className="mt-0.5 text-sm font-medium text-gold-400">{formatFullDatePt(date)}</p>
    </div>
  );
}
