"use client";

import { useMemo, useState } from "react";
import CaseTable from "@/components/CaseTable";
import StatCardDetail from "@/components/StatCardDetail";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { monthsUntil, updateCaseStatus } from "@/lib/store";

type StatPanel = "expiring" | "wip" | "missing";

export default function ReportsPage() {
  const { data, update, ready } = useAppData();
  const [expiryMonths, setExpiryMonths] = useState(3);
  const [openPanel, setOpenPanel] = useState<StatPanel | null>(null);

  const expiring = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter(
      (a) =>
        a.currentExpiry &&
        monthsUntil(a.currentExpiry) >= 0 &&
        monthsUntil(a.currentExpiry) <= expiryMonths
    );
  }, [data, expiryMonths]);

  const wip = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter((a) =>
      ["intake", "documents", "submitted", "processing", "additional_info"].includes(a.status)
    );
  }, [data]);

  const missingDocs = useMemo(() => {
    if (!data) return [];
    return data.applicants.filter((a) =>
      data.documents.some((d) => d.applicantId === a.id && d.status === "missing")
    );
  }, [data]);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader title="Reports & alerts" subtitle="Expiry pipeline, WIP, and compliance gaps" />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCardDetail
            label="Expiring soon"
            value={expiring.length}
            accent="warning"
            applicants={expiring}
            clients={data.clients}
            emptyMessage="No permits expiring in this window."
            open={openPanel === "expiring"}
            onOpen={() => setOpenPanel("expiring")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="Work in progress"
            value={wip.length}
            accent="navy"
            applicants={wip}
            clients={data.clients}
            emptyMessage="No cases in progress."
            open={openPanel === "wip"}
            onOpen={() => setOpenPanel("wip")}
            onClose={() => setOpenPanel(null)}
          />
          <StatCardDetail
            label="Missing documents"
            value={missingDocs.length}
            accent="danger"
            applicants={missingDocs}
            clients={data.clients}
            emptyMessage="No document compliance gaps."
            open={openPanel === "missing"}
            onOpen={() => setOpenPanel("missing")}
            onClose={() => setOpenPanel(null)}
          />
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-serif text-xl">Permit expiry report</h2>
            <select
              value={expiryMonths}
              onChange={(e) => setExpiryMonths(Number(e.target.value))}
              className="rounded-lg border px-3 py-1.5 text-sm"
              style={{ borderColor: "var(--border)" }}
            >
              <option value={3}>Within 3 months</option>
              <option value={6}>Within 6 months</option>
              <option value={9}>Within 9 months</option>
            </select>
          </div>
          <CaseTable
            data={data}
            applicants={expiring}
            role="employee"
            basePath="/employee"
            showClient
            onStatusChange={(id, status) =>
              update(updateCaseStatus(data, id, status, "employee"))
            }
          />
        </section>

        <section className="mb-10">
          <h2 className="font-serif text-xl mb-4">Work in progress</h2>
          <CaseTable
            data={data}
            applicants={wip}
            role="employee"
            basePath="/employee"
            showClient
            onStatusChange={(id, status) =>
              update(updateCaseStatus(data, id, status, "employee"))
            }
          />
        </section>

        <section>
          <h2 className="font-serif text-xl mb-4">Document compliance gaps</h2>
          <CaseTable
            data={data}
            applicants={missingDocs}
            role="employee"
            basePath="/employee"
            showClient
            onStatusChange={(id, status) =>
              update(updateCaseStatus(data, id, status, "employee"))
            }
          />
        </section>
      </PageBody>
    </>
  );
}
