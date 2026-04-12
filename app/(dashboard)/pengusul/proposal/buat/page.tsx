import { Metadata } from "next";
import { ProposalWizard } from "@/components/proposals/proposal-wizard";

export const metadata: Metadata = {
  title: "Buat Proposal CSR",
};

export default function BuatProposalPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="section-title">Buat Proposal CSR</h1>
        <p className="section-subtitle">
          Isi formulir proposal dengan lengkap untuk meningkatkan peluang pendanaan.
        </p>
      </div>
      <ProposalWizard />
    </div>
  );
}
