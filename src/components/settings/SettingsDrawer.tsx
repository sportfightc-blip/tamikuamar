"use client";

import { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { supabase } from "@/lib/supabase/client";

export function SettingsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings, updateSettings } = useSettings();
  const { show } = useToast();
  const [form, setForm] = useState(settings);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (open) setForm(settings);
  }, [open, settings]);

  function save() {
    updateSettings(form);
    show("Configurações salvas");
    onClose();
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title="Configurações"
        footer={
          <>
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={save}>
              Salvar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Nome da pousada">
            <input
              className="input"
              value={form.pousadaName}
              onChange={(e) => setForm({ ...form, pousadaName: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in padrão">
              <input
                type="time"
                className="input"
                value={form.defaultCheckInTime}
                onChange={(e) => setForm({ ...form, defaultCheckInTime: e.target.value })}
              />
            </Field>
            <Field label="Checkout padrão">
              <input
                type="time"
                className="input"
                value={form.defaultCheckOutTime}
                onChange={(e) => setForm({ ...form, defaultCheckOutTime: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Pessoas por mesa">
            <input
              type="number"
              min={1}
              className="input"
              value={form.peoplePerTable}
              onChange={(e) =>
                setForm({ ...form, peoplePerTable: Math.max(1, Number(e.target.value)) })
              }
            />
          </Field>
          <Field label="Mensagem inicial">
            <textarea
              className="input min-h-[70px]"
              value={form.greetingMessage}
              onChange={(e) => setForm({ ...form, greetingMessage: e.target.value })}
            />
          </Field>
          <Field label="Mensagem final">
            <textarea
              className="input min-h-[70px]"
              value={form.closingMessage}
              onChange={(e) => setForm({ ...form, closingMessage: e.target.value })}
            />
          </Field>

          <button
            onClick={() => setConfirmClear(true)}
            className="mt-2 text-left text-sm font-medium text-alert-600"
          >
            Limpar todos os dados
          </button>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmClear}
        title="Limpar todos os dados?"
        description="Todas as hospedagens cadastradas serão removidas. Essa ação não pode ser desfeita."
        confirmLabel="Limpar dados"
        danger
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          const { error } = await supabase
            .from("stays")
            .delete()
            .gte("created_at", "1970-01-01");
          setConfirmClear(false);
          show(error ? "Não foi possível limpar os dados" : "Dados limpos", error ? "error" : "success");
        }}
      />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground/60">{label}</span>
      {children}
    </label>
  );
}
