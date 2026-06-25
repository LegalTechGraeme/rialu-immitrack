"use client";

import Link from "next/link";
import { useMemo } from "react";
import StatCard from "@/components/StatCard";
import Notifications from "@/components/Notifications";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { generateTeamInsights } from "@/lib/ai";
import { resetData } from "@/lib/store";

export default function EmployeeOverview() {
  const { data, update, ready } = useAppData();

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      total: data.applicants.length,
      urgent: data.applicants.filter((a) => a.priority === "urgent").length,
      processing: data.applicants.filter((a) =>
        ["submitted", "processing", "additional_info"].includes(a.status)
      ).length,
      approved: data.applicants.filter((a) => a.status === "approved").length,
    };
  }, [data]);

  const priorityCases = useMemo(() => {
    if (!data) return [];
    return [...data.applicants]
      .sort((a, b) => {
        const p = { urgent: 0, high: 1, medium: 2, low: 3 };
        return p[a.priority] - p[b.priority];
      })
      .slice(0, 5);
  }, [data]);

  const insights = data ? generateTeamInsights(data) : [];

  if (!ready || !data || !stats) {
    return <PageBody><p style={{ color: "var(--text-muted)" }}>Loading…</p></PageBody>;
  }

  return (
    <>
      <PageHeader
        title="Team overview"
        subtitle="Immigration caseload across all corporate clients"
        actions={
          <div className="flex gap-2">
            <Notifications data={data} onUpdate={update} />
            <button className="btn btn-ghost text-xs" onClick={() => update(resetData())}>
              Reset demo
            </button>
          </div>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard label="Active cases" value={stats.total} />
          <StatCard label="Urgent" value={stats.urgent} accent="danger" hint="Needs action today" />
          <StatCard label="With authorities" value={stats.processing} accent="gold" />
          <StatCard label="Approved" value={stats.approved} accent="success" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="px-5 py-4 border-b font-semibold" style={{ borderColor: "var(--border)" }}>
              Priority queue
            </div>
            <ul>
              {priorityCases.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between px-5 py-3 border-b hover:bg-[var(--bg-muted)] transition"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <div>
                    <Link href={`/employee/cases/${a.id}`} className="font-medium hover:underline" style={{ color: "var(--navy)" }}>
                      {a.firstName} {a.lastName}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{a.nextAction}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <PriorityBadge priority={a.priority} />
                    <StatusBadge status={a.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="ai-panel card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: "var(--gold)" }}>✦</span>
              <span className="font-semibold" style={{ color: "var(--navy)" }}>AI team briefing</span>
            </div>
            <ul className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {insights.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "var(--gold)" }}>·</span>
                  {line}
                </li>
              ))}
            </ul>
            <Link href="/employee/intelligence" className="inline-block mt-4 text-sm font-medium hover:underline" style={{ color: "var(--navy)" }}>
              Full intelligence view →
            </Link>
          </div>
        </div>
      </PageBody>
    </>
  );
}
