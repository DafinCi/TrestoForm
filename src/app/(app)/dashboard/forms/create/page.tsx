import React from "react";
import FormBuilderClient from "@/components/form-builder/form-builder-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Form | Your Web3 App",
  description: "Build secure and privacy-focused forms using Walrus Protocol.",
};

export default function CreateFormPage() {
  // Sebagai Server Component, di sini lu bisa nge-fetch session user
  // atau ngecek hak akses (authorization) sebelum ngerender Form Builder.

  return (
    <main className="h-full w-full">
      {/* Kita oper beban render interaktif ke Client Component */}
      <FormBuilderClient />
    </main>
  );
}
