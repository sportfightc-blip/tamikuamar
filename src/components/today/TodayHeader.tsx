import { formatFullDatePt } from "@/lib/dates";

export function TodayHeader({ date }: { date: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm text-foreground/50">Olá! 👋</p>
      <h1 className="text-2xl font-semibold tracking-tight text-sea-950">Hoje na Pousada</h1>
      <p className="mt-0.5 text-sm font-medium text-sea-700">{formatFullDatePt(date)}</p>
    </div>
  );
}
