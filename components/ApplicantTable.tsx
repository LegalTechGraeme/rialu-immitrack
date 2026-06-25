"use client";

import type { Applicant, AppData } from "@/lib/types";
import { clientName } from "@/lib/store";
import Badge from "./Badge";

interface Props {
  data: AppData;
  applicants: Applicant[];
  showClient?: boolean;
  onSelect?: (id: number) => void;
}

export default function ApplicantTable({
  data,
  applicants,
  showClient = false,
  onSelect,
}: Props) {
  if (applicants.length === 0) {
    return (
      <p className="text-slate-500 py-8 text-center">No applicants found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Expiry</th>
            {showClient && (
              <th className="px-4 py-3 font-semibold">Client</th>
            )}
            {onSelect && <th className="px-4 py-3 font-semibold" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {applicants.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">
                {a.firstName} {a.lastName}
              </td>
              <td className="px-4 py-3 text-slate-600">{a.email}</td>
              <td className="px-4 py-3">
                <Badge label={a.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">{a.currentExpiry}</td>
              {showClient && (
                <td className="px-4 py-3 text-slate-600">
                  {clientName(data, a.clientId)}
                </td>
              )}
              {onSelect && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onSelect(a.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
