type UploadResult = {
  url: string;
  path: string;
  size?: number;
  contentType?: string;
};

const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "csrhub-assets";

function getSupabaseBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return url?.replace(/\/+$/, "");
}

function sanitizePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9/_-]+/g, "-").replace(/\/+/g, "/");
}

async function uploadToSupabaseStorage(file: File, folder: string): Promise<UploadResult> {
  const baseUrl = getSupabaseBaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!baseUrl || !serviceRoleKey) {
    throw new Error("Supabase Storage belum dikonfigurasi");
  }

  const timestamp = Date.now();
  const originalName = file.name || "upload";
  const safeName = sanitizePathSegment(originalName.replace(/\s+/g, "-"));
  const safeFolder = sanitizePathSegment(folder || "csrhub/general").replace(/^\/+|\/+$/g, "");
  const objectPath = `${safeFolder}/${timestamp}-${safeName}`;

  const uploadUrl = `${baseUrl}/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;
  const publicUrl = `${baseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "x-upsert": "true",
      "Content-Type": file.type || "application/octet-stream",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Supabase upload gagal: ${response.status} ${errorText}`);
  }

  return {
    url: publicUrl,
    path: objectPath,
    size: file.size,
    contentType: file.type || undefined,
  };
}

export async function uploadFileToStorage(file: File, folder: string) {
  return uploadToSupabaseStorage(file, folder);
}
