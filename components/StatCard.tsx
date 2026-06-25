interface Props {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "navy" | "gold" | "danger" | "success" | "warning";
}

const accents = {
  navy: "var(--navy)",
  gold: "var(--gold)",
  danger: "var(--danger)",
  success: "var(--success)",
  warning: "var(--warning)",
};

export default function StatCard({ label, value, hint, accent = "navy" }: Props) {
  return (
    <div className="card p-5">
      <div
        className="text-[0.75rem] font-semibold uppercase tracking-wide mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="font-serif text-[2rem] leading-none"
        style={{ color: accents[accent] }}
      >
        {value}
      </div>
      {hint && (
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}
