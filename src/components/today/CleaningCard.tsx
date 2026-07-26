import { Sparkles, SprayCan } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/CardTitle";
import { EmptyState } from "@/components/ui/EmptyState";
import { CleaningItem } from "@/lib/types";

export function CleaningCard({ cleaning }: { cleaning: CleaningItem[] }) {
  const faxinas = cleaning.filter((c) => c.type === "faxina");
  const arrumacoes = cleaning.filter((c) => c.type === "arrumacao");

  return (
    <Card className="mb-4">
      <CardTitle icon={Sparkles}>Limpeza</CardTitle>
      {cleaning.length === 0 ? (
        <EmptyState message="Nenhuma limpeza programada." />
      ) : (
        <div className="flex flex-col gap-3">
          {faxinas.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-alert-600">
                <SprayCan size={14} /> Faxina
              </p>
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
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ok-600">
                <Sparkles size={14} /> Arrumação
              </p>
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
