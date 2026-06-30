"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppData, Role } from "@/lib/types";
import { addApplicant } from "@/lib/store";

interface Props {
  data: AppData;
  role: Role;
  clientId?: number;
  open: boolean;
  onClose: () => void;
  onCreated: (data: AppData) => void;
}

const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm";
const inputStyle = { borderColor: "var(--border)" };

const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1.5";
const labelStyle = { color: "var(--text-muted)" };

export default function NewCaseModal({
  data,
  role,
  clientId,
  open,
  onClose,
  onCreated,
}: Props) {
  const router = useRouter();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const [form, setForm] = useState({
    clientId: clientId ?? data.clients[0]?.id ?? 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    visaType: "",
    currentExpiry: oneYearFromNow.toISOString().slice(0, 10),
    priority: "medium" as const,
    assignedTo: "Sarah O'Connor",
    nextAction: role === "client" ? "Gather required documents" : "Schedule intake call",
  });

  useEffect(() => {
    if (!open) return;
    setForm((current) => ({
      ...current,
      clientId: clientId ?? current.clientId,
      nextAction: role === "client" ? "Gather required documents" : "Schedule intake call",
    }));
  }, [open, clientId, role]);

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

  const set = (field: keyof typeof form, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.visaType.trim() &&
    form.nationality.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const next = addApplicant(
      data,
      {
        clientId: role === "client" ? (clientId ?? form.clientId) : Number(form.clientId),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || "+353",
        dateOfBirth: form.dateOfBirth || "1990-01-01",
        nationality: form.nationality.trim(),
        status: "intake",
        visaType: form.visaType.trim(),
        currentExpiry: form.currentExpiry,
        priority: role === "employee" ? (form.priority as "low" | "medium" | "high" | "urgent") : "medium",
        assignedTo: role === "employee" ? form.assignedTo : undefined,
        nextAction: form.nextAction.trim() || undefined,
      },
      { openedBy: role }
    );

    const created = next.applicants[next.applicants.length - 1];

    onCreated(next);
    onClose();
    router.push(`/${role === "employee" ? "employee" : "client"}/cases/${created.id}`);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="card relative w-full max-w-2xl max-h-[min(90vh,40rem)] flex flex-col shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-4 px-5 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 id={titleId} className="font-serif text-xl">
              New case
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {role === "employee"
                ? "Open a new immigration case for a corporate client"
                : "Submit a new employee application to your immigration team"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost text-xs" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {role === "employee" && (
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>Client organisation</label>
                <select
                  value={form.clientId}
                  onChange={(e) => set("clientId", Number(e.target.value))}
                  className={inputClass}
                  style={inputStyle}
                  required
                >
                  {data.clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className={labelClass} style={labelStyle}>First name</label>
              <input
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Last name</label>
              <input
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="+353 87 000 0000"
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Nationality</label>
              <input
                value={form.nationality}
                onChange={(e) => set("nationality", e.target.value)}
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Date of birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} style={labelStyle}>Visa / permit type</label>
              <input
                value={form.visaType}
                onChange={(e) => set("visaType", e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. General Employment Permit"
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Permit expiry</label>
              <input
                type="date"
                value={form.currentExpiry}
                onChange={(e) => set("currentExpiry", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            {role === "employee" && (
              <>
                <div>
                  <label className={labelClass} style={labelStyle}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => set("priority", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} style={labelStyle}>Assigned to</label>
                  <input
                    value={form.assignedTo}
                    onChange={(e) => set("assignedTo", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label className={labelClass} style={labelStyle}>Next action</label>
              <input
                value={form.nextAction}
                onChange={(e) => set("nextAction", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            className="flex justify-end gap-2 mt-6 pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
              Create case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
