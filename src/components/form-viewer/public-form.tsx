"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import type { FormField } from "@/types/field";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

interface PublicFormProps {
  formId: string;
  fields: FormField[];
}

export default function PublicForm({ formId, fields }: PublicFormProps) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");

  // Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fungsi yang dieksekusi saat form valid dan di-submit
  const onSubmit = async (data: any) => {
    try {
      const payload = { formId, data };

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal submit form");
      }

      // REDIRECT OTOMATIS KE HALAMAN SUCCESS INI
      router.push(`/forms/${formId}/success?submissionId=${result.blobId}`);
    } catch (error) {
      console.error(error);
      alert("Error submitting form. Please check your connection.");
    }
  };

  // Tampilan Sukses (Success State)
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold mb-2">
          Submission Securely Stored
        </h2>
        <p className="text-muted-foreground max-w-sm">
          Your response has been encrypted and successfully committed to the
          Walrus decentralized network.
        </p>
        <div className="mt-8 bg-muted/50 px-6 py-3 rounded-xl border border-border inline-block">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
            Reference ID
          </p>
          <p className="font-mono text-sm font-bold text-primary">{txHash}</p>
        </div>
      </div>
    );
  }

  // Tampilan Form Input dengan React Hook Form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => {
        // Cek apakah field ini error (misal: kosong padahal required)
        const hasError = !!errors[field.id];

        return (
          <div
            key={field.id}
            className={`group p-5 -mx-5 rounded-2xl transition-colors duration-300 ${
              hasError ? "bg-destructive/5" : "hover:bg-muted/30"
            }`}
          >
            {/* Label Form */}
            <label className="block mb-2 text-base font-semibold text-foreground">
              {index + 1}. {field.label}
              {field.required && (
                <span className="text-destructive ml-1.5">*</span>
              )}
            </label>

            {/* Deskripsi Tambahan */}
            {field.description && (
              <p className="text-xs text-muted-foreground mb-4">
                {field.description}
              </p>
            )}

            {/* Render Input Sesuai Tipe */}
            <div className="relative">
              {field.type === "text" ||
              field.type === "email" ||
              field.type === "number" ? (
                <input
                  type={field.type}
                  placeholder={field.placeholder || "Your answer here..."}
                  className={`w-full bg-background border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                    hasError
                      ? "border-destructive focus:ring-destructive/50"
                      : "border-border focus:ring-primary/50 focus:border-primary"
                  }`}
                  {...register(field.id, {
                    required: field.required ? "This field is required" : false,
                  })}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder || "Your detailed answer..."}
                  rows={4}
                  className={`w-full bg-background border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all resize-y custom-scrollbar text-sm md:text-base ${
                    hasError
                      ? "border-destructive focus:ring-destructive/50"
                      : "border-border focus:ring-primary/50 focus:border-primary"
                  }`}
                  {...register(field.id, {
                    required: field.required ? "This field is required" : false,
                  })}
                />
              ) : field.type === "file" ? (
                // Untuk file upload, kita pakai register biasa dulu.
                // Nanti pas submit, objek filenya bisa lu lempar ke Walrus/Seal
                <div
                  className={`relative border-2 border-dashed bg-background rounded-xl p-8 hover:bg-muted/20 transition-all text-center group-hover:border-primary/50 ${hasError ? "border-destructive" : "border-border"}`}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    {...register(field.id, {
                      required: field.required ? "Please upload a file" : false,
                    })}
                  />
                  <UploadCloud
                    size={32}
                    className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <p className="text-sm font-medium text-foreground">
                    Click or drag file to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Files will be encrypted via Seal
                  </p>
                </div>
              ) : (
                // Fallback untuk tipe lain jika belum disupport
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5"
                  {...register(field.id, { required: field.required })}
                />
              )}
            </div>

            {/* Pesan Error (Otomatis dari React Hook Form) */}
            {hasError && (
              <div className="flex items-center gap-1.5 mt-2 text-destructive animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span className="text-xs font-medium">
                  {(errors[field.id]?.message as string) ||
                    "This field is required"}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Tombol Submit */}
      <div className="pt-8 border-t border-border mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative overflow-hidden group w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Encrypting & Submitting...</span>
            </div>
          ) : (
            <span className="relative z-10 text-lg">Submit Securely</span>
          )}
        </button>
      </div>
    </form>
  );
}
