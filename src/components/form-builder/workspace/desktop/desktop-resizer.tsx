"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBuilderUIStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";

export default function DesktopResizer() {
  const setConfigWidth = useBuilderUIStore((s) => s.setConfigWidth);
  const currentWidth = useBuilderUIStore((s) => s.configWidth);
  const isConfigOpen = useBuilderUIStore((s) => s.isConfigOpen);

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ isDragging: false, currentWidth: 0 });

  useEffect(() => {
    // Sinkronisasi nilai store ke CSS variable saat pertama load atau saat diubah dari tempat lain
    document.documentElement.style.setProperty(
      "--config-width",
      `${currentWidth}px`,
    );
  }, [currentWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;

      // Hitung lebar baru (karena panel ada di kanan, rumusnya: lebar layar - posisi X mouse)
      // Kalau panel di kiri, rumusnya murni e.clientX
      let newWidth = window.innerWidth - e.clientX;

      // Batasi min dan max lebar panel
      if (newWidth < 280) newWidth = 280;
      if (newWidth > 600) newWidth = 600;

      dragRef.current.currentWidth = newWidth;

      // 🔥 MAGIC TRICK: Update CSS Variable langsung ke DOM (0 Re-render)
      document.documentElement.style.setProperty(
        "--config-width",
        `${newWidth}px`,
      );
    };

    const handleMouseUp = () => {
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false;
        setIsDragging(false);

        document.body.classList.remove("is-resizing");
        // Kembalikan cursor ke normal
        document.body.style.cursor = "";
        document.body.style.userSelect = "";

        // 🔥 COMMIT STATE: Simpan ke Zustand & localStorage hanya SATU KALI saat drag selesai
        setConfigWidth(dragRef.current.currentWidth);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setConfigWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah teks ter-highlight saat drag
    dragRef.current.isDragging = true;
    dragRef.current.currentWidth = currentWidth;
    setIsDragging(true);

    // Kunci cursor browser jadi resize, biar kalau mouse gerak terlalu cepat gak berubah-ubah
    document.body.classList.add("is-resizing");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  // Kalau ConfigPanel lagi ditutup, resizer-nya kita sembunyikan
  if (!isConfigOpen) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "relative z-10 w-1 sm:w-[6px] -ml-[3px] bg-transparent hover:bg-primary/50 cursor-col-resize transition-colors duration-150 group",
        isDragging && "bg-primary", // Warna solid saat sedang ditarik
      )}
    >
      {/* Garis visual yang elegan di tengah resizer (opsional) */}
      <div
        className={cn(
          "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-border transition-colors group-hover:bg-primary/50",
          isDragging && "bg-primary",
        )}
      />
    </div>
  );
}
