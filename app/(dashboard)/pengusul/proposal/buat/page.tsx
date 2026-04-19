import { Metadata } from "next";
import { ProposalWizard } from "@/components/proposals/proposal-wizard";

export const metadata: Metadata = {
  title: "Create CSR Proposal",
};

export default function BuatProposalPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Create CSR Proposal</h1>
        <p className="section-subtitle">
          Complete the proposal form thoroughly to improve your funding opportunities.
        </p>
      </div>
      <ProposalWizard />
    </div>
  );
}
