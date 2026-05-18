"use client";

import React, { useEffect } from "react";
import { UploadCloud, Loader2, AlertCircle, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

// Types
import type { FormField } from "@/types/field";
import type { FormSettings } from "@/types/form";

// Stores & Hooks
import { useSubmissionStore } from "@/store/submission-store";
import { useSubmissions } from "@/hooks/use-submissions";
import { useAuthStore } from "@/store/auth-store";

interface PublicFormProps {
  formId: string;
  fields: FormField[];
  settings: FormSettings; // Tambahan: Untuk cek allowAnonymous
}

export default function PublicForm({
  formId,
  fields,
  settings,
}: PublicFormProps) {
  const router = useRouter();

  // 1. Tarik state dan actions dari Zustand Store
  const { answers, errors, setAnswer, setFieldError, initializeForm } =
    useSubmissionStore();
  const { authStatus } = useAuthStore();

  // 2. Tarik fungsi utama dari Hook kita
  const { submitForm, isSubmitting } = useSubmissions();

  // Inisialisasi form di dalam store saat komponen di-mount
  useEffect(() => {
    initializeForm(formId);
  }, [formId, initializeForm]);

  // Handle Submit Manual (menggantikan RHF handleSubmit)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana: Cek required fields
    let hasError = false;
    fields.forEach((field) => {
      const answer = answers[field.id];
      if (field.required && (!answer || answer === "")) {
        setFieldError(field.id, "This field is required");
        hasError = true;
      }
    });

    if (hasError) {
      // Scroll otomatis ke error pertama (opsional, tapi bagus buat UX)
      return;
    }

    // Eksekusi hook
    try {
      const result = await submitForm(settings.allowAnonymous);

      // Jika berhasil dan dapat blobId, redirect!
      if (result && result.data?.blobId) {
        router.push(
          `/forms/${formId}/success?submissionId=${result.data.blobId}`,
        );
      }
    } catch (error) {
      // Error handling udah diurus oleh toast di dalam hook useSubmissions
      console.error("Submission failed:", error);
    }
  };

  // Cek apakah user dilarang submit karena belum konek wallet
  const isWalletRequired =
    !settings.allowAnonymous && authStatus !== "authenticated";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {fields.map((field, index) => {
        // Ambil value dan error langsung dari global store kita (O(1) lookup)
        const value = answers[field.id] ?? "";
        const fieldError = errors[field.id];
        const hasError = !!fieldError;

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

            {/* Deskripsi */}
            {field.description && (
              <p className="text-xs text-muted-foreground mb-4">
                {field.description}
              </p>
            )}

            {/* Render Input */}
            <div className="relative">
              {field.type === "text" ||
              field.type === "email" ||
              field.type === "number" ? (
                <input
                  type={field.type}
                  value={value as string | number}
                  onChange={(e) => setAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder || "Your answer here..."}
                  className={`w-full bg-background border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all text-sm md:text-base ${
                    hasError
                      ? "border-destructive focus:ring-destructive/50"
                      : "border-border focus:ring-primary/50 focus:border-primary"
                  }`}
                />
              ) : field.type === "textarea" ? (
                <textarea
                  value={value as string}
                  onChange={(e) => setAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder || "Your detailed answer..."}
                  rows={4}
                  className={`w-full bg-background border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all resize-y custom-scrollbar text-sm md:text-base ${
                    hasError
                      ? "border-destructive focus:ring-destructive/50"
                      : "border-border focus:ring-primary/50 focus:border-primary"
                  }`}
                />
              ) : field.type === "file" ? (
                <div
                  className={`relative border-2 border-dashed bg-background rounded-xl p-8 hover:bg-muted/20 transition-all text-center group-hover:border-primary/50 ${
                    hasError ? "border-destructive" : "border-border"
                  }`}
                >
                  {/* TODO: Nanti ini diganti dengan custom File Uploader component 
                      yang nge-hit endpoint Walrus dulu, baru nge-set 'FileReference' ke setAnswer() */}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      // Mocking untuk UI sementara
                      const file = e.target.files?.[0];
                      if (file) setAnswer(field.id, file.name);
                    }}
                  />
                  <UploadCloud
                    size={32}
                    className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                  <p className="text-sm font-medium text-foreground">
                    Click or drag file to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Directly pushed to Walrus Network
                  </p>
                </div>
              ) : (
                // Fallback
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => setAnswer(field.id, e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5"
                />
              )}
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="flex items-center gap-1.5 mt-2 text-destructive animate-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span className="text-xs font-medium">{fieldError}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Warning Web3 Auth (Jika Form Mewajibkan Wallet) */}
      {isWalletRequired && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3 mt-8">
          <Wallet className="text-orange-500 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-orange-500">
              Wallet Required
            </h4>
            <p className="text-xs text-orange-500/80 mt-1">
              The creator of this form requires you to connect your Sui Wallet
              to verify your identity before submitting.
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-8 border-t border-border mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || isWalletRequired}
          className="relative overflow-hidden group w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:opacity-70"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Committing to Walrus...</span>
            </div>
          ) : (
            <span className="relative z-10 text-lg">Submit Securely</span>
          )}
        </button>
      </div>
    </form>
  );
}
