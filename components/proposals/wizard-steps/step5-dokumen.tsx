"use client";

import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateFileUpload } from "@/lib/security";
import toast from "react-hot-toast";
import { ProposalWizardData } from "../proposal-wizard";

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  category: string;
  preview?: string;
  uploaded?: boolean;
  url?: string;
  error?: string;
}

const DOCUMENT_TYPES = [
  { value: "PROPOSAL_UTAMA", label: "Proposal Lengkap", required: true, description: "Dokumen proposal utama (PDF/Word)" },
  { value: "RAB", label: "RAB / Anggaran", required: true, description: "Rencana Anggaran Biaya detail" },
  { value: "PROFIL_ORGANISASI", label: "Profil Organisasi", required: true, description: "Profil/company profile organisasi" },
  { value: "FOTO_LOKASI", label: "Foto Lokasi/Kondisi", required: false, description: "Foto kondisi/lokasi sasaran program" },
  { value: "LAINNYA", label: "Dokumen Lainnya", required: false, description: "Dokumen pendukung lainnya" },
];

export function ProposalStep5() {
  const { setValue, watch } = useFormContext<ProposalWizardData>();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const attachments = watch("attachments") || [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const validation = validateFileUpload(file, true, 10);
      return {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        category: "LAINNYA",
        error: validation.valid ? undefined : validation.error,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  function removeFile(index: number) {
    const removedFile = files[index];
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (removedFile?.url) {
      setValue(
        "attachments",
        attachments.filter((item) => item.fileUrl !== removedFile.url),
        { shouldDirty: true }
      );
    }
  }

  function updateCategory(index: number, category: string) {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, category } : f))
    );
  }

  async function uploadFile(index: number) {
    const uploadedFile = files[index];
    if (!uploadedFile || uploadedFile.error) return;

    setUploading(String(index));
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("category", uploadedFile.category);
      formData.append("type", "PROPOSAL_ATTACHMENT");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.data?.url;
        if (!uploadedUrl) throw new Error("Upload gagal");

        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, uploaded: true, url: uploadedUrl } : f
          )
        );
        setValue(
          "attachments",
          [
            ...attachments.filter((item) => item.fileUrl !== uploadedUrl),
            {
              fileName: uploadedFile.name,
              fileUrl: uploadedUrl,
              type: uploadedFile.category,
              mimeType: uploadedFile.type,
              fileSize: uploadedFile.size,
            },
          ],
          { shouldDirty: true }
        );
        toast.success("File berhasil diunggah");
      } else {
        throw new Error("Upload gagal");
      }
    } catch {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, error: "Gagal mengunggah file" } : f
        )
      );
      toast.error("Gagal mengunggah file");
    } finally {
      setUploading(null);
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const requiredDocs = DOCUMENT_TYPES.filter((d) => d.required);
  const uploadedCategories = files.filter((f) => !f.error).map((f) => f.category);
  const missingRequired = requiredDocs.filter((d) => !uploadedCategories.includes(d.value));

  return (
    <div className="space-y-6">
      {/* Required Documents Guide */}
      <div>
        <h3 className="text-sm font-medium mb-3">Dokumen yang Dibutuhkan</h3>
        {attachments.length > 0 && (
          <p className="mb-3 text-xs text-muted-foreground">
            {attachments.length} dokumen sudah tersimpan pada draft proposal ini.
          </p>
        )}
        <div className="grid gap-2">
          {DOCUMENT_TYPES.map((docType) => {
            const isUploaded = uploadedCategories.includes(docType.value);
            return (
              <div
                key={docType.value}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3 border",
                  isUploaded ? "border-green-200 bg-green-50" : "border-border bg-muted/30"
                )}
              >
                {isUploaded ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <div className={cn("h-4 w-4 rounded-full border-2 flex-shrink-0", docType.required ? "border-orange-400" : "border-gray-300")} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {docType.label}
                    {docType.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{docType.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
          isDragActive ? "border-brand-400 bg-brand-50" : "border-border hover:border-brand-300 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn("h-10 w-10 mx-auto mb-3", isDragActive ? "text-brand-500" : "text-muted-foreground")} />
        <p className="font-medium text-sm">
          {isDragActive ? "Lepaskan file di sini..." : "Klik atau seret file ke sini"}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          PDF, Word, PNG, JPG — Maksimal 10MB per file
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, index) => (
            <div
              key={index}
              className={cn(
                "rounded-xl border p-3 flex items-center gap-3",
                f.error ? "border-red-200 bg-red-50" : f.uploaded ? "border-green-200 bg-green-50" : "border-border"
              )}
            >
              {f.type.startsWith("image/") ? (
                <ImageIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
              ) : (
                <FileText className="h-8 w-8 text-brand-500 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{formatSize(f.size)}</span>
                  {f.error && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {f.error}
                    </span>
                  )}
                  {f.uploaded && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Berhasil diunggah
                    </span>
                  )}
                </div>
              </div>

              {!f.error && !f.uploaded && (
                <select
                  className="text-xs rounded-lg border border-input bg-background px-2 py-1.5 h-8 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={f.category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                >
                  {DOCUMENT_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-2">
                {!f.error && !f.uploaded && (
                  <Button
                    type="button"
                    size="sm"
                    variant="brand"
                    className="h-8 text-xs"
                    onClick={() => uploadFile(index)}
                    loading={uploading === String(index)}
                  >
                    Upload
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {missingRequired.length > 0 && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
          <p className="text-sm font-medium text-orange-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Dokumen wajib yang belum diupload:
          </p>
          <ul className="text-xs text-orange-600 mt-1.5 space-y-1 ml-6">
            {missingRequired.map((d) => <li key={d.value}>• {d.label}</li>)}
          </ul>
          <p className="text-xs text-orange-600 mt-2">
            Proposal masih bisa dikirim, namun dokumen wajib harus dilengkapi dalam 3 hari.
          </p>
        </div>
      )}
    </div>
  );
}
