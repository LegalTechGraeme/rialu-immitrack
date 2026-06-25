"use client";

import { useParams, useRouter } from "next/navigation";
import CaseDetailView from "@/components/CaseDetailView";
import PageBody, { PageHeader } from "@/components/PageHeader";
import { useAppData } from "@/hooks/useAppData";

export default function EmployeeCaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, update, ready } = useAppData();

  if (!ready || !data) return <PageBody><p>Loading…</p></PageBody>;

  const applicant = data.applicants.find((a) => a.id === Number(id));
  if (!applicant) {
    return (
      <PageBody>
        <p>Case not found.</p>
        <button className="btn btn-secondary mt-4" onClick={() => router.push("/employee/cases")}>
          Back to cases
        </button>
      </PageBody>
    );
  }

  return (
    <>
      <PageHeader
        title={`Case #${applicant.id}`}
        subtitle={`${applicant.firstName} ${applicant.lastName}`}
        actions={
          <button className="btn btn-secondary" onClick={() => router.push("/employee/cases")}>
            ← All cases
          </button>
        }
      />
      <PageBody>
        <CaseDetailView data={data} applicant={applicant} role="employee" onUpdate={update} />
      </PageBody>
    </>
  );
}
