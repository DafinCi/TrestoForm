import Link from "next/link";
import { Hexagon } from "lucide-react";

// Tambahkan parameter className di sini
export default function Logo({ className = "" }: { className?: string }) {
  return (
    // Masukkan className ke parent element biar bisa di-scale
    <Link
      href="/"
      className={`flex items-center gap-2.5 group transition-all duration-300 ${className}`}
    >
      <div className="bg-primary/10 text-primary p-1.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <Hexagon size={24} className="fill-current" />
      </div>
      <span className="font-heading text-xl font-bold tracking-tight text-foreground">
        TrestoForm
      </span>
    </Link>
  );
}
