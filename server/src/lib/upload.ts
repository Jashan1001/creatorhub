// ─── Cloudinary upload helper ─────────────────────────────────────────────────
// Uses the Cloudinary REST API directly — no SDK needed.
// Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
//
// Usage:
//   import { uploadAvatar } from "../lib/upload.js";
//   const url = await uploadAvatar(base64DataUri, userId);

import crypto from "crypto";
import logger from "./logger.js";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function cloudinaryEnabled(): boolean {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

// Generate Cloudinary signature for signed uploads
function sign(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto
    .createHash("sha256")
    .update(sorted + API_SECRET)
    .digest("hex");
}

export async function uploadAvatar(
  base64DataUri: string,
  userId: string
): Promise<string> {
  if (!cloudinaryEnabled()) {
    logger.warn("Cloudinary not configured — CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET missing");
    throw new Error("File upload not configured");
  }

  const timestamp  = String(Math.floor(Date.now() / 1000));
  const publicId   = `creatorforge/avatars/${userId}`;
  const folder     = "creatorforge/avatars";

  const params: Record<string, string> = {
    folder,
    overwrite:    "true",
    public_id:    publicId,
    timestamp,
    transformation: "w_200,h_200,c_fill,g_face,q_auto,f_webp",
  };

  const signature = sign(params);

  const formData = new FormData();
  formData.append("file",           base64DataUri);
  formData.append("api_key",        API_KEY!);
  formData.append("timestamp",      timestamp);
  formData.append("signature",      signature);
  formData.append("folder",         folder);
  formData.append("overwrite",      "true");
  formData.append("public_id",      publicId);
  formData.append("transformation", "w_200,h_200,c_fill,g_face,q_auto,f_webp");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloudinary upload failed ${res.status}: ${body}`);
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}