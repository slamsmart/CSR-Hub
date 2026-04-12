import { Metadata } from "next";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export const metadata: Metadata = { title: "Analytics Global" };

export default function AdminAnalyticsPage() {
  return <AdminDashboard />;
}
