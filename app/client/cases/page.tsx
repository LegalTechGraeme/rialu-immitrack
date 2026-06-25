"use client";

import { useEffect, useState } from "react";
import CaseTable from "@/components/CaseTable";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { getSession, updateCaseStatus } from "@/lib/store";

export default function ClientCasesPage() {
  const { data, update, ready } = useAppData();
  const [clientId, setClientId] = useState(1);

  useEffect(() => {
    const s = getSession();
    if (s?.clientId) setClientId(s.clientId);
  }, []);

  const mine = data?.applicants.filter((a) => a.clientId === clientId) ?? [];

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  return (
    <>
      <PageHeader
        title="My cases"
        subtitle="Update status and open any case for documents, notes, and timeline"
      />
      <PageBody>
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
