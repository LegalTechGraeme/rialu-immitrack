"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import type { Applicant, Client } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "navy" | "gold" | "danger" | "success" | "warning";
  applicants: Applicant[];
  clients: Client[];
  caseLinkPrefix?: string;
  emptyMessage?: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function StatCardDetail({
  label,
  value,
  hint,
  accent,
  applicants,
  clients,
  caseLinkPrefix = "/employee",
  emptyMessage = "No cases in this category.",
  open,
  onOpen,
  onClose,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const clientName = (clientId: number) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="card p-5 text-left w-full transition-all hover:shadow-md hover:border-[var(--navy)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)]/30"
        style={{ cursor: "pointer" }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
      >
        <StatCard nested label={label} value={value} hint={hint} accent={accent} />
        <span
          className="block text-[0.7rem] mt-3 font-medium"
          style={{ color: "var(--navy)" }}
        >
          Click to view details →
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={onClose}
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
            aria-hidden
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="card relative w-full max-w-md max-h-[min(70vh,32rem)] flex flex-col shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-start justify-between gap-4 px-5 py-4 border-b shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h2 id={titleId} className="font-serif text-xl">
                  {label}
                </h2>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {applicants.length} case{applicants.length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost text-xs shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <ul className="overflow-y-auto flex-1">
              {applicants.length === 0 ? (
                <li className="px-5 py-8 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  {emptyMessage}
                </li>
              ) : (
                applicants.map((a) => (
                  <li
                    key={a.id}
                    className="px-5 py-3 border-b hover:bg-[var(--bg-muted)] transition"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`${caseLinkPrefix}/cases/${a.id}`}
                          className="font-medium hover:underline"
                          style={{ color: "var(--navy)" }}
                          onClick={onClose}
                        >
                          {a.firstName} {a.lastName}
                        </Link>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                          {clientName(a.clientId)} · {a.visaType}
                        </p>
                        {a.nextAction && (
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                            {a.nextAction}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
