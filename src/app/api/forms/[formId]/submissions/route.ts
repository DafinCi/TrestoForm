// =============================================================================
// src/app/api/forms/[formId]/submissions/route.ts
//
// Endpoint Endpoint Utama untuk Form Submission.
// Menerima payload JSON dari frontend, memanggil service untuk validasi & upload
// ke Walrus, dan mengembalikan `blobId` sebagai resi keberhasilan.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/services/submission.service";
import { WalrusError } from "@/lib/walrus/schema";

interface RouteContext {
  params: {
    formId: string;
  };
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { formId } = context.params;

    if (!formId) {
      return NextResponse.json(
        { error: "Parameter formId tidak ditemukan di URL." },
        { status: 400 },
      );
    }

    // 1. Parse JSON body dari request
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Format body bukan JSON yang valid." },
        { status: 400 },
      );
    }

    // 2. Pastikan formId di URL cocok dengan formId di payload (keamanan dasar)
    if (body.formId && body.formId !== formId) {
      return NextResponse.json(
        { error: "formId di URL tidak cocok dengan payload." },
        { status: 400 },
      );
    }

    // Paksa formId di payload agar sesuai dengan URL
    const payloadToProcess = { ...body, formId };

    // 3. Delegasikan ke service layer (Validation + Walrus Upload + DB Save)
    const result = await createSubmission(payloadToProcess);

    // 4. Kembalikan response sukses (blobId dan timestamp)
    return NextResponse.json(
      {
        success: true,
        message: "Submission berhasil diunggah ke jaringan Walrus.",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/forms/[formId]/submissions] Error:", error);

    // Penanganan error spesifik dari Walrus SDK (jika ada error timeout/relay)
    if (error instanceof WalrusError) {
      return NextResponse.json(
        {
          error: "Gagal mengunggah ke penyimpanan desentralisasi Walrus.",
          details: error.message,
          code: error.code,
        },
        { status: 502 }, // 502 Bad Gateway karena ini error dari upstream service (Walrus)
      );
    }

    // Penanganan error validasi Zod dari service (dilempar sebagai instance Error biasa dengan pesan spesifik)
    if (
      error instanceof Error &&
      error.message.includes("Invalid submission payload")
    ) {
      return NextResponse.json(
        { error: "Validasi payload gagal.", details: error.message },
        { status: 400 },
      );
    }

    // Fallback error umum
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server saat memproses form." },
      { status: 500 },
    );
  }
}
