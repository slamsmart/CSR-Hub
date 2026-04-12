import { Metadata } from "next";
import { PelaporanPageClient } from "@/components/projects/pelaporan-page-client";

export const metadata: Metadata = { title: "Pelaporan Program - CSR Hub" };

export default function PelaporanPage() {
  return <PelaporanPageClient />;
}
