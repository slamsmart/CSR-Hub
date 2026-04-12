import { Metadata } from "next";
import { VerifikasiOrganisasiPage } from "@/components/verifikasi/verifikasi-organisasi-page";

export const metadata: Metadata = { title: "Verifikasi Organisasi - Admin" };

export default function AdminVerifikasiPage() {
  return <VerifikasiOrganisasiPage />;
}
