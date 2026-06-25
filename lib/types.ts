export type Role = "employee" | "client";

export interface Client {
  id: number;
  name: string;
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
  status: "pending" | "processing" | "approved" | "rejected";
  currentExpiry: string;
}

export interface Document {
  id: number;
  applicantId: number;
  documentType: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
}

export interface Notification {
  id: number;
  message: string;
  actionType: "CREATE" | "UPDATE";
  applicantId: number;
  clientId: number;
  createdAt: string;
  read: boolean;
}

export interface AppData {
  clients: Client[];
  applicants: Applicant[];
  documents: Document[];
  notifications: Notification[];
}

export interface DemoSession {
  role: Role;
  clientId?: number;
}
