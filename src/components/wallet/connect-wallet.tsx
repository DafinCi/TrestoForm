"use client";

import React from "react";
import { Wallet } from "lucide-react";

export default function ConnectWallet() {
  return (
    <button className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm active:scale-95">
      <Wallet size={16} />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </button>
  );
}
