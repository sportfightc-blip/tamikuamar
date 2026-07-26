import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TaskItem } from "./TaskItem";
import { CleaningItem } from "@/lib/types";
import { useTaskCompletions } from "@/lib/hooks/useTaskCompletions";

export function CleaningChecklist({ date, cleaning }: { date: string; cleaning: CleaningItem[] }) {
  const { isCompleted, getCompletedAt, toggleTask } = useTaskCompletions();

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
              {allDone && <Badge tone="ok">✅ Quarto pronto</Badge>}
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <TaskItem
                  key={`${item.roomId}-${item.type}`}
                  item={item}
                  completed={isCompleted(date, item.roomId, item.type)}
                  completedAt={getCompletedAt(date, item.roomId, item.type)}
                  onToggle={() => toggleTask(date, item.roomId, item.type)}
                />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
