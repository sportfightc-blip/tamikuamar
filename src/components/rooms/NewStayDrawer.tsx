"use client";

import { Drawer } from "@/components/ui/Drawer";
import { StayForm } from "./StayForm";
import { useStays, StayInput } from "@/lib/hooks/useStays";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { findConflictingStay } from "@/lib/operations";
import { ROOMS } from "@/lib/rooms";
import { addDaysISO } from "@/lib/dates";
import { RoomId, Stay } from "@/lib/types";

export function NewStayDrawer({
  open,
  onClose,
  initialRoomId,
  initialCheckInDate,
}: {
  open: boolean;
  onClose: () => void;
  initialRoomId?: RoomId;
  initialCheckInDate?: string;
}) {
  const { stays, addStay, releaseStay } = useStays();
  const { settings } = useSettings();
  const { show } = useToast();

  function handleSubmit(input: StayInput) {
    addStay(input);
    show("Hospedagem salva");
    onClose();
  }

  function handleCancelConflict(conflictStay: Stay) {
    releaseStay(conflictStay.id);
    show("Hospedagem conflitante cancelada");
  }

  return (
    <Drawer open={open} onClose={onClose} title="Nova hospedagem">
      <StayForm
        key={open ? `${initialRoomId ?? ""}-${initialCheckInDate ?? ""}` : "closed"}
        initialRoomId={initialRoomId ?? ROOMS[0].id}
        initial={
          initialCheckInDate
            ? {
                checkInDate: initialCheckInDate,
                checkOutDate: addDaysISO(initialCheckInDate, 1),
              }
            : undefined
        }
        defaultCheckInTime={settings.defaultCheckInTime}
        defaultCheckOutTime={settings.defaultCheckOutTime}
        checkConflict={(roomId, ci, co) => findConflictingStay(roomId, ci, co, stays)}
        onSubmit={handleSubmit}
        onCancel={onClose}
        onCancelConflictingStay={handleCancelConflict}
        submitLabel="Salvar hospedagem"
      />
    </Drawer>
  );
}
