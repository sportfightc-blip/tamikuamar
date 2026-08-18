"use client";

import { useState } from "react";
import { LogIn, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CardTitle } from "@/components/ui/CardTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StayEditDrawer } from "@/components/rooms/StayEditDrawer";
import { useStays } from "@/lib/hooks/useStays";
import { getCheckins, stayPeopleCount } from "@/lib/operations";
import { getRoomName } from "@/lib/rooms";
import { formatPeopleCount } from "@/lib/format";
import { addDaysISO, formatFullDatePt, todayISO } from "@/lib/dates";
import { Stay } from "@/lib/types";

function CheckinList({
  title,
  date,
  stays,
  onSelect,
}: {
  title: string;
  date: string;
  stays: Stay[];
  onSelect: (stay: Stay) => void;
}) {
  const checkins = getCheckins(date, stays).sort((a, b) =>
    getRoomName(a.roomId).localeCompare(getRoomName(b.roomId), "pt-BR"),
  );

  return (
    <Card className="mb-4">
      <CardTitle icon={LogIn}>{title}</CardTitle>
      <p className="mb-3 -mt-2 text-xs text-foreground/45">{formatFullDatePt(date)}</p>
      {checkins.length === 0 ? (
        <EmptyState message="Nenhum check-in programado." />
      ) : (
        <ul className="flex flex-col gap-2">
          {checkins.map((stay) => (
            <li key={stay.id}>
              <button
                onClick={() => onSelect(stay)}
                className="flex w-full items-center justify-between rounded-xl border border-sand-200 px-3 py-2.5 text-left hover:bg-sand-50"
              >
                <div>
                  <p className="text-sm font-medium text-foreground/85">
                    {getRoomName(stay.roomId)} — {stay.guestName}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/55">
                    <Users size={12} /> {formatPeopleCount(stayPeopleCount(stay))}
                  </p>
                </div>
                <span className="text-sm font-medium text-sea-700">{stay.checkInTime}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function CheckinsPage() {
  const { stays } = useStays();
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const [editingStay, setEditingStay] = useState<Stay | null>(null);

  return (
    <div>
      <PageHeader title="Check-ins" subtitle="Entradas de hoje e de amanhã" />

      <CheckinList title="Hoje" date={today} stays={stays} onSelect={setEditingStay} />
      <CheckinList title="Amanhã" date={tomorrow} stays={stays} onSelect={setEditingStay} />

      <StayEditDrawer
        stay={editingStay}
        open={!!editingStay}
        onClose={() => setEditingStay(null)}
      />
    </div>
  );
}
