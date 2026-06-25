import clients from "@/data/clients.json";
import applicants from "@/data/applicants.json";
import documents from "@/data/documents.json";
import notifications from "@/data/notifications.json";
import timeline from "@/data/timeline.json";
import notes from "@/data/notes.json";
import type { AppData } from "./types";

export const SEED_DATA: AppData = {
  clients: clients as AppData["clients"],
  applicants: applicants as AppData["applicants"],
  documents: documents as AppData["documents"],
  notifications: notifications as AppData["notifications"],
  timeline: timeline as AppData["timeline"],
  notes: notes as AppData["notes"],
};
