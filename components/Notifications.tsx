"use client";

import type { AppData } from "@/lib/types";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/store";

interface Props {
  data: AppData;
  onUpdate: (data: AppData) => void;
  clientId?: number;
}

export default function Notifications({ data, onUpdate, clientId }: Props) {
  const notifications = clientId
    ? data.notifications.filter((n) => n.clientId === clientId)
    : data.notifications;
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <details className="relative">
      <summary className="btn btn-secondary cursor-pointer list-none">
        Alerts
        {unread > 0 && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold text-white"
            style={{ background: "var(--danger)" }}
          >
            {unread}
          </span>
        )}
      </summary>
      <div
        className="absolute right-0 z-30 mt-2 w-80 rounded-xl border shadow-lg"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
          <span className="font-semibold text-sm">Notifications</span>
          {unread > 0 && (
            <button
              onClick={() => onUpdate(markAllNotificationsRead(data))}
              className="text-xs hover:underline"
              style={{ color: "var(--navy)" }}
            >
              Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <li className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-muted)" }}>
              No notifications yet
            </li>
          ) : (
            notifications.map((n) => (
            <li
              key={n.id}
              className="border-b px-4 py-3 text-sm"
              style={{
                borderColor: "var(--border-light)",
                opacity: n.read ? 0.6 : 1,
              }}
            >
              <div className="flex items-start gap-2">
                {n.actionType === "AI" && (
                  <span style={{ color: "var(--gold)" }}>✦</span>
                )}
                <p>{n.message}</p>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
                {!n.read && (
                  <button
                    onClick={() => onUpdate(markNotificationRead(data, n.id))}
                    className="text-xs hover:underline"
                    style={{ color: "var(--navy)" }}
                  >
                    Read
                  </button>
                )}
              </div>
            </li>
            ))
          )}
        </ul>
      </div>
    </details>
  );
}
