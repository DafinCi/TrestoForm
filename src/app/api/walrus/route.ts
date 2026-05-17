import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/walrus/upload";

export const maxDuration = 60; // Izinkan proses sampai 60 detik (buat video besar)

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert Web File object ke Uint8Array agar diterima oleh SDK lu
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Panggil SDK Walrus lu (Server-side aman!)
    const result = await uploadFile(uint8Array, {
      epochs: 3, // Atau biarkan kosong agar pakai default di SDK lu
    });

    return NextResponse.json({
      success: true,
      blobId: result.blobId,
      uploadedAt: result.uploadedAt,
    });
  } catch (error: any) {
    console.error("[Walrus API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload to Walrus" },
      { status: 500 },
    );
  }
}
