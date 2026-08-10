"use client";

import { useState } from "react";
import { Users, StickyNote, Plus, X } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { StayForm } from "./StayForm";
import { useStays, StayInput } from "@/lib/hooks/useStays";
import { useSettings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/toast";
import { findConflictingStay, stayPeopleCount, getRoomStatusInfo } from "@/lib/operations";
import { formatShortDatePt, todayISO } from "@/lib/dates";
import { formatPeopleCount } from "@/lib/format";
import { Room, Stay } from "@/lib/types";

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
  const [confirmCancelNext, setConfirmCancelNext] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const today = todayISO();
  const statusInfo = getRoomStatusInfo(room.id, stays, today);
  const stay = statusInfo.currentStay;
  const showForm = !stay || creatingNew;

  function handleSubmit(input: StayInput) {
    if (stay && !creatingNew) {
      updateStay(stay.id, input);
      show("Hospedagem salva");
    } else {
      addStay(input);
      show("Hospedagem salva");
      setCreatingNew(false);
    }
    onClose();
  }

  function handleCancelConflict(conflictStay: Stay) {
    releaseStay(conflictStay.id);
    show("Hospedagem conflitante cancelada");
  }

  return (
    <>
      <Drawer open={open} onClose={onClose} title={room.name}>
        {!showForm && stay ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-sand-50 p-3 text-sm">
              <p className="font-medium text-foreground/85">{stay.guestName}</p>
              <p className="mt-1 flex items-center gap-1.5 text-foreground/55">
                <Users size={14} /> {formatPeopleCount(stayPeopleCount(stay))}
              </p>
              <p className="text-foreground/55">
                {formatShortDatePt(stay.checkInDate)} → {formatShortDatePt(stay.checkOutDate)}
              </p>
              <p className="text-foreground/55">
                Check-in {stay.checkInTime} · Checkout {stay.checkOutTime}
              </p>
              {stay.notes && (
                <p className="mt-1 flex items-start gap-1.5 text-foreground/55">
                  <StickyNote size={14} className="mt-0.5 shrink-0" /> {stay.notes}
                </p>
              )}
            </div>

            {statusInfo.nextStay && (
              <div className="rounded-xl border border-sand-200 p-3 text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground/50">Próxima hospedagem</p>
                  <button
                    type="button"
                    onClick={() => setConfirmCancelNext(true)}
                    className="flex items-center gap-1 text-xs font-medium text-alert-600 hover:underline"
                  >
                    <X size={13} /> Cancelar
                  </button>
                </div>
                <p className="font-medium text-foreground/80">{statusInfo.nextStay.guestName}</p>
                <p className="text-foreground/55">
                  {formatShortDatePt(statusInfo.nextStay.checkInDate)} →{" "}
                  {formatShortDatePt(statusInfo.nextStay.checkOutDate)}
                </p>
              </div>
            )}

            <StayForm
              initial={stay}
              initialRoomId={room.id}
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

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setCreatingNew(true)}
              >
                <Plus size={16} /> Nova hospedagem
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmRelease(true)}
                className="flex-1"
              >
                Liberar quarto
              </Button>
            </div>
          </div>
        ) : (
          <StayForm
            initialRoomId={room.id}
            defaultCheckInTime={settings.defaultCheckInTime}
            defaultCheckOutTime={settings.defaultCheckOutTime}
            checkConflict={(roomId, ci, co) => findConflictingStay(roomId, ci, co, stays)}
            onSubmit={handleSubmit}
            onCancel={() => (creatingNew ? setCreatingNew(false) : onClose())}
            onCancelConflictingStay={handleCancelConflict}
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
          show("Quarto liberado");
          onClose();
        }}
      />

      <ConfirmDialog
        open={confirmCancelNext}
        title="Cancelar hospedagem?"
        description={`A hospedagem de ${statusInfo.nextStay?.guestName ?? "hóspede"} será removida.`}
        confirmLabel="Cancelar hospedagem"
        danger
        onCancel={() => setConfirmCancelNext(false)}
        onConfirm={() => {
          if (statusInfo.nextStay) releaseStay(statusInfo.nextStay.id);
          setConfirmCancelNext(false);
          show("Hospedagem cancelada");
        }}
      />
    </>
  );
}
