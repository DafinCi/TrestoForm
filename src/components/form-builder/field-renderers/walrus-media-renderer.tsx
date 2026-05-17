"use client";

import React, { useCallback, useState } from "react";
import { FormField } from "@/types/field";
import {
  UploadCloud,
  File as FileIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { useUploadStore } from "@/store/upload-store";
import { uploadToWalrusAPI } from "@/lib/walrus/client-uploader";

// Helper size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

interface Props {
  field: FormField;
}

export default function WalrusMediaRenderer({ field }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);

  const tasks = useUploadStore((s) => s.tasks);
  // Identifikasi file berdasarkan field.id
  const activeTask = Object.values(tasks).find((t) => t.fieldId === field.id);

  // Ambil validation dari schema (fallback default jika tidak ada)
  const maxSizeMB = field.validation?.maxFileSize || 50;
  const allowedTypes = field.validation?.allowedFileTypes?.join(",") || "*/*";

  const processFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File is too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }

      const taskId = crypto.randomUUID();
      let previewUrl = undefined;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      // Daftarkan ke Store
      useUploadStore.getState().addUpload({
        id: taskId,
        fieldId: field.id,
        file,
        previewUrl,
      });

      // Tembak ke Next.js API Route
      uploadToWalrusAPI(file, taskId);
    },
    [field.id, maxSizeMB],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      {!activeTask ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer
            transition-all duration-200 ease-in-out group bg-card
            ${isDragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-muted/50"}
          `}
        >
          {/* Input file (Penting: Tidak akan bisa diklik kalau parent-nya punya pointer-events-none) */}
          <input
            type="file"
            accept={allowedTypes}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="p-3 bg-muted rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
            {field.type === "video" ? (
              <Video className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            ) : field.type === "image" ? (
              <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            ) : (
              <UploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            )}
          </div>

          <p className="text-sm font-medium text-foreground text-center">
            Upload <span className="capitalize">{field.type}</span> via{" "}
            <span className="text-primary font-bold">Walrus</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {maxSizeMB}MB
          </p>
        </div>
      ) : (
        <div className="p-3 border border-border rounded-lg bg-card shadow-sm flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border">
              {activeTask.previewUrl ? (
                <img
                  src={activeTask.previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : activeTask.file.type.startsWith("video/") ? (
                <Video className="w-5 h-5 text-muted-foreground" />
              ) : (
                <FileIcon className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium truncate pr-2 text-foreground">
                  {activeTask.file.name}
                </span>
                {activeTask.status === "uploading" && (
                  <span className="text-xs font-bold text-primary">
                    {activeTask.progress}%
                  </span>
                )}
                {activeTask.status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                {activeTask.status === "error" && (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {formatFileSize(activeTask.file.size)}
                {activeTask.status === "success" && (
                  <span className="text-green-500 ml-1">
                    ✓ Secured on Walrus
                  </span>
                )}
                {activeTask.status === "error" && (
                  <span className="text-destructive ml-1">
                    • {activeTask.errorMessage}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                useUploadStore.getState().removeUpload(activeTask.id);
              }}
              className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors shrink-0 z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTask.status === "uploading" && (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
