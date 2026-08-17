"use client";

import { useState } from "react";
import { Copy, Trash2, Inbox } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HistoryCard } from "@/components/history/HistoryCard";
import { useSchedules } from "@/lib/hooks/useSchedules";
import { useToast } from "@/components/ui/toast";
import { formatFullDatePt } from "@/lib/dates";
import { Schedule } from "@/lib/types";

export default function HistoricoPage() {
  const { schedules, removeSchedule } = useSchedules();
  const { show } = useToast();
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Schedule | null>(null);

  async function copy(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      show("Mensagem copiada");
    } catch {
      show("Não foi possível copiar", "error");
    }
  }

  return (
    <div>
      <PageHeader title="Histórico" subtitle="Cronogramas gerados anteriormente" />

      {schedules.length === 0 ? (
        <Card>
          <EmptyState icon={Inbox} message="Nenhum cronograma salvo ainda." />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {schedules.map((s) => (
            <HistoryCard key={s.id} schedule={s} onClick={() => setSelected(s)} />
          ))}
        </div>
      )}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? formatFullDatePt(selected.date) : ""}
        footer={
          selected ? (
            <>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => setConfirmDelete(selected)}
              >
                <Trash2 size={16} /> Excluir
              </Button>
              <Button className="flex-1" onClick={() => copy(selected.generatedMessage)}>
                <Copy size={16} /> Copiar novamente
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && (
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-foreground/85">
            {selected.generatedMessage}
          </pre>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir cronograma?"
        description="Este item será removido do histórico permanentemente."
        confirmLabel="Excluir"
        danger
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          try {
            if (confirmDelete) {
              await removeSchedule(confirmDelete.id);
              setSelected(null);
            }
            show("Cronograma excluído");
          } catch {
            show("Não foi possível excluir o cronograma", "error");
          } finally {
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}
