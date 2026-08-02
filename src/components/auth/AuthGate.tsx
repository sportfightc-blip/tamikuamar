"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { LoginForm } from "./LoginForm";

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useSession();

  if (loading) {
    return <div className="min-h-dvh bg-forest-900" />;
  }

  if (!session) {
    return <LoginForm />;
  }

  return <>{children}</>;
}
