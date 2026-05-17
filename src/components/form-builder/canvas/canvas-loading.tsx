"use client";

import React from "react";

export default function CanvasLoading() {
  return (
    <div className="flex flex-col w-full bg-card shadow-sm border border-border/60 rounded-xl md:rounded-2xl overflow-hidden min-h-[400px]">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start p-6 border-b border-border/40 last:border-b-0"
        >
          {/* Skeleton Handle */}
          <div className="w-4 h-6 bg-muted/50 rounded animate-pulse mt-1" />

          <div className="flex-1 pl-6">
            {/* Skeleton Label */}
            <div className="w-1/4 h-4 bg-muted/80 rounded animate-pulse mb-3" />
            {/* Skeleton Input */}
            <div className="w-full h-10 bg-muted/40 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
