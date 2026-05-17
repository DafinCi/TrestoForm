"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, PenTool, Eye, Save, Loader2, Rocket } from "lucide-react";
import { clientEnv } from "@/lib/env/client";

// ✨ PENGGUNAAN SUI SDK TERBARU (@mysten/sui & @mysten/dapp-kit v1.0+)
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import { useFormBuilderStore } from "@/store/form-builder-store";

const TREASURY_ADDRESS = clientEnv.treasuryAddress;
const PUBLISH_FEE_MIST = clientEnv.formPublishFeeMist;

export default function FormBuilderHeader() {
  const router = useRouter();
  const account = useCurrentAccount();

  // ✨ NAMA FUNGSI BARU DARI DAPP-KIT
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const { title, setTitle, fields, viewMode, setViewMode } =
    useFormBuilderStore();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!account) {
      alert("Harap connect wallet Sui terlebih dahulu!");
      return;
    }
    if (fields.length === 0) {
      alert("Form kosong! Tambahkan minimal 1 pertanyaan.");
      return;
    }

    setIsPublishing(true);

    try {
      // ✨ SINTAKS TRANSACTION TERBARU
      const tx = new Transaction();

      // Ambil 1 SUI dari gas fee untuk di-transfer
      const [coin] = tx.splitCoins(tx.gas, [PUBLISH_FEE_MIST]);

      // Di SDK baru, alamat penerima bisa langsung diisi string
      tx.transferObjects([coin], TREASURY_ADDRESS);

      signAndExecuteTransaction(
        { transaction: tx }, // ✨ Properti barunya cuma 'transaction', bukan 'transactionBlock'
        {
          onSuccess: async (result) => {
            console.log("Transaksi Sukses! Digest:", result.digest);

            // Tembak Server-Side kita buat upload Walrus (biar aman)
            const response = await fetch("/api/forms/publish", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: title || "Untitled Form",
                fields,
                creatorAddress: account.address,
                transactionDigest: result.digest,
              }),
            });

            const resData = await response.json();

            if (resData.success) {
              alert("Sukses! Form berhasil di-publish ke Walrus.");
              router.push(`/dashboard/forms/${resData.blobId}/success`);
            } else {
              throw new Error(resData.error || "Gagal upload ke Walrus");
            }
          },
          onError: (err) => {
            console.error("Gagal bayar:", err);
            alert("Pembayaran dibatalkan atau gagal.");
            setIsPublishing(false);
          },
        },
      );
    } catch (err) {
      console.error("Terjadi kesalahan sistem:", err);
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex z-100 flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link
          href="/dashboard/forms"
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-heading text-lg md:text-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 w-full sm:w-64 font-bold"
          placeholder="Untitled Form"
        />
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode("builder")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${viewMode === "builder" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <PenTool size={14} /> <span className="xs:inline">Builder</span>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${viewMode === "preview" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eye size={14} /> <span className="xs:inline">Preview</span>
          </button>
        </div>

        {/* Tombol Publish Baru */}
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Rocket size={16} />
          )}
          <span>{isPublishing ? "Publishing..." : "Publish (1 SUI)"}</span>
        </button>
      </div>
    </div>
  );
}
