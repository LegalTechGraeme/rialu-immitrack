"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SEED_DATA } from "@/lib/seed";
import { getSession, setSession } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState<"employee" | "client">("employee");
  const [clientId, setClientId] = useState(1);

  useEffect(() => {
    const session = getSession();
    if (session?.role === "employee") router.replace("/employee");
    else if (session?.role === "client") router.replace("/client");
  }, [router]);

  function enter() {
    if (role === "employee") {
      setSession({ role: "employee" });
      router.push("/employee");
    } else {
      setSession({ role: "client", clientId });
      router.push("/client");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md card p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl" style={{ color: "var(--navy)" }}>
            Rialu ImmiTrack
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Immigration case management for modern law firms
          </p>
          <span
            className="inline-block mt-4 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide"
            style={{ background: "#FDF4E3", color: "#8B6914" }}
          >
            Demo — no login required
          </span>
        </div>

        <p className="text-center text-sm font-medium mb-4">Select your portal</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setRole("employee")}
            className="rounded-xl border-2 p-4 text-left transition"
            style={{
              borderColor: role === "employee" ? "var(--navy)" : "var(--border)",
              background: role === "employee" ? "#EEF2F7" : "var(--surface)",
            }}
          >
            <div className="font-semibold text-sm">Immigration team</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Full caseload & AI tools
            </div>
          </button>
          <button
            onClick={() => setRole("client")}
            className="rounded-xl border-2 p-4 text-left transition"
            style={{
              borderColor: role === "client" ? "var(--navy)" : "var(--border)",
              background: role === "client" ? "#EEF2F7" : "var(--surface)",
            }}
          >
            <div className="font-semibold text-sm">Corporate client</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Your employees&apos; cases
            </div>
          </button>
        </div>

        {role === "client" && (
          <div className="mb-4">
            <label className="field-label">Demo organisation</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value))}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              {SEED_DATA.clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <button onClick={enter} className="btn btn-primary w-full">
          Enter portal
        </button>

        <p className="text-center text-[0.7rem] mt-6" style={{ color: "var(--text-muted)" }}>
          To switch portals, exit demo and return here
        </p>
      </div>
    </main>
  );
}
