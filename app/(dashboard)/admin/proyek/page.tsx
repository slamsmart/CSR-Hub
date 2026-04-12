import { Metadata } from "next";
import { ProjectMonitoringPage } from "@/components/projects/project-monitoring-page";

export const metadata: Metadata = { title: "Semua Proyek" };

export default function AdminProyekPage() {
  return <ProjectMonitoringPage />;
}
