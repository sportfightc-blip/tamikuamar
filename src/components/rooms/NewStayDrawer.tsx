"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { StayForm } from "./StayForm";
import { useStays, StayInput } from "@/lib/hooks/useStays";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { hasBookingConflict } from "@/lib/operations";
import { ROOMS } from "@/lib/rooms";
import { RoomId } from "@/lib/types";

export function NewStayDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { stays, addStay } = useStays();
  const { settings } = useSettings();
  const { show } = useToast();
  const [roomId, setRoomId] = useState<RoomId>(ROOMS[0].id);

  function handleSubmit(input: StayInput) {
    addStay({ ...input, roomId });
    show("Hospedagem salva");
    onClose();
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
          defaultCheckInTime={settings.defaultCheckInTime}
          defaultCheckOutTime={settings.defaultCheckOutTime}
          checkConflict={(ci, co) => hasBookingConflict(roomId, ci, co, stays)}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Salvar hospedagem"
        />
      </div>
    </Drawer>
  );
}
