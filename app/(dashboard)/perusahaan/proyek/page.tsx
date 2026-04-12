import { Metadata } from "next";
import { ProjectMonitoringPage } from "@/components/projects/project-monitoring-page";

export const metadata: Metadata = { title: "Proyek CSR Saya" };

export default function PerusahaanProyekPage() {
  return <ProjectMonitoringPage />;
}
