"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Edit3,
  Share2,
  ShieldCheck,
  Globe,
  FileCode2,
  Box,
} from "lucide-react";

interface FormCardProps {
  id: string;
  title: string;
  status: "Active" | "Draft" | "Encrypted";
  responses: number;
  lastModified: string;
  blobId?: string; // Web3 Element
}

export default function FormCard({
  id,
  title,
  status,
  responses,
  lastModified,
  blobId,
}: FormCardProps) {
  // Konfigurasi visual berdasarkan status
  const statusConfig = {
    Active: {
      icon: Globe,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    Encrypted: {
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    Draft: {
      icon: FileCode2,
      color: "text-muted-foreground",
      bg: "bg-muted",
      border: "border-border",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="group relative flex flex-col bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
      {/* Header Kartu: Status & Tanggal */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}
        >
          <StatusIcon size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {status}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {lastModified}
        </span>
      </div>

      {/* Konten Utama: Judul & Responses */}
      <div className="flex-1 mb-6">
        <h3 className="font-heading text-xl font-bold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 size={16} />
          <span className="text-sm font-medium">
            {responses} {responses === 1 ? "Response" : "Responses"}
          </span>
        </div>
      </div>

      {/* Web3 Element: Walrus Blob ID (Kalau ada) */}
      {blobId && (
        <div className="mb-4 flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border/50">
          <Box size={14} className="text-primary" />
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
              Walrus Blob ID
            </p>
            <p className="text-xs font-mono font-semibold text-foreground truncate">
              {blobId}
            </p>
          </div>
        </div>
      )}

      {/* Footer: Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit Form"
          >
            <Edit3 size={18} />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Share Link"
          >
            <Share2 size={18} />
          </button>
        </div>
        <Link
          href={`/dashboard/forms/${id}/analytics`}
          className="text-xs font-bold bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          View Results
        </Link>
      </div>
    </div>
  );
}
