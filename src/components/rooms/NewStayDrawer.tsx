"use client";

import { useEffect, useState } from "react";
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
  const [roomId, setRoomId] = useState<RoomId>(initialRoomId ?? ROOMS[0].id);

  useEffect(() => {
    if (open) setRoomId(initialRoomId ?? ROOMS[0].id);
  }, [open, initialRoomId]);

  function handleSubmit(input: StayInput) {
    addStay({ ...input, roomId });
    show("Hospedagem salva");
    onClose();
  }

  function handleCancelConflict(conflictStay: Stay) {
    releaseStay(conflictStay.id);
    show("Hospedagem conflitante cancelada");
  }

  return (
    <Drawer open={open} onClose={onClose} title="Nova hospedagem">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-foreground/60">Quarto</span>
          <select
            className="input"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value as RoomId)}
          >
            {ROOMS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <StayForm
          key={open ? `${initialRoomId ?? ""}-${initialCheckInDate ?? ""}` : "closed"}
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
          checkConflict={(ci, co) => findConflictingStay(roomId, ci, co, stays)}
          onSubmit={handleSubmit}
          onCancel={onClose}
          onCancelConflictingStay={handleCancelConflict}
          submitLabel="Salvar hospedagem"
        />
      </div>
    </Drawer>
  );
}
