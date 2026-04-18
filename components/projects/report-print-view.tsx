"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";

interface ReportData {
  id: string;
  title: string;
  reportType: string;
  reportingPeriod: string;
  progressFisik: number;
  progressKeuangan: number;
  realisasiAnggaran: string;
  summary: string;
  pencapaian?: string;
  kendala?: string;
  rencanaTindakLanjut?: string;
  attachments: string[];
  submittedAt?: string;
  createdAt: string;
}

interface ReportPrintViewProps {
  report: ReportData;
  projectTitle: string;
  orgName: string;
  onClose: () => void;
}

const TYPE_LABELS = {
  id: {
    BULANAN: "Laporan Bulanan",
    TRIWULAN: "Laporan Triwulan",
    KEUANGAN: "Laporan Keuangan",
    AKHIR: "Laporan Akhir Proyek",
  },
  en: {
    BULANAN: "Monthly Report",
    TRIWULAN: "Quarterly Report",
    KEUANGAN: "Financial Report",
    AKHIR: "Final Project Report",
  },
} as const;

const CONTENT = {
  id: {
    back: "< Kembali",
    print: "Cetak / Unduh PDF",
    savePdfHint: 'Gunakan "Save as PDF" pada dialog cetak untuk menyimpan sebagai PDF',
    platformTagline: "Platform Marketplace CSR Nasional",
    projectName: "Nama Proyek",
    implementer: "Pelaksana",
    reportingPeriod: "Periode Laporan",
    reportType: "Jenis Laporan",
    reportDate: "Tanggal Laporan",
    section1: "I. Rekapitulasi Progres",
    section2: "II. Ringkasan Kegiatan",
    section3: "III. Pencapaian & Dampak",
    section4: "IV. Kendala & Solusi",
    section5: "V. Rencana Tindak Lanjut",
    section6: "VI. Lampiran",
    physicalProgress: "Progres Fisik",
    financialProgress: "Progres Keuangan",
    realizedBudget: "Realisasi Anggaran",
    preparedBy: "Dibuat oleh,",
    acknowledgedBy: "Diketahui oleh,",
    csrExecutor: "Pelaksana Program CSR",
    verifier: "Verifikator",
    footer: "Dokumen ini diterbitkan oleh CSR Hub - Platform Marketplace CSR Nasional | csrhub.id",
    locale: "id-ID",
  },
  en: {
    back: "< Back",
    print: "Print / Download PDF",
    savePdfHint: 'Use "Save as PDF" in the print dialog to download this report as a PDF',
    platformTagline: "National CSR Marketplace Platform",
    projectName: "Project Name",
    implementer: "Implementing Organization",
    reportingPeriod: "Reporting Period",
    reportType: "Report Type",
    reportDate: "Report Date",
    section1: "I. Progress Summary",
    section2: "II. Activity Summary",
    section3: "III. Achievements & Impact",
    section4: "IV. Challenges & Solutions",
    section5: "V. Next Action Plan",
    section6: "VI. Attachments",
    physicalProgress: "Physical Progress",
    financialProgress: "Financial Progress",
    realizedBudget: "Budget Realization",
    preparedBy: "Prepared by,",
    acknowledgedBy: "Acknowledged by,",
    csrExecutor: "CSR Program Implementer",
    verifier: "Verifier",
    footer: "This document is issued by CSR Hub - National CSR Marketplace Platform | csrhub.id",
    locale: "en-US",
  },
} as const;

