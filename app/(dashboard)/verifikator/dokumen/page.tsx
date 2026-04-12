import { Metadata } from "next";
import { VerifikasiOrganisasiPage } from "@/components/verifikasi/verifikasi-organisasi-page";

export const metadata: Metadata = { title: "Review Dokumen" };

export default function ReviewDokumenPage() {
  return <VerifikasiOrganisasiPage />;
}
