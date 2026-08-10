"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { StayForm } from "./StayForm";
import { useStays, StayInput } from "@/lib/hooks/useStays";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { findConflictingStay } from "@/lib/operations";
import { getRoomName } from "@/lib/rooms";
import { Stay } from "@/lib/types";

/** Drawer para editar/cancelar uma hospedagem específica (não necessariamente a atual do dia). */
export function StayEditDrawer({
  stay,
  open,
  onClose,
}: {
  stay: Stay | null;
  open: boolean;
  onClose: () => void;
}) {
  const { stays, updateStay, releaseStay } = useStays();
  const { settings } = useSettings();
  const { show } = useToast();
  const [confirmRelease, setConfirmRelease] = useState(false);

  if (!stay) return null;

  function handleSubmit(input: StayInput) {
    updateStay(stay!.id, input);
    show("Hospedagem salva");
    onClose();
  }

  function handleCancelConflict(conflictStay: Stay) {
    releaseStay(conflictStay.id);
    show("Hospedagem conflitante cancelada");
  }

  return (
    <>
      <Drawer open={open} onClose={onClose} title={getRoomName(stay.roomId)}>
        <div className="flex flex-col gap-4">
          <StayForm
            initial={stay}
            initialRoomId={stay.roomId}
            defaultCheckInTime={settings.defaultCheckInTime}
            defaultCheckOutTime={settings.defaultCheckOutTime}
            checkConflict={(roomId, ci, co) =>
              findConflictingStay(roomId, ci, co, stays, stay.id)
            }
            onSubmit={handleSubmit}
            onCancel={onClose}
            onCancelConflictingStay={handleCancelConflict}
            submitLabel="Salvar alterações"
          />

          <Button variant="danger" className="w-full" onClick={() => setConfirmRelease(true)}>
            Cancelar hospedagem
          </Button>
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmRelease}
        title="Cancelar hospedagem?"
        description={`A hospedagem de ${stay.guestName} será removida.`}
        confirmLabel="Cancelar hospedagem"
        danger
        onCancel={() => setConfirmRelease(false)}
        onConfirm={() => {
          releaseStay(stay.id);
          setConfirmRelease(false);
          show("Hospedagem cancelada");
          onClose();
        }}
      />
    </>
  );
}
