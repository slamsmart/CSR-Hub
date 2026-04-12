import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
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

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: file.type === "application/pdf" ? "raw" : "image",
      transformation: folder.includes("avatar")
        ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
        : undefined,
    });

    return successResponse({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes,
    }, undefined, 201);
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return errorResponse("Gagal mengunggah file", 500);
  }
}
