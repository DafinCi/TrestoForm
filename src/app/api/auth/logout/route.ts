// =============================================================================
// src/app/api/auth/logout/route.ts
// Endpoint untuk menghapus cookie sesi (Logout)
// =============================================================================

import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";

export async function POST() {
  try {
    // Panggil fungsi pemusnahan cookie dari fondasi auth kita
    await deleteSession();

    return NextResponse.json(
      { success: true, message: "Logged out successfully. Cookie destroyed." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API/Logout] Internal Server Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to logout." },
      { status: 500 },
    );
  }
}
