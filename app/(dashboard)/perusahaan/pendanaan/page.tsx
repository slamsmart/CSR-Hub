import { Metadata } from "next";
import { RiwayatPendanaanPage } from "@/components/pendanaan/riwayat-pendanaan-page";

export const metadata: Metadata = { title: "Riwayat Pendanaan" };

export default function PendanaanPage() {
  return <RiwayatPendanaanPage />;
}
