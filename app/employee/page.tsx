"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatCardDetail from "@/components/StatCardDetail";
import Notifications from "@/components/Notifications";
import NewCaseModal from "@/components/NewCaseModal";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { generateTeamInsights } from "@/lib/ai";
import { resetData } from "@/lib/store";
import type { Applicant } from "@/lib/types";

type StatPanel = "active" | "urgent" | "authorities" | "approved";

const WITH_AUTHORITIES: Applicant["status"][] = ["submitted", "processing", "additional_info"];

export default function EmployeeOverview() {
  const { data, update, ready } = useAppData();
  const [openPanel, setOpenPanel] = useState<StatPanel | null>(null);
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  const stats = useMemo(() => {
    if (!data) return null;
    const active = data.applicants;
    const urgent = data.applicants.filter((a) => a.priority === "urgent");
    const authorities = data.applicants.filter((a) => WITH_AUTHORITIES.includes(a.status));
    const approved = data.applicants.filter((a) => a.status === "approved");
    return {
      total: active.length,
      urgent: urgent.length,
      processing: authorities.length,
      approved: approved.length,
      active,
      urgentList: urgent,
      authoritiesList: authorities,
      approvedList: approved,
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCardDetail
            label="Active cases"
            value={stats.total}
            applicants={stats.active}
            clients={data.clients}
            open={openPanel === "active"}
            onOpen={() => setOpenPanel("active")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="Urgent"
            value={stats.urgent}
            accent="danger"
            hint="Needs action today"
            applicants={stats.urgentList}
            clients={data.clients}
            emptyMessage="No urgent cases right now."
            open={openPanel === "urgent"}
            onOpen={() => setOpenPanel("urgent")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="With authorities"
            value={stats.processing}
            accent="gold"
            applicants={stats.authoritiesList}
            clients={data.clients}
            emptyMessage="No cases currently with the authorities."
            open={openPanel === "authorities"}
            onOpen={() => setOpenPanel("authorities")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="Approved"
            value={stats.approved}
            accent="success"
            applicants={stats.approvedList}
            clients={data.clients}
            emptyMessage="No approved cases yet."
            open={openPanel === "approved"}
            onOpen={() => setOpenPanel("approved")}
            onClose={() => setOpenPanel(null)}
          />
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

      <NewCaseModal
        data={data}
        role="employee"
        open={newCaseOpen}
        onClose={() => setNewCaseOpen(false)}
        onCreated={update}
      />
    </>
  );
}
