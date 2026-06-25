"use client";

import type { Applicant, AppData } from "@/lib/types";

interface Props {
  data: AppData;
  initial?: Partial<Applicant>;
  clientId?: number;
  lockClient?: boolean;
  onSubmit: (values: Omit<Applicant, "id">) => void;
  onCancel: () => void;
}

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  nationality: "",
  status: "pending" as const,
  currentExpiry: "",
  clientId: 1,
};

export default function ApplicantForm({
  data,
  initial,
  clientId,
  lockClient = false,
  onSubmit,
  onCancel,
}: Props) {
  const defaults = { ...empty, ...initial, clientId: clientId ?? initial?.clientId ?? 1 };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      clientId: Number(fd.get("clientId")),
      firstName: String(fd.get("firstName")),
      lastName: String(fd.get("lastName")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      dateOfBirth: String(fd.get("dateOfBirth")),
      nationality: String(fd.get("nationality")),
      status: fd.get("status") as Applicant["status"],
      currentExpiry: String(fd.get("currentExpiry")),
    });
  }

  const field = (name: keyof typeof defaults, label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaults[name] as string}
        required={["firstName", "lastName", "email"].includes(name)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-800">
        {initial?.id ? "Update applicant" : "New applicant"}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("firstName", "First name")}
        {field("lastName", "Last name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone")}
        {field("dateOfBirth", "Date of birth", "date")}
        {field("nationality", "Nationality")}
        {field("currentExpiry", "Permit expiry", "date")}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            defaultValue={defaults.status}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {!lockClient && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client
            </label>
            <select
              name="clientId"
              defaultValue={defaults.clientId}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {lockClient && (
          <input type="hidden" name="clientId" value={clientId} />
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
