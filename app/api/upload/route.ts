import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { uploadFileToStorage } from "@/lib/upload-storage";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const MAX_SIZE_MB = 10;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errorResponse("Tidak terautentikasi", 401);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "csrhub/general";

    if (!file) return errorResponse("File tidak ditemukan", 400);
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse("Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau PDF.", 400);
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return errorResponse(`Ukuran file maksimal ${MAX_SIZE_MB}MB`, 400);
    }

    const result = await uploadFileToStorage(file, folder);

    return successResponse(result, undefined, 201);
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return errorResponse("Gagal mengunggah file", 500);
  }
}
