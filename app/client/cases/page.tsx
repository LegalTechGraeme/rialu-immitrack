"use client";

import { useEffect, useMemo, useState } from "react";
import CaseTable from "@/components/CaseTable";
import Notifications from "@/components/Notifications";
import NewCaseModal from "@/components/NewCaseModal";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { getSession, updateCaseStatus } from "@/lib/store";

export default function ClientCasesPage() {
  const { data, update, ready } = useAppData();
  const [clientId, setClientId] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s?.clientId) setClientId(s.clientId);
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.applicants.filter((a) => a.clientId === clientId);
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
  }, [data, clientId, statusFilter, search]);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader
        title="My cases"
        subtitle="Sort columns, filter, update status with confirmation, or open a case for full detail"
        actions={
          <div className="flex gap-2">
            <Notifications data={data} onUpdate={update} clientId={clientId} />
            <button className="btn btn-primary text-xs" onClick={() => setNewCaseOpen(true)}>
              New case
            </button>
          </div>
        }
      />
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
          role="client"
          basePath="/client"
          onStatusChange={(id, status) =>
            update(updateCaseStatus(data, id, status, "client"))
          }
        />
      </PageBody>

      <NewCaseModal
        data={data}
        role="client"
        clientId={clientId}
        open={newCaseOpen}
        onClose={() => setNewCaseOpen(false)}
        onCreated={update}
      />
    </>
  );
}
