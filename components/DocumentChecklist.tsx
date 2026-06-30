"use client";

import { useState } from "react";
import type { AppData, Document, Role } from "@/lib/types";
import {
  addDocument,
  caseDocuments,
  removeDocument,
  updateDocument,
} from "@/lib/store";

interface Props {
  data: AppData;
  applicantId: number;
  role: Role;
  onUpdate: (data: AppData) => void;
}

const DOC_STATUSES: Document["status"][] = ["missing", "valid", "expiring", "expired"];

const selectClass = "rounded-lg border px-2 py-1 text-xs font-medium";
const selectStyle = { borderColor: "var(--border)", background: "var(--surface)" };
const inputClass = "rounded-lg border px-2 py-1 text-sm flex-1 min-w-0";
const inputStyle = { borderColor: "var(--border)" };

export default function DocumentChecklist({ data, applicantId, role, onUpdate }: Props) {
  const docs = caseDocuments(data, applicantId);
  const [newType, setNewType] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditName(doc.documentType);
  };

  const saveEdit = (docId: number) => {
    if (!editName.trim()) return;
    onUpdate(updateDocument(data, docId, { documentType: editName.trim() }, role));
    setEditingId(null);
    setEditName("");
  };

  const addItem = () => {
    if (!newType.trim()) return;
    onUpdate(
      addDocument(
        data,
        {
          applicantId,
          documentType: newType.trim(),
          issueDate: "",
          expiryDate: "",
          status: "missing",
          required: true,
        },
        role
      )
    );
    setNewType("");
  };

  return (
    <div className="card">
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="font-semibold">Document checklist</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Editable · changes saved automatically
        </span>
      </div>

      {docs.length === 0 ? (
        <p className="px-5 py-6 text-sm" style={{ color: "var(--text-muted)" }}>
          No documents on the checklist yet. Add items below.
        </p>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--border-light)" }}>
          {docs.map((d) => (
            <li key={d.id} className="px-5 py-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {editingId === d.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="btn btn-primary text-xs"
                      onClick={() => saveEdit(d.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost text-xs"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-medium flex-1 min-w-[8rem]">{d.documentType}</span>
                    <button
                      type="button"
                      className="text-xs hover:underline"
                      style={{ color: "var(--navy)" }}
                      onClick={() => startEdit(d)}
                    >
                      Rename
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={d.status}
                  onChange={(e) =>
                    onUpdate(
                      updateDocument(
                        data,
                        d.id,
                        { status: e.target.value as Document["status"] },
                        role
                      )
                    )
                  }
                  className={selectClass}
                  style={selectStyle}
                >
                  {DOC_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {role === "employee" && (
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <input
                      type="checkbox"
                      checked={d.required ?? false}
                      onChange={(e) =>
                        onUpdate(
                          updateDocument(data, d.id, { required: e.target.checked }, role)
                        )
                      }
                    />
                    Required
                  </label>
                )}

                {d.required && role === "client" && (
                  <span className="text-[0.65rem] uppercase font-semibold" style={{ color: "var(--gold)" }}>
                    Required
                  </span>
                )}

                <button
                  type="button"
                  className="text-xs ml-auto hover:underline"
                  style={{ color: "var(--danger)" }}
                  onClick={() => onUpdate(removeDocument(data, d.id, role))}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        className="px-5 py-4 border-t flex flex-wrap gap-2"
        style={{ borderColor: "var(--border-light)" }}
      >
        <input
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="Add document type…"
          className={inputClass}
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
        />
        <button
          type="button"
          className="btn btn-secondary text-xs"
          disabled={!newType.trim()}
          onClick={addItem}
        >
          Add document
        </button>
      </div>
    </div>
  );
}
