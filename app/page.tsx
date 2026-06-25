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
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Rialu ImmiTrack</h1>
          <p className="mt-2 text-slate-500">Immigration case tracking demo</p>
          <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Demo mode — no login required
          </span>
        </div>

        <h2 className="mt-8 text-center text-lg font-semibold">Choose your view</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole("employee")}
            className={`rounded-xl border-2 p-4 text-left transition ${
              role === "employee"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold">Employee</div>
            <div className="mt-1 text-xs text-slate-500">Full admin access</div>
          </button>
          <button
            onClick={() => setRole("client")}
            className={`rounded-xl border-2 p-4 text-left transition ${
              role === "client"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold">Client</div>
            <div className="mt-1 text-xs text-slate-500">Your applications only</div>
          </button>
        </div>

        {role === "client" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Demo client account
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {SEED_DATA.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={enter}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition"
        >
          Enter demo
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo data stored in your browser · resets with &quot;Reset demo data&quot;
        </p>
      </div>
    </main>
  );
}
