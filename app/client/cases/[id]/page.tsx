"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CaseDetailView from "@/components/CaseDetailView";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";
import { getSession } from "@/lib/store";

export default function ClientCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, update, ready } = useAppData();
  const [clientId, setClientId] = useState(1);

  useEffect(() => {
    const s = getSession();
    if (s?.clientId) setClientId(s.clientId);
  }, []);

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  const applicant = data.applicants.find(
    (a) => a.id === Number(id) && a.clientId === clientId
  );

  if (!applicant) {
    return (
      <PageBody>
        <p>Case not found.</p>
        <button className="btn btn-secondary mt-4" onClick={() => router.push("/client")}>
          Back to dashboard
        </button>
      </PageBody>
    );
  }

  return (
    <>
      <PageHeader
        title={`${applicant.firstName} ${applicant.lastName}`}
        subtitle={applicant.visaType}
        actions={
          <button className="btn btn-secondary" onClick={() => router.push("/client")}>
            ← Dashboard
          </button>
        }
      />
      <PageBody>
        <CaseDetailView data={data} applicant={applicant} role="client" onUpdate={update} />
      </PageBody>
    </>
  );
}
