"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { clearSession, setSession } from "@/lib/store";

interface HeaderProps {
  role: Role;
  clientId?: number;
}

export default function Header({ role, clientId }: HeaderProps) {
  const router = useRouter();

  function switchRole(next: Role) {
    if (next === role) return;
    if (next === "employee") {
      setSession({ role: "employee" });
      router.push("/employee");
    } else {
      setSession({ role: "client", clientId: clientId ?? 1 });
      router.push("/client");
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-8">
      <div className="text-2xl font-bold text-blue-600 tracking-tight">
        Rialu ImmiTrack
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <span className="px-2 text-xs text-slate-500">View as</span>
          <button
            onClick={() => switchRole("employee")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              role === "employee"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => switchRole("client")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              role === "client"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Client
          </button>
        </div>
        <button
          onClick={() => {
            clearSession();
            router.push("/");
          }}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Exit demo
        </button>
      </div>
    </header>
  );
}
