// =============================================================================
// src/app/api/auth/session/route.ts
// Endpoint untuk mengecek status sesi aktif (validasi cookie HTTP-Only)
// =============================================================================

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await verifySession();

    // Jika cookie tidak ada, expired, atau signature tidak valid
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No active or valid session found." },
        { status: 401 },
      );
    }

    // Jika valid, kembalikan address untuk meng-hydrate state Zustand
    return NextResponse.json(
      { success: true, address: session.address },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API/Session] Internal Server Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during session check." },
      { status: 500 },
    );
  }
}
