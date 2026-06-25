"use client";

import Link from "next/link";
import type { Applicant, AppData, Role } from "@/lib/types";
import { clientName } from "@/lib/store";
import { PriorityBadge, StatusBadge } from "./StatusBadge";
import StatusSelect from "./StatusSelect";

interface Props {
  data: AppData;
  applicants: Applicant[];
  role: Role;
  basePath: string;
  showClient?: boolean;
  onStatusChange: (id: number, status: Applicant["status"]) => void;
}

export default function CaseTable({
  data,
  applicants,
  role,
  basePath,
  showClient,
  onStatusChange,
}: Props) {
  if (applicants.length === 0) {
    return (
      <div className="card p-12 text-center">
        <h3 className="font-serif text-xl mb-2">No cases found</h3>
        <p style={{ color: "var(--text-muted)" }}>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border-light)", background: "var(--bg)" }}>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Case</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Visa type</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Priority</th>
            {showClient && (
              <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Client</th>
            )}
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Expiry</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {applicants.map((a) => (
            <tr
              key={a.id}
              className="border-b transition hover:bg-[var(--bg-muted)]"
              style={{ borderColor: "var(--border-light)" }}
            >
              <td className="px-4 py-3">
                <div className="font-medium">{a.firstName} {a.lastName}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{a.email}</div>
              </td>
              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{a.visaType}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1.5 items-start">
                  <StatusBadge status={a.status} />
                  <StatusSelect
                    value={a.status}
                    role={role}
                    onChange={(s) => onStatusChange(a.id, s)}
                    compact
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <PriorityBadge priority={a.priority} />
              </td>
              {showClient && (
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                  {clientName(data, a.clientId)}
                </td>
              )}
              <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{a.currentExpiry}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`${basePath}/cases/${a.id}`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "var(--navy)" }}
                >
                  Open →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
