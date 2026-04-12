import { Metadata } from "next";
import { AuditorDashboard } from "@/components/dashboard/auditor-dashboard";

export const metadata: Metadata = { title: "Dashboard Auditor" };

export default function AuditorPage() {
  return <AuditorDashboard />;
}
