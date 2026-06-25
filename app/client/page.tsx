"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ApplicantTable from "@/components/ApplicantTable";
import ApplicantForm from "@/components/ApplicantForm";
import { useAppData } from "@/hooks/useAppData";
import { addApplicant, getSession, resetData, updateApplicant } from "@/lib/store";
import { SEED_DATA } from "@/lib/seed";
import type { Applicant } from "@/lib/types";

type View = "list" | "create" | "edit";

export default function ClientPage() {
  const router = useRouter();
  const { data, update, ready } = useAppData();
  const [view, setView] = useState<View>("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [clientId, setClientId] = useState(1);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "client") {
      router.replace("/");
      return;
    }
    setClientId(s.clientId ?? 1);
  }, [router]);

  const mine = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter((a) => a.clientId === clientId);
  }, [data, clientId]);

  const clientName =
    data?.clients.find((c) => c.id === clientId)?.name ??
    SEED_DATA.clients.find((c) => c.id === clientId)?.name ??
    "Client";

  if (!ready || !data) {
    return <div className="p-8 text-center text-slate-500">Loading…</div>;
  }

  const editing = editId ? mine.find((a) => a.id === editId) : undefined;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Header role="client" clientId={clientId} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Client portal</h1>
          <p className="text-slate-500 text-sm">Viewing as {clientName}</p>
        </div>
        <button
          onClick={() => update(resetData())}
          className="text-xs text-slate-400 hover:text-slate-600 underline"
        >
          Reset demo data
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={() => {
            setView("list");
            setEditId(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-700"
          }`}
        >
          My applications
        </button>
        <button
          onClick={() => setView("create")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            view === "create"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-700"
          }`}
        >
          Add application
        </button>
      </div>

      {view === "list" && (
        <ApplicantTable
          data={data}
          applicants={mine}
          onSelect={(id) => {
            setEditId(id);
            setView("edit");
          }}
        />
      )}

      {view === "create" && (
        <ApplicantForm
          data={data}
          clientId={clientId}
          lockClient
          onCancel={() => setView("list")}
          onSubmit={(values) => {
            update(addApplicant(data, values));
            setView("list");
          }}
        />
      )}

      {view === "edit" && editing && (
        <ApplicantForm
          data={data}
          initial={editing}
          clientId={clientId}
          lockClient
          onCancel={() => setView("list")}
          onSubmit={(values) => {
            update(updateApplicant(data, editing.id, values as Partial<Applicant>));
            setView("list");
          }}
        />
      )}
    </main>
  );
}
