import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "public_logo", ...slug);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    return new NextResponse("Not a file", { status: 400 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
