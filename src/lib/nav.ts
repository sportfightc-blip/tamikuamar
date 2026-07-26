import { CalendarDays, CheckSquare, History, Home, Sunrise } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Hoje", icon: Sunrise },
  { href: "/quartos", label: "Quartos", icon: Home },
  { href: "/semana", label: "Semana", icon: CalendarDays },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/historico", label: "Histórico", icon: History },
] as const;
