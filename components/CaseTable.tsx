"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Applicant, AppData, CaseStatus, Role } from "@/lib/types";
import { clientName } from "@/lib/store";
import { PriorityBadge, StatusBadge } from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import StatusChangeConfirm from "./StatusChangeConfirm";

interface Props {
  data: AppData;
  applicants: Applicant[];
  role: Role;
  basePath: string;
  showClient?: boolean;
  onStatusChange: (id: number, status: Applicant["status"]) => void;
}

type SortKey = "name" | "visaType" | "status" | "priority" | "client" | "expiry";
type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

interface PendingStatusChange {
  applicantId: number;
  applicantName: string;
  fromStatus: CaseStatus;
  toStatus: CaseStatus;
}

const PRIORITY_ORDER: Record<Applicant["priority"], number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const STATUS_ORDER: Record<CaseStatus, number> = {
  intake: 0,
  documents: 1,
  submitted: 2,
  processing: 3,
  additional_info: 4,
  approved: 5,
  refused: 6,
  on_hold: 7,
};

function compareValues(a: string | number, b: string | number, direction: SortDirection) {
  const result = a < b ? -1 : a > b ? 1 : 0;
  return direction === "asc" ? result : -result;
}

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
  className = "px-4 py-3",
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState | null;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort?.key === sortKey;

  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 font-semibold text-xs uppercase tracking-wide transition hover:opacity-80"
        style={{ color: active ? "var(--navy)" : "var(--text-muted)" }}
        aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
      >
        {label}
        <span className="text-[0.65rem] opacity-70" aria-hidden>
          {active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

export default function CaseTable({
  data,
  applicants,
  role,
  basePath,
  showClient,
  onStatusChange,
}: Props) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [pendingStatus, setPendingStatus] = useState<PendingStatusChange | null>(null);

  const handleSort = (key: SortKey) => {
    setSort((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedApplicants = useMemo(() => {
    if (!sort) return applicants;

    const list = [...applicants];
    list.sort((a, b) => {
      switch (sort.key) {
        case "name":
          return compareValues(
            `${a.lastName} ${a.firstName}`.toLowerCase(),
            `${b.lastName} ${b.firstName}`.toLowerCase(),
            sort.direction
          );
        case "visaType":
          return compareValues(a.visaType.toLowerCase(), b.visaType.toLowerCase(), sort.direction);
        case "status":
          return compareValues(STATUS_ORDER[a.status], STATUS_ORDER[b.status], sort.direction);
        case "priority":
          return compareValues(PRIORITY_ORDER[a.priority], PRIORITY_ORDER[b.priority], sort.direction);
        case "client":
          return compareValues(
            clientName(data, a.clientId).toLowerCase(),
            clientName(data, b.clientId).toLowerCase(),
            sort.direction
          );
        case "expiry":
          return compareValues(a.currentExpiry, b.currentExpiry, sort.direction);
        default:
          return 0;
      }
    });
    return list;
  }, [applicants, data, sort]);

  const requestStatusChange = (applicant: Applicant, toStatus: CaseStatus) => {
    if (toStatus === applicant.status) return;
    setPendingStatus({
      applicantId: applicant.id,
      applicantName: `${applicant.firstName} ${applicant.lastName}`,
      fromStatus: applicant.status,
      toStatus,
    });
  };

  const confirmStatusChange = () => {
    if (!pendingStatus) return;
    onStatusChange(pendingStatus.applicantId, pendingStatus.toStatus);
    setPendingStatus(null);
  };

  if (applicants.length === 0) {
    return (
      <div className="card p-12 text-center">
        <h3 className="font-serif text-xl mb-2">No cases found</h3>
        <p style={{ color: "var(--text-muted)" }}>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: "var(--border-light)", background: "var(--bg)" }}>
              <SortableHeader label="Case" sortKey="name" sort={sort} onSort={handleSort} />
              <SortableHeader label="Visa type" sortKey="visaType" sort={sort} onSort={handleSort} />
              <SortableHeader label="Status" sortKey="status" sort={sort} onSort={handleSort} />
              <SortableHeader label="Priority" sortKey="priority" sort={sort} onSort={handleSort} />
              {showClient && (
                <SortableHeader label="Client" sortKey="client" sort={sort} onSort={handleSort} />
              )}
              <SortableHeader label="Expiry" sortKey="expiry" sort={sort} onSort={handleSort} />
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sortedApplicants.map((a) => (
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
                      onChange={(s) => requestStatusChange(a, s)}
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

      <StatusChangeConfirm
        applicantName={pendingStatus?.applicantName ?? ""}
        fromStatus={pendingStatus?.fromStatus ?? "intake"}
        toStatus={pendingStatus?.toStatus ?? "intake"}
        open={pendingStatus !== null}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatus(null)}
      />
    </>
  );
}
