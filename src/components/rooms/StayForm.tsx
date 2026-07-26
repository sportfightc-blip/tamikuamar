"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StayInput } from "@/lib/hooks/useStays";
import { todayISO } from "@/lib/dates";

export function StayForm({
  initial,
  defaultCheckInTime,
  defaultCheckOutTime,
  checkConflict,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: {
  initial?: Partial<StayInput>;
  defaultCheckInTime: string;
  defaultCheckOutTime: string;
  checkConflict?: (checkInDate: string, checkOutDate: string) => boolean;
  onSubmit: (input: StayInput) => void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [guestName, setGuestName] = useState(initial?.guestName ?? "");
  const [adults, setAdults] = useState(initial?.adults ?? 2);
  const [children, setChildren] = useState(initial?.children ?? 0);
  const [checkInDate, setCheckInDate] = useState(initial?.checkInDate ?? todayISO());
  const [checkOutDate, setCheckOutDate] = useState(initial?.checkOutDate ?? todayISO());
  const [checkInTime, setCheckInTime] = useState(initial?.checkInTime ?? defaultCheckInTime);
  const [checkOutTime, setCheckOutTime] = useState(initial?.checkOutTime ?? defaultCheckOutTime);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const dateError = checkOutDate <= checkInDate ? "A saída deve ser depois da entrada." : null;
  const conflictError =
    !dateError && checkConflict?.(checkInDate, checkOutDate)
      ? "Este quarto já possui uma hospedagem neste período."
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (dateError || !guestName.trim()) return;
    onSubmit({
      guestName: guestName.trim(),
      adults,
      children,
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      notes,
    } as StayInput);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Nome do hóspede">
        <input
          className="input"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Ex: João Silva"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Adultos">
          <input
            type="number"
            min={0}
            className="input"
            value={adults}
            onChange={(e) => setAdults(Math.max(0, Number(e.target.value)))}
          />
        </Field>
        <Field label="Crianças">
          <input
            type="number"
            min={0}
            className="input"
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Data de entrada">
          <input
            type="date"
            className="input"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </Field>
        <Field label="Data de saída">
          <input
            type="date"
            className="input"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Horário check-in">
          <input
            type="time"
            className="input"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
          />
        </Field>
        <Field label="Horário checkout">
          <input
            type="time"
            className="input"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Observações">
        <textarea
          className="input min-h-[70px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      {dateError && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-alert-600">
          <AlertTriangle size={15} /> {dateError}
        </p>
      )}
      {conflictError && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-alert-600">
          <AlertTriangle size={15} /> {conflictError}
        </p>
      )}

      <div className="mt-1 flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={!!dateError || !!conflictError}>
          {submitLabel}
        </Button>
      </div>
    </form>
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
