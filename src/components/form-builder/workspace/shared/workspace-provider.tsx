"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface WorkspaceContextType {
  isMobile: boolean;
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  viewportHeight: number;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // 1. Deteksi Mobile / Desktop (Breakpoints 768px)
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 2. Deteksi Mobile Keyboard (Visual Viewport API)
    // Ini krusial banget buat mobile builder biar drawer/canvas gak tertutup keyboard!
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;

        setViewportHeight(currentHeight);

        // Kalau visual viewport lebih kecil dari window height (minus threshold), berarti keyboard naik
        if (currentHeight < windowHeight - 100) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(windowHeight - currentHeight);
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      }
    };

    if (window.visualViewport) {
      handleViewportChange(); // Initial check
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportChange,
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportChange,
        );
      }
    };
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{ isMobile, isKeyboardOpen, keyboardHeight, viewportHeight }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// Custom hook biar gampang dipanggil
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
