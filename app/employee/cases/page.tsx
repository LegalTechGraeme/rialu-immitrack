"use client";

import { useMemo, useState } from "react";
import CaseTable from "@/components/CaseTable";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { updateCaseStatus } from "@/lib/store";

export default function EmployeeCasesPage() {
  const { data, update, ready } = useAppData();
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.applicants;
    if (clientFilter) list = list.filter((a) => a.clientId === clientFilter);
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.firstName.toLowerCase().includes(q) ||
          a.lastName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.visaType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, clientFilter, statusFilter, search]);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader title="All cases" subtitle="Sort columns, update status with confirmation, or open a case for full detail" />
      <PageBody>
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="search"
            placeholder="Search cases…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm min-w-[200px]"
            style={{ borderColor: "var(--border)" }}
          />
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value ? Number(e.target.value) : "")}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="">All clients</option>
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--border)" }}
          >
            <option value="">All statuses</option>
            <option value="intake">Intake</option>
            <option value="documents">Documents</option>
            <option value="submitted">Submitted</option>
            <option value="processing">Processing</option>
            <option value="additional_info">Additional info</option>
            <option value="approved">Approved</option>
            <option value="refused">Refused</option>
            <option value="on_hold">On hold</option>
          </select>
        </div>
        <CaseTable
          data={data}
          applicants={filtered}
          role="employee"
          basePath="/employee"
          showClient
          onStatusChange={(id, status) =>
            update(updateCaseStatus(data, id, status, "employee"))
          }
        />
      </PageBody>
    </>
  );
}
