import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-heading text-xl font-bold text-foreground mb-2">
            TrestoForm
          </p>
          <p className="text-sm text-muted-foreground">
            Decentralized form infrastructure on Sui & Walrus.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/about"
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/docs"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/DafinCi/TrestoForm"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} TrestoForm. All rights reserved.
      </div>
    </footer>
  );
}
