import { Metadata } from "next";
import { PengaturanPage } from "@/components/settings/pengaturan-page";

export const metadata: Metadata = { title: "Pengaturan Akun" };

export default function PengaturanRoute() {
  return <PengaturanPage />;
}
