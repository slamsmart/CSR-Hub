import { Metadata } from "next";
import { PengaturanPage } from "@/components/settings/pengaturan-page";

export const metadata: Metadata = { title: "Profil CSR Perusahaan" };

export default function ProfilCSRPage() {
  return <PengaturanPage />;
}
