"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useSession } from "@/lib/hooks/useSession";

export function LoginForm() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const signInError = await signIn(email, password);
    setSubmitting(false);
    if (signInError) setError("E-mail ou senha incorretos.");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-forest-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Logo size={40} />
          <h1 className="text-lg font-semibold text-sea-950">Tamikuã Mar</h1>
          <p className="text-sm text-foreground/50">Painel de Operação</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground/60">E-mail</span>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-foreground/60">Senha</span>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-alert-600">
              <AlertTriangle size={15} /> {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
