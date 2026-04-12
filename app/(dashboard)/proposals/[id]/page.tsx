import { Metadata } from "next";
import { ProposalDetailPage } from "@/components/proposals/proposal-detail-page";

export const metadata: Metadata = { title: "Detail Proposal" };

export default async function ProposalDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProposalDetailPage id={id} />;
}
