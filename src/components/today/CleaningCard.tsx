import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CleaningItem } from "@/lib/types";

export function CleaningCard({ cleaning }: { cleaning: CleaningItem[] }) {
  const faxinas = cleaning.filter((c) => c.type === "faxina");
  const arrumacoes = cleaning.filter((c) => c.type === "arrumacao");

  return (
    <Card className="mb-4">
      <h2 className="mb-3 text-sm font-semibold text-sea-950">🧹 Limpeza</h2>
      {cleaning.length === 0 ? (
        <EmptyState message="Nenhuma limpeza programada." />
      ) : (
        <div className="flex flex-col gap-3">
          {faxinas.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-alert-600">🔴 Faxina</p>
              <ul className="flex flex-col gap-1">
                {faxinas.map((c) => (
                  <li key={c.roomId} className="text-sm font-medium text-foreground/85">
                    {c.roomName}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {arrumacoes.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-ok-600">🟢 Arrumação</p>
              <ul className="flex flex-col gap-1">
                {arrumacoes.map((c) => (
                  <li key={c.roomId} className="text-sm font-medium text-foreground/85">
                    {c.roomName}
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
