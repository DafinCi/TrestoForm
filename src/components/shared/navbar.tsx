"use client"; // Wajib karena kita pakai usePathname

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Hexagon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Cek apakah user sedang di halaman utama (Hero)
  const isHomePage = pathname === "/";

  // Logic Styling Dinamis
  const navbarStyles = isHomePage
    ? "absolute bg-transparent text-primary-foreground" // Tampilan di Hero
    : "sticky top-0 bg-card text-foreground border-b border-border shadow-sm"; // Tampilan di About/Docs

  const logoStyles = isHomePage
    ? "stroke-primary-foreground fill-primary-foreground/20"
    : "stroke-primary fill-primary/10";

  const buttonStyles = isHomePage
    ? "bg-background text-foreground hover:bg-muted"
    : "bg-primary text-primary-foreground hover:opacity-90";

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${navbarStyles}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Hexagon size={28} className={logoStyles} />
          <span className="font-heading text-xl font-bold tracking-wide">
            TrestoForm
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/about" className="hover:opacity-70 transition-opacity">
            About
          </Link>
          <Link href="/docs" className="hover:opacity-70 transition-opacity">
            Documentation
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${buttonStyles}`}
          >
            Open App <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
