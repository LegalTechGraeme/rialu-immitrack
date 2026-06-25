"use client";

import type { CaseStatus, Role } from "@/lib/types";
import { CLIENT_STATUSES, EMPLOYEE_STATUSES, STATUS_LABELS } from "@/lib/types";

interface Props {
  value: CaseStatus;
  role: Role;
  onChange: (status: CaseStatus) => void;
  compact?: boolean;
}

export default function StatusSelect({ value, role, onChange, compact }: Props) {
  const options = role === "employee" ? EMPLOYEE_STATUSES : CLIENT_STATUSES;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CaseStatus)}
      onClick={(e) => e.stopPropagation()}
      className={`rounded-lg border text-sm font-medium transition ${compact ? "py-1 px-2 text-xs" : "py-1.5 px-2.5"}`}
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--navy)",
      }}
      title="Update case status"
    >
      {options.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
