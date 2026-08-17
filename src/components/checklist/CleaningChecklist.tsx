import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TaskItem } from "./TaskItem";
import { CleaningItem, CleaningType, RoomId } from "@/lib/types";
import { useTaskCompletions } from "@/lib/hooks/useTaskCompletions";
import { useToast } from "@/components/ui/toast";

export function CleaningChecklist({ date, cleaning }: { date: string; cleaning: CleaningItem[] }) {
  const { isCompleted, getCompletedAt, toggleTask } = useTaskCompletions();
  const { show } = useToast();

  async function handleToggle(roomId: RoomId, type: CleaningType) {
    try {
      await toggleTask(date, roomId, type);
    } catch {
      show("Não foi possível atualizar a tarefa", "error");
    }
  }

  const byRoom = new Map<string, { roomName: string; items: CleaningItem[] }>();
  for (const item of cleaning) {
    const entry = byRoom.get(item.roomId) ?? { roomName: item.roomName, items: [] };
    entry.items.push(item);
    byRoom.set(item.roomId, entry);
  }

  return (
    <div className="flex flex-col gap-3">
      {[...byRoom.entries()].map(([roomId, { roomName, items }]) => {
        const allDone = items.every((i) => isCompleted(date, i.roomId, i.type));
        return (
          <Card key={roomId}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-sea-950">{roomName}</h3>
              {allDone && (
                <Badge tone="ok">
                  <CheckCircle2 size={13} /> Quarto pronto
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <TaskItem
                  key={`${item.roomId}-${item.type}`}
                  item={item}
                  completed={isCompleted(date, item.roomId, item.type)}
                  completedAt={getCompletedAt(date, item.roomId, item.type)}
                  onToggle={() => handleToggle(item.roomId, item.type)}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
