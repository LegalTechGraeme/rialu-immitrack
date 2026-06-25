"use client";

import { SEED_DATA } from "./seed";
import type { Applicant, AppData, DemoSession, Notification } from "./types";

const DATA_KEY = "rialu-immitrack-data";
const SESSION_KEY = "rialu-immitrack-session";

function loadData(): AppData {
  if (typeof window === "undefined") return structuredClone(SEED_DATA);
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return structuredClone(SEED_DATA);
    return JSON.parse(raw) as AppData;
  } catch {
    return structuredClone(SEED_DATA);
  }
}

function saveData(data: AppData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
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

export function addApplicant(
  data: AppData,
  applicant: Omit<Applicant, "id">
): AppData {
  const nextId = Math.max(0, ...data.applicants.map((a) => a.id)) + 1;
  const created: Applicant = { ...applicant, id: nextId };
  const notification: Notification = {
    id: Math.max(0, ...data.notifications.map((n) => n.id)) + 1,
    message: `New applicant created: ${created.firstName} ${created.lastName}`,
    actionType: "CREATE",
    applicantId: created.id,
    clientId: created.clientId,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const next = {
    ...data,
    applicants: [...data.applicants, created],
    notifications: [notification, ...data.notifications],
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
  const notification: Notification = {
    id: Math.max(0, ...data.notifications.map((n) => n.id)) + 1,
    message: `Applicant updated: ${updated.firstName} ${updated.lastName}`,
    actionType: "UPDATE",
    applicantId: id,
    clientId: updated.clientId,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const next = {
    ...data,
    applicants,
    notifications: [notification, ...data.notifications],
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
