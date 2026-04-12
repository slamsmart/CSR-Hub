import { Metadata } from "next";
import { ProposalListPage } from "@/components/proposals/proposal-list-page";

export const metadata: Metadata = { title: "Manajemen Proposal" };

export default function AdminProposalsPage() {
  return <ProposalListPage />;
}
