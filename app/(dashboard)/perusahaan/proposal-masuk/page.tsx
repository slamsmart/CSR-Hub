import { Metadata } from "next";
import { ProposalListPage } from "@/components/proposals/proposal-list-page";

export const metadata: Metadata = { title: "Proposal Masuk" };

export default function ProposalMasukPage() {
  return <ProposalListPage />;
}
