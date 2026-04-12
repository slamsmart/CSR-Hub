import { Metadata } from "next";
import { ProjectMonitoringPage } from "@/components/projects/project-monitoring-page";

export const metadata: Metadata = { title: "Monitoring Proyek" };

export default function ProyekPage() {
  return <ProjectMonitoringPage />;
}
