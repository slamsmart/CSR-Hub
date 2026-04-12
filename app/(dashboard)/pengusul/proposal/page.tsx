import { Metadata } from "next";
import { ProposalListPage } from "@/components/proposals/proposal-list-page";

export const metadata: Metadata = { title: "Proposal Saya" };

export default function ProposalPage() {
  return <ProposalListPage />;
}
