"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";

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

const TYPE_LABEL: Record<string, string> = {
  BULANAN: "Laporan Bulanan",
  TRIWULAN: "Laporan Triwulan",
  KEUANGAN: "Laporan Keuangan",
  AKHIR: "Laporan Akhir Proyek",
};

export function ReportPrintView({ report, projectTitle, orgName, onClose }: ReportPrintViewProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Print styles injected inline */}
      <style>{`
        @media print {
          body > *:not(#report-print-root) { display: none !important; }
          #report-print-root { display: block !important; position: fixed; inset: 0; background: white; z-index: 9999; padding: 20mm; }
          .no-print { display: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      <div id="report-print-root" className="fixed inset-0 z-50 bg-white overflow-y-auto p-8">
        {/* Toolbar */}
        <div className="no-print flex items-center gap-3 mb-6 sticky top-0 bg-white py-3 border-b">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            ← Kembali
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            🖨️ Cetak / Unduh PDF
          </button>
          <span className="text-sm text-muted-foreground">
            Gunakan "Save as PDF" pada dialog cetak untuk menyimpan sebagai PDF
          </span>
        </div>

        {/* Report Content */}
        <div className="max-w-3xl mx-auto font-sans text-gray-900">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">C</div>
              <span className="text-2xl font-bold">CSR<span className="text-green-600">Hub</span></span>
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wide">{TYPE_LABEL[report.reportType] || report.reportType}</h1>
            <p className="text-sm text-gray-500 mt-1">Platform Marketplace CSR Nasional</p>
          </div>

          {/* Project Info */}
          <table className="w-full text-sm mb-6 border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium bg-gray-50 w-1/3">Nama Proyek</td>
                <td className="py-2 px-3">{projectTitle}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium bg-gray-50">Pelaksana</td>
                <td className="py-2 px-3">{orgName}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium bg-gray-50">Periode Laporan</td>
                <td className="py-2 px-3">{report.reportingPeriod}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 font-medium bg-gray-50">Jenis Laporan</td>
                <td className="py-2 px-3">{TYPE_LABEL[report.reportType]}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium bg-gray-50">Tanggal Laporan</td>
                <td className="py-2 px-3">
                  {new Date(report.submittedAt || report.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Progress Summary */}
          <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">I. Rekapitulasi Progres</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-300 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{report.progressFisik}%</p>
              <p className="text-xs text-gray-500 mt-1">Progres Fisik</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{report.progressKeuangan}%</p>
              <p className="text-xs text-gray-500 mt-1">Progres Keuangan</p>
            </div>
            <div className="border border-gray-300 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-gray-800">{formatRupiah(Number(report.realisasiAnggaran))}</p>
              <p className="text-xs text-gray-500 mt-1">Realisasi Anggaran</p>
            </div>
          </div>

          {/* Ringkasan */}
          <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">II. Ringkasan Kegiatan</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{report.summary}</p>

          {/* Pencapaian */}
          {report.pencapaian && (
            <>
              <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">III. Pencapaian & Dampak</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{report.pencapaian}</p>
            </>
          )}

          {/* Kendala */}
          {report.kendala && (
            <>
              <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">IV. Kendala & Solusi</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{report.kendala}</p>
            </>
          )}

          {/* Rencana Tindak Lanjut */}
          {report.rencanaTindakLanjut && (
            <>
              <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">V. Rencana Tindak Lanjut</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{report.rencanaTindakLanjut}</p>
            </>
          )}

          {/* Attachments */}
          {report.attachments?.length > 0 && (
            <>
              <h2 className="text-base font-bold border-b border-gray-300 pb-2 mb-3">VI. Lampiran</h2>
              <ul className="text-sm space-y-1 mb-6">
                {report.attachments.map((url, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-gray-500">{i + 1}.</span>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                      {url.split("/").pop() || url}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Signature */}
          <div className="mt-12 grid grid-cols-2 gap-12">
            <div className="text-center">
              <p className="text-sm font-medium mb-16">Dibuat oleh,</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm font-medium">{orgName}</p>
                <p className="text-xs text-gray-500">Pelaksana Program CSR</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-16">Diketahui oleh,</p>
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm font-medium">CSR Hub Platform</p>
                <p className="text-xs text-gray-500">Verifikator</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
            Dokumen ini diterbitkan oleh CSR Hub — Platform Marketplace CSR Nasional | csrhub.id
          </div>
        </div>
      </div>
    </>
  );
}
