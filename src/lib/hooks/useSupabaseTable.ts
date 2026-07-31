"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

/**
 * Mantém uma tabela do Supabase em memória, sincronizada em tempo real:
 * carrega o estado inicial e escuta inserts/updates/deletes via Realtime,
 * refletindo automaticamente qualquer alteração feita em outro aparelho.
 */
export function useSupabaseTable<Row extends { id: string | number }>(
  table: string,
  orderBy?: { column: string; ascending?: boolean },
) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      let query = supabase.from(table).select("*");
      if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await query;
      if (!cancelled) {
        if (!error && data) setRows(data as Row[]);
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          setRows((current) => {
            if (payload.eventType === "DELETE") {
              const oldRow = payload.old as Row;
              return current.filter((r) => r.id !== oldRow.id);
            }
            const newRow = payload.new as Row;
            const exists = current.some((r) => r.id === newRow.id);
            if (exists) {
              return current.map((r) => (r.id === newRow.id ? newRow : r));
            }
            return [...current, newRow];
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [table, orderBy?.column, orderBy?.ascending]);

  return { rows, loading };
}
