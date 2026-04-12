import { Metadata } from "next";
import { VerifikatorDashboard } from "@/components/dashboard/verifikator-dashboard";

export const metadata: Metadata = { title: "Dashboard Verifikator" };

export default function VerifikatorPage() {
  return <VerifikatorDashboard />;
}
