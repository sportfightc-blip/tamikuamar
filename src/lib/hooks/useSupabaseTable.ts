"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";

let channelCounter = 0;

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

    // Cada instância deste hook precisa de um canal próprio: se duas partes
    // da tela (ex: sidebar + cabeçalho) usarem a mesma tabela ao mesmo tempo,
    // reaproveitar o mesmo nome de canal faz o Supabase reutilizar o canal já
    // inscrito e o segundo `.on()` lança "cannot add callbacks after
    // subscribe()", derrubando a página inteira.
    const channelName = `public:${table}:${++channelCounter}`;
    const channel = supabase
      .channel(channelName)
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
