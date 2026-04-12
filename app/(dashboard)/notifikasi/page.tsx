import { Metadata } from "next";
import { NotificationsPage } from "@/components/notifications/notifications-page";

export const metadata: Metadata = { title: "Notifikasi" };

export default function NotifikasiPage() {
  return <NotificationsPage />;
}
