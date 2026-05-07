import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="bg-primary/10 text-primary p-1.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        <Hexagon size={24} className="fill-current" />
      </div>
      {/* Pake font-heading di sini sesuai request lu */}
      <span className="font-heading text-xl font-bold tracking-tight text-foreground">
        TrestoForm
      </span>
    </Link>
  );
}
