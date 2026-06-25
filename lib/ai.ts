import type { Applicant, AppData, CaseStatus } from "./types";
import { STATUS_LABELS } from "./types";

export function generateCaseBrief(
  applicant: Applicant,
  data: AppData
): string {
  const docs = data.documents.filter((d) => d.applicantId === applicant.id);
  const missing = docs.filter((d) => d.status === "missing");
  const expiring = docs.filter((d) => d.status === "expiring");
  const notes = data.notes.filter((n) => n.applicantId === applicant.id);

  const lines = [
    `**${applicant.firstName} ${applicant.lastName}** — ${applicant.visaType}`,
    `Status: ${STATUS_LABELS[applicant.status]} · Priority: ${applicant.priority}`,
    applicant.nextAction ? `Next action: ${applicant.nextAction}` : "",
    "",
    missing.length > 0
      ? `⚠ ${missing.length} required document(s) missing: ${missing.map((d) => d.documentType).join(", ")}.`
      : "✓ All required documents on file.",
    expiring.length > 0
      ? `⏱ ${expiring.length} document(s) expiring soon.`
      : "",
    notes.length > 0
      ? `\nLatest note: "${notes[notes.length - 1].body.slice(0, 120)}…"`
      : "",
    "",
    "Recommendation: " +
      (applicant.priority === "urgent"
        ? "Escalate — immediate solicitor review required."
        : applicant.status === "documents"
          ? "Follow up with client on outstanding documents within 48h."
          : applicant.status === "processing"
            ? "Monitor ISD portal; no action unless queried."
            : "Maintain standard review cadence."),
  ];

  return lines.filter(Boolean).join("\n");
}

export function generateTeamInsights(data: AppData): string[] {
  const urgent = data.applicants.filter((a) => a.priority === "urgent");
  const missingDocs = data.applicants.filter((a) =>
    data.documents.some(
      (d) => d.applicantId === a.id && d.status === "missing"
    )
  );
  const expiring = data.applicants.filter(
    (a) => a.currentExpiry && new Date(a.currentExpiry) < new Date(Date.now() + 90 * 86400000)
  );

  return [
    urgent.length > 0
      ? `${urgent.length} urgent case(s) need attention today — start with Tom Schmidt (ISD deadline).`
      : "No urgent cases flagged.",
    missingDocs.length > 0
      ? `${missingDocs.length} case(s) have missing documents — bulk reminder recommended.`
      : "Document compliance is clear across active cases.",
    expiring.length > 0
      ? `${expiring.length} permit(s) expire within 90 days — schedule renewal pipeline.`
      : "No imminent permit expiries in the next quarter.",
    `Portfolio: ${data.applicants.length} active cases across ${data.clients.length} corporate clients.`,
  ];
}
