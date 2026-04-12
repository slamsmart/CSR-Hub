import { Metadata } from "next";
import { ProjectMonitoringPage } from "@/components/projects/project-monitoring-page";

export const metadata: Metadata = { title: "Proyek Aktif - Auditor" };

export default function AuditorProyekPage() {
  return <ProjectMonitoringPage />;
}
