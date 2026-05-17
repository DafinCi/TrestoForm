import React from "react";
import { Metadata } from "next";

// Asumsi: form-builder/index.tsx mengekspor komponen utama Builder lu
// yang udah ngebungkus WorkspaceProvider, DesktopWorkspace, MobileWorkspace, dll.
import FormBuilder from "@/components/form-builder";

export const metadata: Metadata = {
  title: "Create Form | Walrus Web3 App",
  description: "Build secure and privacy-focused forms.",
};

export default function CreateFormPage() {
  return (
    // Kita kasih h-screen atau h-[calc(100vh-?)] tergantung layout dashboard lu.
    // Builder butuh full height biar area canvas bisa scroll dengan benar.

    <FormBuilder />
  );
}
