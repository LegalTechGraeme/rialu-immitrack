"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/StatCard";
import CaseTable from "@/components/CaseTable";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { getSession, resetData, updateCaseStatus } from "@/lib/store";

export default function ClientDashboard() {
  const { data, update, ready } = useAppData();
  const [clientId, setClientId] = useState(1);

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
    if (!mine.length) return { total: 0, active: 0, approved: 0 };
    return {
      total: mine.length,
      active: mine.filter((a) => !["approved", "refused"].includes(a.status)).length,
      approved: mine.filter((a) => a.status === "approved").length,
    };
  }, [mine]);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader
        title="Your dashboard"
        subtitle={client?.name ?? "Client portal"}
        actions={
          <button className="btn btn-ghost text-xs" onClick={() => update(resetData())}>
            Reset demo
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Your cases" value={stats.total} />
          <StatCard label="In progress" value={stats.active} accent="gold" />
          <StatCard label="Approved" value={stats.approved} accent="success" />
        </div>

        <div className="card p-5 mb-8" style={{ borderLeft: "3px solid var(--navy)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Update case status when you&apos;ve gathered documents or are ready to submit.
            Your immigration team is notified automatically on every change.
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
    </>
  );
}
