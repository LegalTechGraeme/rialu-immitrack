"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatCardDetail from "@/components/StatCardDetail";
import CaseTable from "@/components/CaseTable";
import Notifications from "@/components/Notifications";
import NewCaseModal from "@/components/NewCaseModal";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { getSession, resetData, updateCaseStatus } from "@/lib/store";

type StatPanel = "total" | "active" | "approved";

export default function ClientDashboard() {
  const { data, update, ready } = useAppData();
  const [clientId, setClientId] = useState(1);
  const [openPanel, setOpenPanel] = useState<StatPanel | null>(null);
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (s?.clientId) setClientId(s.clientId);
  }, []);

  const client = data?.clients.find((c) => c.id === clientId);
  const mine = useMemo(
    () => data?.applicants.filter((a) => a.clientId === clientId) ?? [],
    [data, clientId]
  );

  const stats = useMemo(() => {
    const active = mine.filter((a) => !["approved", "refused"].includes(a.status));
    const approved = mine.filter((a) => a.status === "approved");
    return {
      total: mine.length,
      active: active.length,
      approved: approved.length,
      all: mine,
      activeList: active,
      approvedList: approved,
    };
  }, [mine]);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader
        title="Your dashboard"
        subtitle={client?.name ?? "Client portal"}
        actions={
          <div className="flex gap-2">
            <Notifications data={data} onUpdate={update} clientId={clientId} />
            <button className="btn btn-primary text-xs" onClick={() => setNewCaseOpen(true)}>
              New case
            </button>
            <button className="btn btn-ghost text-xs" onClick={() => update(resetData())}>
              Reset demo
            </button>
          </div>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCardDetail
            label="Your cases"
            value={stats.total}
            applicants={stats.all}
            clients={data.clients}
            caseLinkPrefix="/client"
            emptyMessage="No cases yet — create your first application."
            open={openPanel === "total"}
            onOpen={() => setOpenPanel("total")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="In progress"
            value={stats.active}
            accent="gold"
            applicants={stats.activeList}
            clients={data.clients}
            caseLinkPrefix="/client"
            emptyMessage="No cases in progress."
            open={openPanel === "active"}
            onOpen={() => setOpenPanel("active")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="Approved"
            value={stats.approved}
            accent="success"
            applicants={stats.approvedList}
            clients={data.clients}
            caseLinkPrefix="/client"
            emptyMessage="No approved cases yet."
            open={openPanel === "approved"}
            onOpen={() => setOpenPanel("approved")}
            onClose={() => setOpenPanel(null)}
          />
        </div>

        <div className="card p-5 mb-8" style={{ borderLeft: "3px solid var(--navy)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Open a new case for an employee, sort and filter your applications, and update status
            with confirmation. Your immigration team is notified automatically on every change.
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl">Your applications</h2>
          <Link href="/client/cases" className="text-sm font-medium hover:underline" style={{ color: "var(--navy)" }}>
            View all →
          </Link>
        </div>

        <CaseTable
          data={data}
          applicants={mine}
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
