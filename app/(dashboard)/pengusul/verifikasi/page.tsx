import { Metadata } from "next";

export const metadata: Metadata = { title: "Organization Verification" };

export default function VerifikasiOrgPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Organization Verification Status</h1>
        <p className="section-subtitle">Track the verification progress of your organization's eligibility documents.</p>
      </div>
      <div className="p-6 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-green-700 text-lg">Organization Verified</p>
          <p className="text-sm text-green-600 mt-1">
            Yayasan Cerdas Nusantara was successfully verified on April 8, 2025.
            You can now submit proposals without restrictions.
          </p>
        </div>
      </div>
    </div>
  );
}
