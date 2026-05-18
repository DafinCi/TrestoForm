// =============================================================================
// src/lib/auth/session.ts
// Fondasi Session Auth Web3 - Minimalist & Secure
// =============================================================================

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Gunakan environment variable untuk secret di production.
// Fallback ini CUMA buat mempermudah local development.
const SECRET_KEY =
  process.env.SESSION_SECRET || "super_secret_key_for_local_dev_min_32_chars";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

const COOKIE_NAME = "sui_auth_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 Hari

export interface SessionPayload {
  address: string;
  expiresAt: string;
}

/**
 * 1. Menerbitkan session (JWT) dan menanamkannya ke dalam HTTP-Only Cookie.
 * Dipanggil oleh API Route setelah verifikasi signature sukses.
 */
export async function createSession(address: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const sessionToken = await new SignJWT({
    address,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  // TAMBAHKAN AWAIT DI SINI
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { success: true };
}

/**
 * 2. Memverifikasi session token dari Cookie.
 * Dipanggil oleh Middleware atau API Routes yang butuh proteksi.
 */
export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ["HS256"],
    });

    // Validasi tambahan untuk memastikan struktur payload sesuai
    if (!payload.address) {
      return null;
    }

    return payload as unknown as SessionPayload;
  } catch (error) {
    // Tangkap error jika token expired atau invalid signature
    console.error("[Session] Verification failed:", error);
    return null;
  }
}

/**
 * 3. Menghapus session (Logout).
 * Dipanggil oleh API Route logout.
 */
export async function deleteSession() {
  const cookieStore = await cookies();

  // Menghapus cookie dengan menimpa nilai dan set masa berlaku ke masa lalu
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
