import { Metadata } from "next";
import { PengaturanPage } from "@/components/settings/pengaturan-page";

export const metadata: Metadata = { title: "Pengaturan Platform" };

export default function AdminSettingsPage() {
  return <PengaturanPage />;
}
