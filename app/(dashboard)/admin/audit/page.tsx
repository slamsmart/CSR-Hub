import { Metadata } from "next";
import { AuditLogPage } from "@/components/admin/audit-log-page";

export const metadata: Metadata = { title: "Audit Log" };

export default function AuditLogRoute() {
  return <AuditLogPage />;
}
