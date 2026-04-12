import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { PengusulDashboard } from "@/components/dashboard/pengusul-dashboard";
import { PerusahaanDashboard } from "@/components/dashboard/perusahaan-dashboard";
import { VerifikatorDashboard } from "@/components/dashboard/verifikator-dashboard";
import { AuditorDashboard } from "@/components/dashboard/auditor-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role as string;

  if (role === "SUPER_ADMIN" || role === "ADMIN_PLATFORM") {
    return <AdminDashboard />;
  }
  if (role === "VERIFIKATOR") {
    return <VerifikatorDashboard />;
  }
  if (role === "AUDITOR") {
    return <AuditorDashboard />;
  }
  if (role === "PERUSAHAAN") {
    return <PerusahaanDashboard />;
  }
  if (role === "PENGUSUL" || role === "DONOR_KOLABORATOR") {
    return <PengusulDashboard />;
  }

  return <PengusulDashboard />;
}
