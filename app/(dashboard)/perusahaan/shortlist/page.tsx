import { Metadata } from "next";
import { ShortlistPage } from "@/components/matching/shortlist-page";

export const metadata: Metadata = { title: "Shortlist Proposal" };

export default function ShortlistRoute() {
  return <ShortlistPage />;
}
