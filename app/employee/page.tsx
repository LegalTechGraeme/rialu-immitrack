"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ApplicantTable from "@/components/ApplicantTable";
import ApplicantForm from "@/components/ApplicantForm";
import Notifications from "@/components/Notifications";
import { useAppData } from "@/hooks/useAppData";
import {
  addApplicant,
  getSession,
  monthsUntil,
  resetData,
  updateApplicant,
} from "@/lib/store";
import type { Applicant } from "@/lib/types";

type View = "home" | "create" | "edit" | "expiry" | "wip";

export default function EmployeePage() {
  const router = useRouter();
  const { data, update, ready } = useAppData();
  const [view, setView] = useState<View>("home");
  const [clientFilter, setClientFilter] = useState<number | "">("");
  const [expiryMonths, setExpiryMonths] = useState(3);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "employee") router.replace("/");
  }, [router]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.applicants;
    if (clientFilter) list = list.filter((a) => a.clientId === clientFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.firstName.toLowerCase().includes(q) ||
          a.lastName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, clientFilter, search]);

  const expiryList = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter(
      (a) => monthsUntil(a.currentExpiry) >= 0 && monthsUntil(a.currentExpiry) <= expiryMonths
    );
  }, [data, expiryMonths]);

  const wipList = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter((a) =>
      ["pending", "processing"].includes(a.status)
    );
  }, [data]);

  if (!ready || !data) {
    return <div className="p-8 text-center text-slate-500">Loading…</div>;
  }

  const editing = editId ? data.applicants.find((a) => a.id === editId) : undefined;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <Header role="employee" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employee dashboard</h1>
          <p className="text-slate-500 text-sm">Manage all client immigration cases</p>
        </div>
        <div className="flex items-center gap-3">
          <Notifications data={data} onUpdate={update} />
          <button
            onClick={() => update(resetData())}
            className="text-xs text-slate-400 hover:text-slate-600 underline"
          >
            Reset demo data
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-2">
          {(
            [
              ["home", "All applicants"],
              ["expiry", "Expiry report"],
              ["wip", "Work in progress"],
              ["create", "Add applicant"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => {
                setView(v);
                setEditId(null);
              }}
              className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                view === v
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <label className="text-xs font-medium text-slate-500">Filter by client</label>
            <select
              value={clientFilter}
              onChange={(e) =>
                setClientFilter(e.target.value ? Number(e.target.value) : "")
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">All clients</option>
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section>
          {view === "home" && (
            <>
              <input
                type="search"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
              />
              <ApplicantTable
                data={data}
                applicants={filtered}
                showClient
                onSelect={(id) => {
                  setEditId(id);
                  setView("edit");
                }}
              />
            </>
          )}

          {view === "expiry" && (
            <>
              <div className="mb-4 flex items-center gap-3">
                <label className="text-sm text-slate-600">Expiring within</label>
                <select
                  value={expiryMonths}
                  onChange={(e) => setExpiryMonths(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                >
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={9}>9 months</option>
                </select>
              </div>
              <ApplicantTable data={data} applicants={expiryList} showClient />
            </>
          )}

          {view === "wip" && (
            <ApplicantTable data={data} applicants={wipList} showClient />
          )}

          {view === "create" && (
            <ApplicantForm
              data={data}
              onCancel={() => setView("home")}
              onSubmit={(values) => {
                update(addApplicant(data, values));
                setView("home");
              }}
            />
          )}

          {view === "edit" && editing && (
            <ApplicantForm
              data={data}
              initial={editing}
              onCancel={() => setView("home")}
              onSubmit={(values) => {
                update(updateApplicant(data, editing.id, values as Partial<Applicant>));
                setView("home");
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}
