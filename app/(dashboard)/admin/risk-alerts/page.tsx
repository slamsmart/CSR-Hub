import { Metadata } from "next";
import { RiskAlertsPage } from "@/components/admin/risk-alerts-page";

export const metadata: Metadata = { title: "Risk Alerts" };

export default function RiskAlertsRoute() {
  return <RiskAlertsPage />;
}
