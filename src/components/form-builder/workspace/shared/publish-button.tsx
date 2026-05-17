"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { clientEnv } from "@/lib/env/client";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

import { useBuilderSchemaStore } from "@/store/builder-store";
const {
  treasuryAddress: TREASURY_ADDRESS,
  formPublishFeeMist: PUBLISH_FEE_MIST,
} = clientEnv;

export default function PublishButton() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [isPublishing, setIsPublishing] = useState(false);

  // Selector: Hanya langganan ke jumlah field (untuk validasi disabled tombol)
  const fieldCount = useBuilderSchemaStore((s) => s.fields.length);

  const handlePublish = async () => {
    if (!account) {
      toast.error("Wallet belum terkoneksi!", {
        description: "Harap hubungkan wallet Sui terlebih dahulu.",
      });
      return;
    }
    if (fieldCount === 0) {
      toast.warning("Form masih kosong!", {
        description: "Tambahkan minimal 1 pertanyaan sebelum di-publish.",
      });
      return;
    }

    setIsPublishing(true);
    // Simpan id toast agar bisa diupdate secara dinamis (Loading -> Success/Error)
    const toastId = toast.loading("Menunggu persetujuan wallet...");

    try {
      const tx = new Transaction();
      const feeMist = parseInt(String(PUBLISH_FEE_MIST), 10);
      const [coin] = tx.splitCoins(tx.gas, [feeMist]);
      tx.transferObjects([coin], TREASURY_ADDRESS);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            // Update toast saat transaksi Sui berhasil
            toast.loading("Sui berhasil dibayar! Mengunggah ke Walrus...", {
              id: toastId,
            });

            // Trik Rahasia: Ambil seluruh store (title + fields) HANYA saat diperlukan
            const schemaState = useBuilderSchemaStore.getState();

            const response = await fetch("/api/forms/publish", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: schemaState.title || "Untitled Form",
                fields: schemaState.fields,
                creatorAddress: account.address,
                transactionDigest: result.digest,
              }),
            });

            const resData = await response.json();

            if (resData.success) {
              toast.success("Form berhasil di-publish!", {
                id: toastId,
                description: "Form data aman tersimpan di Walrus Network.",
              });
              router.push(`/dashboard/forms/${resData.blobId}/success`);
            } else {
              throw new Error(resData.error || "Gagal mengunggah ke Walrus");
            }
          },
          onError: (err) => {
            console.error("Gagal bayar:", err);
            toast.error("Transaksi Dibatalkan", {
              id: toastId,
              description: "Pembayaran ditolak atau dibatalkan oleh user.",
            });
            setIsPublishing(false);
          },
        },
      );
    } catch (err) {
      console.error("Kesalahan sistem:", err);
      toast.error("Terjadi Kesalahan", {
        id: toastId,
        description: "Gagal membuat transaksi. Silakan coba lagi.",
      });
      setIsPublishing(false);
    }
  };

  return (
    <button
      onClick={handlePublish}
      disabled={isPublishing || fieldCount === 0}
      className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
    >
      {isPublishing ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Rocket size={16} />
      )}
      <span>{isPublishing ? "Publishing..." : "Publish (1 SUI)"}</span>
    </button>
  );
}
