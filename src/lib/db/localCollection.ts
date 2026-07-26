"use client";

// Camada de persistência simples baseada em localStorage.
// Estruturada como um pequeno "repositório" para facilitar migração futura para Supabase:
// basta substituir a implementação interna mantendo a mesma API pública (get/set/subscribe).

type Listener = () => void;

export class LocalCollection<T> {
  private key: string;
  private listeners = new Set<Listener>();
  private cache: T | null = null;

  constructor(key: string, private fallback: T) {
    this.key = key;
  }

  private read(): T {
    if (typeof window === "undefined") return this.fallback;
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return this.fallback;
      return JSON.parse(raw) as T;
    } catch {
      return this.fallback;
    }
  }

  getSnapshot = (): T => {
    if (this.cache === null) {
      this.cache = this.read();
    }
    return this.cache;
  };

  set(value: T): void {
    this.cache = value;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    }
    this.listeners.forEach((l) => l());
  }

  update(updater: (current: T) => T): T {
    const next = updater(this.getSnapshot());
    this.set(next);
    return next;
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
}
