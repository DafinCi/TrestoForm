"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";

// Struktur data tipe pertanyaan
interface Field {
  id: string;
  type: "text" | "textarea" | "file";
  label: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
}

interface PublicFormProps {
  formId: string;
  fields: Field[];
}

export default function PublicForm({ formId, fields }: PublicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Menyimpan input dari responden
  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Simulasi proses submit ke blockchain / decentralized storage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulasi jeda enkripsi dan upload ke Walrus selama 2.5 detik
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsSubmitting(false);
    setIsSuccess(true);
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
            Transaction Hash
          </p>
          <p className="font-mono text-sm font-bold text-primary">
            0x89a3...9b2c
          </p>
        </div>
      </div>
    );
  }

  // Tampilan Form Input
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="group p-5 -mx-5 rounded-2xl hover:bg-muted/30 transition-colors duration-300"
        >
          <label className="block mb-2 text-base font-semibold text-foreground">
            {index + 1}. {field.label}
            {field.required && <span className="text-red-500 ml-1.5">*</span>}
          </label>

          {field.description && (
            <p className="text-xs text-muted-foreground mb-4">
              {field.description}
            </p>
          )}

          {field.type === "text" && (
            <input
              type="text"
              required={field.required}
              placeholder={field.placeholder}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm md:text-base"
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              required={field.required}
              placeholder={field.placeholder}
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y custom-scrollbar text-sm md:text-base"
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}

          {field.type === "file" && (
            <div className="relative border-2 border-dashed border-border bg-background rounded-xl p-8 hover:bg-muted/20 transition-all text-center group-hover:border-primary/50">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => handleChange(field.id, e.target.files?.[0])}
              />
              <UploadCloud
                size={32}
                className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors"
              />
              <p className="text-sm font-medium text-foreground">
                Click or drag file to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Files up to 50MB will be encrypted via Seal
              </p>
              {formData[field.id] && (
                <p className="mt-4 text-sm text-primary font-bold bg-primary/10 py-2 px-4 rounded-lg inline-block truncate max-w-full">
                  File: {formData[field.id].name}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Tombol Submit dengan efek Loading */}
      <div className="pt-8 border-t border-border mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative overflow-hidden group w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Encrypting Payload...</span>
            </div>
          ) : (
            <span className="relative z-10 text-lg">Submit to Walrus</span>
          )}
        </button>
      </div>
    </form>
  );
}
