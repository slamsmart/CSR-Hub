import { Metadata } from "next";
import { SustainabilityReportPage } from "@/components/sustainability/sustainability-report-page";

export const metadata: Metadata = { title: "Laporan Sustainability" };

export default function SustainabilityPage() {
  return <SustainabilityReportPage />;
}
