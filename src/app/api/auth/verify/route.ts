// =============================================================================
// src/app/api/auth/verify/route.ts
// API Route untuk memverifikasi kriptografi wallet Sui dan mengatur sesi cookie
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyPersonalMessageSignature } from "@mysten/sui/verify";
import { fromBase64 } from "@mysten/sui/utils";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { signature, bytes } = body;

    // 1. Validasi Input Dasar (Postman check)
    if (!signature || !bytes) {
      console.warn("[Auth/Verify] Missing payload:", {
        signature: !!signature,
        bytes: !!bytes,
      });
      return NextResponse.json(
        { success: false, error: "Missing signature or message bytes" },
        { status: 400 },
      );
    }

    // 2. Verifikasi Kriptografi (Sui-Native)
    // Fungsi ini akan me-recover Public Key dari signature.
    // Jika data diubah / dimanipulasi (tampered), proses ini akan melempar error.
    let publicKey;
    try {
      publicKey = await verifyPersonalMessageSignature(
        fromBase64(bytes), // Decode Base64 bytes kembali ke Uint8Array
        signature,
      );
    } catch (cryptoError: any) {
      console.error(
        "[Auth/Verify] Cryptography verification failed:",
        cryptoError.message,
      );
      return NextResponse.json(
        { success: false, error: "Invalid cryptographic signature." },
        { status: 401 }, // 401 Unauthorized karena identitas tidak valid
      );
    }

    // 3. Ekstrak Wallet Address dari Public Key yang sah
    const verifiedAddress = publicKey.toSuiAddress();
    console.log(
      `[Auth/Verify] Signature valid! Trusting wallet: ${verifiedAddress}`,
    );

    // 4. Terbitkan Session (Panggil fungsi fondasi dari sesi sebelumnya)
    await createSession(verifiedAddress);

    // 5. Kembalikan respons sukses ke klien
    return NextResponse.json(
      {
        success: true,
        address: verifiedAddress,
        message: "Wallet ownership verified and session created.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Catch-all untuk error parsing JSON atau internal server error
    console.error(
      "[Auth/Verify] Internal Server Error:",
      error.message || error,
    );

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during verification.",
      },
      { status: 500 },
    );
  }
}
