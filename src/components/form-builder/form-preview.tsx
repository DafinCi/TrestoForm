"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { generateZodSchema } from "@/lib/form-engine/validator";

// Icons
import { ShieldAlert, Send } from "lucide-react";

export default function FormPreview() {
  const { title, description, fields } = useFormBuilderStore();

  // Generate Zod schema on-the-fly setiap kali fields berubah
  const dynamicSchema = useMemo(() => generateZodSchema(fields), [fields]);

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: any) => {
    // Di sini nanti kita sambungin ke Walrus & Seal!
    console.log("🚀 Payload siap dikirim ke Walrus:", data);

    // Simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Form valid! Cek console untuk lihat JSON payload-nya.");
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

      {/* Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => {
          const error = errors[field.id]?.message as string;

          return (
            <div key={field.id} className="space-y-2">
              {/* Label & Privacy Indicator */}
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
                {field.isSensitive && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-sm">
                    <ShieldAlert size={10} /> Encrypted
                  </span>
                )}
              </label>

              {/* Description */}
              {field.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {field.description}
                </p>
              )}

              {/* Dynamic Inputs Render */}
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

              {/* Error Message */}
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
              "Securing payload..."
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
