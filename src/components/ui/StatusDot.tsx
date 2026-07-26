const DOT_COLORS = {
  ok: "#1f9d68",
  alert: "#d8483f",
  warn: "#d99a2b",
  sea: "#2170a8",
  neutral: "#c9c2b2",
} as const;

export function StatusDot({ tone }: { tone: keyof typeof DOT_COLORS }) {
  return (
    <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true" className="shrink-0">
      <circle cx={4} cy={4} r={4} fill={DOT_COLORS[tone]} />
    </svg>
  );
}
