"use client";

import { useState } from "react";
import type { Applicant, AppData, CaseStatus, Role } from "@/lib/types";
import {
  addNote,
  caseDocuments,
  caseNotes,
  caseTimeline,
  clientName,
  updateCaseStatus,
} from "@/lib/store";
import { generateCaseBrief } from "@/lib/ai";
import { PriorityBadge, StatusBadge } from "./StatusBadge";
import StatusSelect from "./StatusSelect";
import StatusChangeConfirm from "./StatusChangeConfirm";

interface Props {
  data: AppData;
  applicant: Applicant;
  role: Role;
  onUpdate: (data: AppData) => void;
}

export default function CaseDetailView({ data, applicant, role, onUpdate }: Props) {
  const [note, setNote] = useState("");
  const [clientVisible, setClientVisible] = useState(true);
  const [pendingStatus, setPendingStatus] = useState<CaseStatus | null>(null);
  const docs = caseDocuments(data, applicant.id);
  const timeline = caseTimeline(data, applicant.id, role);
  const notes = caseNotes(data, applicant.id, role);
  const brief = generateCaseBrief(applicant, data);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl mb-1">
                {applicant.firstName} {applicant.lastName}
              </h2>
              <p style={{ color: "var(--text-muted)" }}>{applicant.visaType}</p>
              {role === "employee" && (
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {clientName(data, applicant.clientId)} · {applicant.assignedTo}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={applicant.status} />
              <PriorityBadge priority={applicant.priority} />
              <StatusSelect
                value={applicant.status}
                role={role}
                onChange={(s) => {
                  if (s !== applicant.status) setPendingStatus(s);
                }}
              />
            </div>
          </div>
          {applicant.nextAction && (
            <div
              className="mt-4 rounded-lg px-4 py-3 text-sm"
              style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}
            >
              <span className="font-semibold" style={{ color: "var(--navy)" }}>Next action: </span>
              {applicant.nextAction}
            </div>
          )}
        </div>

        <div className="card">
          <div className="px-5 py-4 border-b font-semibold" style={{ borderColor: "var(--border)" }}>
            Document checklist
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border-light)" }}>
            {docs.map((d) => (
              <li key={d.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <span className="font-medium">{d.documentType}</span>
                  {d.required && (
                    <span className="ml-2 text-[0.65rem] uppercase font-semibold" style={{ color: "var(--gold)" }}>Required</span>
                  )}
                </div>
                <span
                  className="text-xs font-semibold uppercase"
                  style={{
                    color:
                      d.status === "valid" ? "var(--success)" :
                      d.status === "missing" ? "var(--danger)" : "var(--warning)",
                  }}
                >
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="px-5 py-4 border-b font-semibold" style={{ borderColor: "var(--border)" }}>
            Activity timeline
          </div>
          <ul className="p-5 space-y-4">
            {timeline.map((t) => (
              <li key={t.id} className="flex gap-3">
                <div
                  className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                  style={{
                    background:
                      t.actor === "ai" ? "var(--gold)" :
                      t.actor === "client" ? "var(--navy-light)" : "var(--navy)",
                  }}
                />
                <div>
                  <p className="text-sm">{t.message}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {new Date(t.createdAt).toLocaleString()} · {t.actor}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="font-semibold mb-3">Add note</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={role === "client" ? "Message your immigration team…" : "Internal or client-visible note…"}
            className="w-full rounded-lg border px-3 py-2 text-sm resize-none"
            style={{ borderColor: "var(--border)" }}
          />
          {role === "employee" && (
            <label className="flex items-center gap-2 mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              <input
                type="checkbox"
                checked={clientVisible}
                onChange={(e) => setClientVisible(e.target.checked)}
              />
              Visible to client
            </label>
          )}
          <button
            className="btn btn-primary mt-3"
            disabled={!note.trim()}
            onClick={() => {
              onUpdate(
                addNote(data, {
                  applicantId: applicant.id,
                  body: note.trim(),
                  author: role,
                  clientVisible: role === "client" ? true : clientVisible,
                })
              );
              setNote("");
            }}
          >
            Post note
          </button>

          {notes.length > 0 && (
            <ul className="mt-6 space-y-3 border-t pt-4" style={{ borderColor: "var(--border-light)" }}>
              {notes.map((n) => (
                <li key={n.id} className="text-sm">
                  <p>{n.body}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {n.author} · {new Date(n.createdAt).toLocaleString()}
                    {role === "employee" && !n.clientVisible && " · internal"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="ai-panel card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: "var(--gold)" }}>✦</span>
            <span className="font-semibold text-sm" style={{ color: "var(--navy)" }}>AI case brief</span>
          </div>
          <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {brief.replace(/\*\*/g, "")}
          </div>
          <p className="text-[0.65rem] mt-4 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Demo · rule-based summary · plug in LLM later
          </p>
        </div>

        <div className="card p-5 text-sm space-y-2">
          <div className="font-semibold mb-2">Case details</div>
          <div><span style={{ color: "var(--text-muted)" }}>Nationality</span><br />{applicant.nationality}</div>
          <div><span style={{ color: "var(--text-muted)" }}>DOB</span><br />{applicant.dateOfBirth}</div>
          <div><span style={{ color: "var(--text-muted)" }}>Phone</span><br />{applicant.phone}</div>
          <div><span style={{ color: "var(--text-muted)" }}>Permit expiry</span><br />{applicant.currentExpiry}</div>
        </div>
      </aside>

      <StatusChangeConfirm
        applicantName={`${applicant.firstName} ${applicant.lastName}`}
        fromStatus={applicant.status}
        toStatus={pendingStatus ?? applicant.status}
        open={pendingStatus !== null}
        onConfirm={() => {
          if (pendingStatus) {
            onUpdate(updateCaseStatus(data, applicant.id, pendingStatus, role));
          }
          setPendingStatus(null);
        }}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
}
