"use client";

import { taskCompletionsCollection } from "../db/collections";
import { useCollection } from "./useCollection";
import { CleaningType, RoomId, TaskCompletion } from "../types";

function taskKey(date: string, roomId: RoomId, type: CleaningType): string {
  return `${date}:${roomId}:${type}`;
}

export function useTaskCompletions() {
  const completions = useCollection(taskCompletionsCollection);

  function isCompleted(date: string, roomId: RoomId, type: CleaningType): boolean {
    return completions.some(
      (c) => c.id === taskKey(date, roomId, type) && c.completed,
    );
  }

  function getCompletedAt(date: string, roomId: RoomId, type: CleaningType): string | null {
    return (
      completions.find((c) => c.id === taskKey(date, roomId, type))?.completedAt ?? null
    );
  }

  function toggleTask(date: string, roomId: RoomId, type: CleaningType): void {
    const id = taskKey(date, roomId, type);
    taskCompletionsCollection.update((current) => {
      const existing = current.find((c) => c.id === id);
      const nextCompleted = !(existing?.completed ?? false);
      const entry: TaskCompletion = {
        id,
        date,
        roomId,
        type,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : null,
      };
      if (existing) {
        return current.map((c) => (c.id === id ? entry : c));
      }
      return [...current, entry];
    });
  }

  return { completions, isCompleted, getCompletedAt, toggleTask };
}
