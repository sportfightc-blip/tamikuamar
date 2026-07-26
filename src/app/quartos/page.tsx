"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ROOMS } from "@/lib/rooms";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomDrawer } from "@/components/rooms/RoomDrawer";
import { NewStayDrawer } from "@/components/rooms/NewStayDrawer";
import { StayEditDrawer } from "@/components/rooms/StayEditDrawer";
import { RoomTimeline } from "@/components/rooms/RoomTimeline";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { useStays } from "@/lib/hooks/useStays";
import { getRoomStatusInfo } from "@/lib/operations";
import { todayISO } from "@/lib/dates";
import { Room, RoomId, Stay } from "@/lib/types";

export default function QuartosPage() {
  const { stays } = useStays();
  const today = todayISO();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newStayOpen, setNewStayOpen] = useState(false);
  const [newStayPrefill, setNewStayPrefill] = useState<{ roomId?: RoomId; date?: string }>({});
  const [editingStay, setEditingStay] = useState<Stay | null>(null);

  return (
    <div>
      <PageHeader
        title="Quartos"
        subtitle="Situação dos 6 quartos da pousada"
        action={
          <Button
            variant="secondary"
            onClick={() => {
              setNewStayPrefill({});
              setNewStayOpen(true);
            }}
          >
            <Plus size={16} /> Nova hospedagem
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            statusInfo={getRoomStatusInfo(room.id, stays, today)}
            onClick={() => setSelectedRoom(room)}
          />
        ))}
      </div>

      <RoomTimeline
        onBarClick={(stay) => setEditingStay(stay)}
        onCellClick={(roomId, date) => {
          setNewStayPrefill({ roomId, date });
          setNewStayOpen(true);
        }}
      />

      {selectedRoom && (
        <RoomDrawer
          room={selectedRoom}
          open={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      <NewStayDrawer
        open={newStayOpen}
        onClose={() => setNewStayOpen(false)}
        initialRoomId={newStayPrefill.roomId}
        initialCheckInDate={newStayPrefill.date}
      />

      <StayEditDrawer
        stay={editingStay}
        open={!!editingStay}
        onClose={() => setEditingStay(null)}
      />
    </div>
  );
}
