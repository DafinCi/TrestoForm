"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { generateZodSchema } from "@/lib/form-engine/validator";

// Icons
import { ShieldAlert, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function FormPreview() {
  const { title, description, fields } = useFormBuilderStore();

  // State untuk nyimpen hasil dari API kita
  const [submissionResult, setSubmissionResult] = useState<{
    status: "idle" | "success" | "error";
    message?: string;
    blobId?: string;
  }>({ status: "idle" });

  const dynamicSchema = useMemo(() => generateZodSchema(fields), [fields]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (formData: any) => {
    setSubmissionResult({ status: "idle" });

    // Dummy Form ID (Nanti lu ganti pakai ID asli dari database kalau form udah disave)
    const formId = "form_" + Math.random().toString(36).slice(2, 9);

    try {
      // 1. Susun Payload sesuai SubmissionInputSchema di service lu
      const payload = {
        formId,
        data: formData,
        meta: {
          userAgent: window.navigator.userAgent, // Nambahin data meta beneran!
          source: "web-form-preview",
        },
      };

      console.log("🚀 Payload nembak ke API:", payload);

      // 2. Tembak API Route lu
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // 3. Handle Response dari API lu
      if (response.ok && result.success) {
        setSubmissionResult({
          status: "success",
          message: `Form successfully secured on Walrus Protocol!`,
          blobId: result.blobId,
        });
        reset(); // Bersihin input form setelah sukses
      } else {
        // Kalau error dari validasi API atau Walrus gagal
        throw new Error(result.error || "Failed to secure form data.");
      }
    } catch (error: any) {
      console.error("[FormPreview] Gagal submit:", error);
      setSubmissionResult({
        status: "error",
        message:
          error.message ||
          "An unexpected error occurred while sealing your data.",
      });
    }
  };

  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground bg-slate-50/50 dark:bg-slate-900/20 rounded-lg border border-dashed border-border/50">
        <p>Add fields to preview your form here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-950 p-8 rounded-xl shadow-sm border border-border">
      {/* Form Header */}
      <div className="mb-8 border-b border-border/50 pb-6">
        <h1 className="text-3xl font-righteous mb-2">
          {title || "Untitled Form"}
        </h1>
        {description && (
          <p className="text-muted-foreground font-inter">{description}</p>
        )}
      </div>

      {/* Tampilkan Notifikasi Sukses/Error di atas form */}
      {submissionResult.status === "success" && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3">
          <CheckCircle2
            className="text-emerald-500 mt-0.5 shrink-0"
            size={18}
          />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              {submissionResult.message}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-mono break-all">
              Blob ID: {submissionResult.blobId}
            </p>
          </div>
        </div>
      )}

      {submissionResult.status === "error" && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-destructive mt-0.5 shrink-0" size={18} />
          <p className="text-sm font-medium text-destructive">
            {submissionResult.message}
          </p>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => {
          const error = errors[field.id]?.message as string;

          return (
            <div key={field.id} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
                {field.isSensitive && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-sm">
                    <ShieldAlert size={10} /> Encrypted
                  </span>
                )}
              </label>

              {field.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {field.description}
                </p>
              )}

              {field.type === "textarea" ? (
                <textarea
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                />
              ) : field.type === "select" ? (
                <select
                  {...register(field.id)}
                  className="w-full p-2.5 rounded-md border border-input bg-transparent text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Select an option...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    field.type === "url"
                      ? "url"
                      : field.type === "file"
                        ? "file"
                        : "text"
                  }
                  {...register(field.id)}
                  placeholder={field.placeholder}
                  className="w-full p-2.5 rounded-md border border-input bg-transparent text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              )}

              {error && (
                <p className="text-xs text-destructive mt-1 font-medium">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <div className="pt-6 border-t border-border/50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Sealing Data on Walrus...
              </>
            ) : (
              <>
                Submit Decentralized Form <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
