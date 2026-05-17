import { NextRequest, NextResponse } from "next/server";

// ✨ PENGGUNAAN WALRUS SDK TERBARU
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { walrus } from "@mysten/walrus";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, fields, creatorAddress, transactionDigest } = body;

    if (!title || !fields || !creatorAddress || !transactionDigest) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    // 1. BUAT SIGNER DARI WALLET SERVER LU (Treasury / Admin)
    // Server butuh wallet karena mengupload Blob ke Walrus butuh SUI (dari wallet lu)
    // Pastikan lu pasang TREASURY_MNEMONIC di file .env lokal lu.
    const keypair = Ed25519Keypair.deriveKeypair(
      process.env.TREASURY_MNEMONIC!,
    );

    // 2. INIT SUI CLIENT DENGAN WALRUS EXTENSION
    const client = new SuiGrpcClient({
      network: "testnet",
      baseUrl: "https://fullnode.testnet.sui.io:443", // URL Fullnode Sui
    }).$extend(walrus());

    // 3. SIAPKAN DATA FORM (Convert JSON ke Blob/Uint8Array)
    const schemaData = {
      title,
      fields,
      creatorAddress,
      version: "1.0",
      createdAt: new Date().toISOString(),
    };
    const blobData = new TextEncoder().encode(JSON.stringify(schemaData));

    // 4. UPLOAD KE WALRUS PROTOCOL
    // Epochs: jumlah epoch data ini mau disimpan.
    const { blobId } = await client.walrus.writeBlob({
      blob: blobData,
      epochs: 2, // Buat hackathon, simpan 2 epoch udah cukup banget
      signer: keypair,
    });

    console.log("Success Upload to Walrus! Blob ID:", blobId);

    // [Opsional] 5. Simpan log Quota creator ke Database (Postgres/Redis)
    // misal: updateQuota(creatorAddress, 100);

    return NextResponse.json(
      {
        success: true,
        blobId: blobId,
        message: "Form successfully deployed to Walrus",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("[API/Walrus Upload] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to interact with Walrus",
      },
      { status: 500 },
    );
  }
}
