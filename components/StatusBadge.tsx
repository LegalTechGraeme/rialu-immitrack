import type { CaseStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const STATUS_STYLES: Record<CaseStatus, { bg: string; color: string; dot: string }> = {
  intake: { bg: "#F0EEE8", color: "#78716C", dot: "#78716C" },
  documents: { bg: "#FDF4E3", color: "#8B6914", dot: "#B45309" },
  submitted: { bg: "#EEF2F7", color: "#1E3A5F", dot: "#1E3A5F" },
  processing: { bg: "#FDF4E3", color: "#B45309", dot: "#B45309" },
  additional_info: { bg: "#FEF3C7", color: "#92400E", dot: "#B45309" },
  approved: { bg: "#ECFDF5", color: "#1A5C3A", dot: "#2D6A4F" },
  refused: { bg: "#FEF2F2", color: "#B91C1C", dot: "#B91C1C" },
  on_hold: { bg: "#F0EBF8", color: "#4A3B6B", dot: "#78716C" },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color }}
    >
      <span className="status-dot" style={{ background: s.dot }} />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: "#78716C",
    medium: "#1E3A5F",
    high: "#B45309",
    urgent: "#B91C1C",
  };
  return (
    <span
      className="text-[0.7rem] font-semibold uppercase tracking-wide"
      style={{ color: colors[priority] ?? colors.medium }}
    >
      {priority}
    </span>
  );
}
