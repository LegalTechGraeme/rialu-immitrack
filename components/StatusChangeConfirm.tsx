"use client";

import { useEffect, useId, useRef } from "react";
import type { CaseStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  applicantName: string;
  fromStatus: CaseStatus;
  toStatus: CaseStatus;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StatusChangeConfirm({
  applicantName,
  fromStatus,
  toStatus,
  open,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="card relative w-full max-w-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 id={titleId} className="font-serif text-xl">
            Confirm status change
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {applicantName}
          </p>
        </div>

        <div className="px-5 py-5 space-y-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            You are about to update this case status. The change will be recorded in the
            activity timeline and the team will be notified.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={fromStatus} />
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <StatusBadge status={toStatus} />
          </div>

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {STATUS_LABELS[fromStatus]} → {STATUS_LABELS[toStatus]}
          </p>
        </div>

        <div
          className="flex justify-end gap-2 px-5 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            Confirm change
          </button>
        </div>
      </div>
    </div>
  );
}
