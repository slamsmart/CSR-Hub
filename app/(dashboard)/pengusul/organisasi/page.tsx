import { Metadata } from "next";
import { PengaturanPage } from "@/components/settings/pengaturan-page";

export const metadata: Metadata = { title: "Profil Organisasi" };

export default function OrganisasiPage() {
  return <PengaturanPage />;
}
