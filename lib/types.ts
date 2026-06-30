export type Role = "employee" | "client";

export type CaseStatus =
  | "intake"
  | "documents"
  | "submitted"
  | "processing"
  | "additional_info"
  | "approved"
  | "refused"
  | "on_hold";

export interface Client {
  id: number;
  name: string;
  industry?: string;
}

export interface Applicant {
  id: number;
  clientId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  status: CaseStatus;
  visaType: string;
  currentPermission?: string;
  currentExpiry?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  nextAction?: string;
}

export interface Document {
  id: number;
  applicantId: number;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired" | "missing";
  required?: boolean;
}

export interface Notification {
  id: number;
  message: string;
  actionType: "CREATE" | "UPDATE" | "STATUS" | "AI";
  applicantId: number;
  clientId: number;
  createdAt: string;
  read: boolean;
}

export interface TimelineEvent {
  id: number;
  applicantId: number;
  type: "status_change" | "note" | "document" | "ai_insight" | "system";
  message: string;
  createdAt: string;
  actor: "employee" | "client" | "system" | "ai";
  clientVisible: boolean;
}

export interface CaseNote {
  id: number;
  applicantId: number;
  body: string;
  createdAt: string;
  author: "employee" | "client";
  clientVisible: boolean;
}

export interface AppData {
  clients: Client[];
  applicants: Applicant[];
  documents: Document[];
  notifications: Notification[];
  timeline: TimelineEvent[];
  notes: CaseNote[];
}

export interface DemoSession {
  role: Role;
  clientId?: number;
}

export const STATUS_LABELS: Record<CaseStatus, string> = {
  intake: "Intake",
  documents: "Gathering documents",
  submitted: "Submitted to ISD",
  processing: "Under review",
  additional_info: "Additional info requested",
  approved: "Approved",
  refused: "Refused",
  on_hold: "On hold",
};

export const EMPLOYEE_STATUSES: CaseStatus[] = [
  "intake",
  "documents",
  "submitted",
  "processing",
  "additional_info",
  "approved",
  "refused",
  "on_hold",
];

export const CLIENT_STATUSES: CaseStatus[] = [
  "documents",
  "on_hold",
  "submitted",
];
