"use client";

import { useState, useEffect, useRef } from "react";
import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { Wallet, LogOut, ChevronDown, UserCircle } from "lucide-react";

export default function ConnectWallet() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. HYDRATION FIX: Pastikan komponen cuma dirender di client
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Jangan render apa-apa di server untuk mencegah hydration mismatch
  if (!mounted)
    return <div className="w-[140px] h-10 bg-muted animate-pulse rounded-xl" />;

  // STATE 1: BELUM TERKONEKSI
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

  // STATE 2: SUDAH TERKONEKSI (Tampilkan Dropdown)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 sm:gap-3 bg-card border border-border px-2 sm:px-3 py-1.5 rounded-xl hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
          <UserCircle size={20} />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-muted-foreground font-bold uppercase leading-none mb-0.5">
            Connected
          </p>
          <p className="text-xs font-mono font-bold leading-none">
            {formatAddress(account.address)}
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
              {formatAddress(account.address)}
            </p>
          </div>

          <button
            onClick={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
            className="w-full z-[999] flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-semibold"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
