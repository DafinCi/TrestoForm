"use client";

import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "./topbar.config";

export default function PageTitle() {
  const pathname = usePathname();

  // Mencari title berdasarkan Regex di config. Default ke "Overview" jika tidak ada yang match.
  const currentTitle =
    PAGE_TITLES.find((route) => route.pattern.test(pathname))?.title ||
    "Dashboard Overview";

  return (
    <h1 className="hidden md:block font-heading text-xl font-bold text-foreground tracking-tight animate-in fade-in duration-300">
      {currentTitle}
    </h1>
  );
}
