"use client";

import { useState } from "react";
import { Copy, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast";

export function WhatsAppMessagePreview({
  initialMessage,
  onSave,
}: {
  initialMessage: string;
  onSave: (finalMessage: string) => void;
}) {
  const [message, setMessage] = useState(initialMessage);
  const { show } = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      show("Mensagem copiada");
    } catch {
      show("Não foi possível copiar", "error");
    }
  }

  function openWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="input min-h-[280px] resize-y font-mono text-[13px] leading-relaxed"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button variant="secondary" onClick={copy}>
          <Copy size={16} /> Copiar mensagem
        </Button>
        <Button variant="secondary" onClick={openWhatsApp}>
          <Send size={16} /> Abrir WhatsApp
        </Button>
        <Button
          onClick={() => {
            onSave(message);
            show("Cronograma salvo");
          }}
        >
          <Save size={16} /> Salvar
        </Button>
      </div>
    </div>
  );
}
