import { Metadata } from "next";
import { CofundingPage } from "@/components/cofunding/cofunding-page";

export const metadata: Metadata = { title: "Co-Funding & Kolaborasi" };

export default function CofundingPageRoute() {
  return <CofundingPage />;
}
