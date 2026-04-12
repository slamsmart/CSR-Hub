import { Metadata } from "next";
import { VerifikasiOrganisasiPage } from "@/components/verifikasi/verifikasi-organisasi-page";

export const metadata: Metadata = { title: "Verifikasi Organisasi" };

export default function VerifikasiOrganisasiRoute() {
  return <VerifikasiOrganisasiPage />;
}
