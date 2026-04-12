import { Metadata } from "next";
import { LaporanAuditPage } from "@/components/auditor/laporan-audit-page";

export const metadata: Metadata = { title: "Laporan Audit" };

export default function LaporanAuditRoute() {
  return <LaporanAuditPage />;
}
