import { Metadata } from "next";
import { DanaPengusulPage } from "@/components/pendanaan/dana-pengusul-page";

export const metadata: Metadata = { title: "Riwayat Dana" };

export default function DanaPage() {
  return <DanaPengusulPage />;
}
