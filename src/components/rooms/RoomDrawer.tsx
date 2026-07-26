"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { StayForm } from "./StayForm";
import { useStays, StayInput } from "@/lib/hooks/useStays";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { hasBookingConflict, stayPeopleCount, getRoomStatusInfo } from "@/lib/operations";
import { formatShortDatePt, todayISO } from "@/lib/dates";
import { formatPeopleCount } from "@/lib/format";
import { Room } from "@/lib/types";

export function RoomDrawer({
  room,
  open,
  onClose,
}: {
  room: Room;
  open: boolean;
  onClose: () => void;
}) {
  const { stays, addStay, updateStay, releaseStay } = useStays();
  const { settings } = useSettings();
  const { show } = useToast();
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const today = todayISO();
  const statusInfo = getRoomStatusInfo(room.id, stays, today);
  const stay = statusInfo.currentStay;
  const showForm = !stay || creatingNew;

  function handleSubmit(input: StayInput) {
    if (stay && !creatingNew) {
      updateStay(stay.id, input);
      show("✅ Hospedagem salva");
    } else {
      addStay({ ...input, roomId: room.id });
      show("✅ Hospedagem salva");
      setCreatingNew(false);
    }
    onClose();
  }

  return (
    <>
      <Drawer open={open} onClose={onClose} title={room.name}>
        {!showForm && stay ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-sand-50 p-3 text-sm">
              <p className="font-medium text-foreground/85">{stay.guestName}</p>
              <p className="mt-1 text-foreground/55">
                👥 {formatPeopleCount(stayPeopleCount(stay))}
              </p>
              <p className="text-foreground/55">
                {formatShortDatePt(stay.checkInDate)} → {formatShortDatePt(stay.checkOutDate)}
              </p>
              <p className="text-foreground/55">
                Check-in {stay.checkInTime} · Checkout {stay.checkOutTime}
              </p>
              {stay.notes && <p className="mt-1 text-foreground/55">📝 {stay.notes}</p>}
            </div>

            {statusInfo.nextStay && (
              <div className="rounded-xl border border-sand-200 p-3 text-sm">
                <p className="mb-1 text-xs font-medium text-foreground/50">Próxima hospedagem</p>
                <p className="font-medium text-foreground/80">{statusInfo.nextStay.guestName}</p>
                <p className="text-foreground/55">
                  {formatShortDatePt(statusInfo.nextStay.checkInDate)} →{" "}
                  {formatShortDatePt(statusInfo.nextStay.checkOutDate)}
                </p>
              </div>
            )}

            <StayForm
              initial={stay}
              defaultCheckInTime={settings.defaultCheckInTime}
              defaultCheckOutTime={settings.defaultCheckOutTime}
              checkConflict={(ci, co) => hasBookingConflict(room.id, ci, co, stays, stay.id)}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitLabel="Salvar alterações"
            />

            <Button
              variant="danger"
              onClick={() => setConfirmRelease(true)}
              className="w-full"
            >
              Liberar quarto
            </Button>
          </div>
        ) : (
          <StayForm
            defaultCheckInTime={settings.defaultCheckInTime}
            defaultCheckOutTime={settings.defaultCheckOutTime}
            checkConflict={(ci, co) => hasBookingConflict(room.id, ci, co, stays)}
            onSubmit={handleSubmit}
            onCancel={() => (creatingNew ? setCreatingNew(false) : onClose())}
            submitLabel="Salvar hospedagem"
          />
        )}
      </Drawer>

      <ConfirmDialog
        open={confirmRelease}
        title="Liberar quarto?"
        description={`Os dados da hospedagem de ${stay?.guestName ?? "hóspede"} serão apagados.`}
        confirmLabel="Liberar quarto"
        danger
        onCancel={() => setConfirmRelease(false)}
        onConfirm={() => {
          if (stay) releaseStay(stay.id);
          setConfirmRelease(false);
          show("✅ Quarto liberado");
          onClose();
        }}
      />
    </>
  );
}
