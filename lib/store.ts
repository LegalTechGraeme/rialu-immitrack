"use client";

import { SEED_DATA } from "./seed";
import type {
  Applicant,
  AppData,
  CaseNote,
  CaseStatus,
  DemoSession,
  Notification,
  Role,
  TimelineEvent,
} from "./types";
import { STATUS_LABELS } from "./types";

const DATA_KEY = "rialu-immitrack-data";
const SESSION_KEY = "rialu-immitrack-session";

function migrate(data: AppData): AppData {
  if (!data.timeline) data.timeline = [];
  if (!data.notes) data.notes = [];
  return data;
}

function loadData(): AppData {
  if (typeof window === "undefined") return structuredClone(SEED_DATA);
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return structuredClone(SEED_DATA);
    return migrate(JSON.parse(raw) as AppData);
  } catch {
    return structuredClone(SEED_DATA);
  }
}

function saveData(data: AppData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

function nextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((i) => i.id)) + 1;
}

export function getData(): AppData {
  return loadData();
}

export function resetData(): AppData {
  const fresh = structuredClone(SEED_DATA);
  saveData(fresh);
  return fresh;
}

export function getSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
}

export function setSession(session: DemoSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function addTimeline(
  data: AppData,
  event: Omit<TimelineEvent, "id">
): TimelineEvent[] {
  const entry: TimelineEvent = { ...event, id: nextId(data.timeline) };
  return [entry, ...data.timeline];
}

function addNotification(
  data: AppData,
  n: Omit<Notification, "id">
): Notification[] {
  return [{ ...n, id: nextId(data.notifications) }, ...data.notifications];
}

export function updateCaseStatus(
  data: AppData,
  applicantId: number,
  status: CaseStatus,
  actor: Role
): AppData {
  const applicant = data.applicants.find((a) => a.id === applicantId);
  if (!applicant || applicant.status === status) return data;

  const applicants = data.applicants.map((a) =>
    a.id === applicantId ? { ...a, status } : a
  );
  const timeline = addTimeline(data, {
    applicantId,
    type: "status_change",
    message: `Status changed to ${STATUS_LABELS[status]} (${actor === "employee" ? "solicitor team" : "client"})`,
    createdAt: new Date().toISOString(),
    actor,
    clientVisible: true,
  });
  const notifications = addNotification(data, {
    message: `Case status → ${STATUS_LABELS[status]}: ${applicant.firstName} ${applicant.lastName}`,
    actionType: "STATUS",
    applicantId,
    clientId: applicant.clientId,
    createdAt: new Date().toISOString(),
    read: false,
  });

  const next = { ...data, applicants, timeline, notifications };
  saveData(next);
  return next;
}

export function addApplicant(
  data: AppData,
  applicant: Omit<Applicant, "id">
): AppData {
  const created: Applicant = { ...applicant, id: nextId(data.applicants) };
  const timeline = addTimeline(data, {
    applicantId: created.id,
    type: "system",
    message: "Case opened",
    createdAt: new Date().toISOString(),
    actor: "system",
    clientVisible: true,
  });
  const notifications = addNotification(data, {
    message: `New case opened: ${created.firstName} ${created.lastName}`,
    actionType: "CREATE",
    applicantId: created.id,
    clientId: created.clientId,
    createdAt: new Date().toISOString(),
    read: false,
  });
  const next = {
    ...data,
    applicants: [...data.applicants, created],
    timeline,
    notifications,
  };
  saveData(next);
  return next;
}

export function updateApplicant(
  data: AppData,
  id: number,
  patch: Partial<Applicant>
): AppData {
  const applicants = data.applicants.map((a) =>
    a.id === id ? { ...a, ...patch } : a
  );
  const updated = applicants.find((a) => a.id === id)!;
  const notifications = addNotification(data, {
    message: `Case updated: ${updated.firstName} ${updated.lastName}`,
    actionType: "UPDATE",
    applicantId: id,
    clientId: updated.clientId,
    createdAt: new Date().toISOString(),
    read: false,
  });
  const next = { ...data, applicants, notifications };
  saveData(next);
  return next;
}

export function addNote(
  data: AppData,
  note: Omit<CaseNote, "id" | "createdAt">
): AppData {
  const entry: CaseNote = {
    ...note,
    id: nextId(data.notes),
    createdAt: new Date().toISOString(),
  };
  const timeline = addTimeline(data, {
    applicantId: note.applicantId,
    type: "note",
    message: note.body,
    createdAt: entry.createdAt,
    actor: note.author,
    clientVisible: note.clientVisible,
  });
  const next = {
    ...data,
    notes: [...data.notes, entry],
    timeline,
  };
  saveData(next);
  return next;
}

export function markNotificationRead(data: AppData, id: number): AppData {
  const next = {
    ...data,
    notifications: data.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  };
  saveData(next);
  return next;
}

export function markAllNotificationsRead(data: AppData): AppData {
  const next = {
    ...data,
    notifications: data.notifications.map((n) => ({ ...n, read: true })),
  };
  saveData(next);
  return next;
}

export function clientName(data: AppData, clientId: number): string {
  return data.clients.find((c) => c.id === clientId)?.name ?? "Unknown";
}

export function monthsUntil(dateStr: string): number {
  const today = new Date();
  const expiry = new Date(dateStr);
  return (
    (expiry.getFullYear() - today.getFullYear()) * 12 +
    (expiry.getMonth() - today.getMonth())
  );
}

export function caseDocuments(data: AppData, applicantId: number) {
  return data.documents.filter((d) => d.applicantId === applicantId);
}

export function caseTimeline(data: AppData, applicantId: number, role: Role) {
  return data.timeline
    .filter(
      (t) =>
        t.applicantId === applicantId &&
        (role === "employee" || t.clientVisible)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function caseNotes(data: AppData, applicantId: number, role: Role) {
  return data.notes
    .filter(
      (n) =>
        n.applicantId === applicantId &&
        (role === "employee" || n.clientVisible)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
