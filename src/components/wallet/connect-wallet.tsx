"use client";

import { useState, useEffect, useRef } from "react";
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
  useSignPersonalMessage,
} from "@mysten/dapp-kit";
import {
  Wallet,
  LogOut,
  ChevronDown,
  UserCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { b64js } from "@mysten/sui/utils"; // Utilitas bawaan untuk konversi teks ke format bytes base64

export default function ConnectWallet() {
  const account = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  // Ambil state dan actions dari authStore kita
  const { authStatus, userAddress, verifySignature, checkSession, logout } =
    useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. HYDRATION & INITIAL SESSION CHECK
  useEffect(() => {
    setMounted(true);
    // Jalankan pengecekan cookie session saat aplikasi pertama kali dimuat
    checkSession();
  }, [checkSession]);

  // 2. CLICK-OUTSIDE FIX: Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format address: 0x1234...5678
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Handler untuk mengurus klik tombol "Verify Identity" secara eksplisit
  const handleVerifyIdentity = async () => {
    if (!account) return;

    try {
      const messageText = `Sign this message to verify your wallet ownership.\n\nWallet: ${account.address}\nTimestamp: ${Date.now()}`;

      // Ubah teks biasa menjadi Uint8Array menggunakan TextEncoder
      const messageBytes = new TextEncoder().encode(messageText);

      // Trigger pop-up ekstensi wallet untuk meminta tanda tangan kriptografi
      const signResult = await signPersonalMessage({
        message: messageBytes,
      });

      // Kirim hasil signature dan bytes (Base64) ke server melalui Zustand store
      await verifySignature(signResult.signature, signResult.bytes);
    } catch (error) {
      console.error("[ConnectWallet] Verification canceled or failed:", error);
    }
  };

  // Handler untuk sinkronisasi logout wallet & hancurkan cookie server
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout(); // Hancurkan cookie di server & reset state store
    disconnectWallet(); // Putuskan koneksi dari ekstensi wallet dApp kit
  };

  // Jangan render apa-apa di server untuk mencegah hydration mismatch
  if (!mounted)
    return <div className="w-[140px] h-10 bg-muted animate-pulse rounded-xl" />;

  // =============================================================================
  // KONDISI 1: Belum Connect Wallet (State Terbawah)
  // =============================================================================
  if (!account) {
    return (
      <ConnectModal
        trigger={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 hover:scale-[0.98] active:scale-95 transition-all shadow-lg shadow-primary/20">
            <Wallet size={16} />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </button>
        }
      />
    );
  }

  // =============================================================================
  // KONDISI 2: Loading State (Checking session lama atau sedang Verifying)
  // =============================================================================
  if (authStatus === "checking" || authStatus === "authenticating") {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed border border-border"
      >
        <Loader2 size={16} className="animate-spin text-primary" />
        <span>
          {authStatus === "checking" ? "Checking Sesi..." : "Verifying..."}
        </span>
      </button>
    );
  }

  // =============================================================================
  // KONDISI 3: Wallet Konek, Tapi BELUM Lolos Verifikasi Kriptografi (Unauthenticated)
  // Ini implementasi UX "Manual Sign" eksplisit demi membangun Trust
  // =============================================================================
  if (authStatus === "unauthenticated" || !userAddress) {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-300">
        <button
          onClick={handleVerifyIdentity}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:scale-[0.98] active:scale-95 transition-all"
        >
          <ShieldCheck size={16} />
          <span>Verify Identity</span>
        </button>

        {/* Tombol darurat buat disconnect kalau user berubah pikiran tanpa jadi verifikasi */}
        <button
          onClick={() => disconnectWallet()}
          className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-xl transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  // =============================================================================
  // KONDISI 4: Dompet Konek & Sesi Cookie Sah di Server (Authenticated)
  // =============================================================================
  return (
    <div className="relative animate-in fade-in duration-300" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 sm:gap-3 bg-card border border-border px-2 sm:px-3 py-1.5 rounded-xl hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <div className="w-7 h-7 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 shrink-0">
          <UserCircle size={20} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-green-500 font-bold uppercase leading-none mb-0.5 tracking-wider">
            Verified
          </p>
          <p className="text-xs font-mono font-bold leading-none text-card-foreground">
            {formatAddress(userAddress)}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 hidden sm:block ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN MENU */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="px-4 py-3 border-b border-border/50 mb-1 sm:hidden">
            <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
              Address
            </p>
            <p className="text-xs font-mono font-bold">
              {formatAddress(userAddress)}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-semibold"
          >
            <LogOut size={16} />
            Disconnect & Logout
          </button>
        </div>
      )}
    </div>
  );
}