export function ReportPrintView({ report, projectTitle, orgName, onClose }: ReportPrintViewProps) {
  const { language } = useLanguage();
  const text = CONTENT[language];
  const typeLabels = TYPE_LABELS[language];

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#report-print-root) { display: none !important; }
          #report-print-root { display: block !important; position: fixed; inset: 0; background: white; z-index: 9999; padding: 20mm; }
          .no-print { display: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      <div id="report-print-root" className="fixed inset-0 z-50 overflow-y-auto bg-white p-8">
        <div className="no-print sticky top-0 mb-6 flex items-center gap-3 border-b bg-white py-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            {text.back}
          </button>
          <button onClick={handlePrint} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            {text.print}
          </button>
          <span className="text-sm text-muted-foreground">{text.savePdfHint}</span>
        </div>

        <div className="mx-auto max-w-3xl font-sans text-gray-900">
          <div className="mb-6 border-b-2 border-gray-800 pb-4 text-center">
            <div className="mb-3 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg font-bold text-white">C</div>
              <span className="text-2xl font-bold">CSR<span className="text-green-600">Hub</span></span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wide">{typeLabels[report.reportType as keyof typeof typeLabels] || report.reportType}</h1>
            <p className="mt-1 text-sm text-gray-500">{text.platformTagline}</p>
          </div>

          <table className="mb-6 w-full border border-gray-300 text-sm">
            <tbody>
              <tr className="border-b border-gray-200"><td className="w-1/3 bg-gray-50 px-3 py-2 font-medium">{text.projectName}</td><td className="px-3 py-2">{projectTitle}</td></tr>
              <tr className="border-b border-gray-200"><td className="bg-gray-50 px-3 py-2 font-medium">{text.implementer}</td><td className="px-3 py-2">{orgName}</td></tr>
              <tr className="border-b border-gray-200"><td className="bg-gray-50 px-3 py-2 font-medium">{text.reportingPeriod}</td><td className="px-3 py-2">{report.reportingPeriod}</td></tr>
              <tr className="border-b border-gray-200"><td className="bg-gray-50 px-3 py-2 font-medium">{text.reportType}</td><td className="px-3 py-2">{typeLabels[report.reportType as keyof typeof typeLabels] || report.reportType}</td></tr>
              <tr>
                <td className="bg-gray-50 px-3 py-2 font-medium">{text.reportDate}</td>
                <td className="px-3 py-2">
                  {new Date(report.submittedAt || report.createdAt).toLocaleDateString(text.locale, { day: "numeric", month: "long", year: "numeric" })}
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section1}</h2>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-300 p-3 text-center"><p className="text-2xl font-bold text-green-600">{report.progressFisik}%</p><p className="mt-1 text-xs text-gray-500">{text.physicalProgress}</p></div>
            <div className="rounded-lg border border-gray-300 p-3 text-center"><p className="text-2xl font-bold text-blue-600">{report.progressKeuangan}%</p><p className="mt-1 text-xs text-gray-500">{text.financialProgress}</p></div>
            <div className="rounded-lg border border-gray-300 p-3 text-center"><p className="text-lg font-bold text-gray-800">{formatRupiah(Number(report.realisasiAnggaran))}</p><p className="mt-1 text-xs text-gray-500">{text.realizedBudget}</p></div>
          </div>

          <h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section2}</h2>
          <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">{report.summary}</p>

          {report.pencapaian && <><h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section3}</h2><p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">{report.pencapaian}</p></>}
          {report.kendala && <><h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section4}</h2><p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">{report.kendala}</p></>}
          {report.rencanaTindakLanjut && <><h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section5}</h2><p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-700">{report.rencanaTindakLanjut}</p></>}

          {report.attachments?.length > 0 && (
            <>
              <h2 className="mb-3 border-b border-gray-300 pb-2 text-base font-bold">{text.section6}</h2>
              <ul className="mb-6 space-y-1 text-sm">
                {report.attachments.map((url, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-gray-500">{i + 1}.</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-blue-600 underline">{url.split("/").pop() || url}</a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="text-center"><p className="mb-16 text-sm font-medium">{text.preparedBy}</p><div className="border-t border-gray-400 pt-2"><p className="text-sm font-medium">{orgName}</p><p className="text-xs text-gray-500">{text.csrExecutor}</p></div></div>
            <div className="text-center"><p className="mb-16 text-sm font-medium">{text.acknowledgedBy}</p><div className="border-t border-gray-400 pt-2"><p className="text-sm font-medium">CSR Hub Platform</p><p className="text-xs text-gray-500">{text.verifier}</p></div></div>
          </div>

          <div className="mt-8 border-t border-gray-300 pt-4 text-center text-xs text-gray-400">{text.footer}</div>
        </div>
      </div>
    </>
  );
}
