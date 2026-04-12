import { Metadata } from "next";
import { VerifikasiOrganisasiPage } from "@/components/verifikasi/verifikasi-organisasi-page";

export const metadata: Metadata = { title: "Manajemen Organisasi" };

export default function AdminOrganisasiPage() {
  return <VerifikasiOrganisasiPage />;
}
