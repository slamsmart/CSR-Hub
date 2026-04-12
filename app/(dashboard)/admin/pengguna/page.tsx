import { Metadata } from "next";
import { ManajemenPenggunaPage } from "@/components/admin/manajemen-pengguna-page";

export const metadata: Metadata = { title: "Manajemen Pengguna" };

export default function AdminPenggunaPage() {
  return <ManajemenPenggunaPage />;
}
