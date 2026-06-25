"use client";

import type { AppData } from "@/lib/types";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/store";

interface Props {
  data: AppData;
  onUpdate: (data: AppData) => void;
}

export default function Notifications({ data, onUpdate }: Props) {
  const unread = data.notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <details className="group">
        <summary className="cursor-pointer list-none flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
          <span>🔔</span>
          <span>Notifications</span>
          {unread > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {unread}
            </span>
          )}
        </summary>
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="font-semibold text-sm">Recent activity</span>
            {unread > 0 && (
              <button
                onClick={() => onUpdate(markAllNotificationsRead(data))}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {data.notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 text-sm ${n.read ? "text-slate-400" : "text-slate-700"}`}
              >
                <p>{n.message}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                  {!n.read && (
                    <button
                      onClick={() => onUpdate(markNotificationRead(data, n.id))}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}
