import React from "react";
import { LucideIcon } from "lucide-react";

// Definisikan struktur tipe datanya
interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string; // Opsional buat warna custom icon
}

interface StatsOverviewProps {
  stats: StatItem[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card border-2 border-border p-5 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-lg bg-muted ${stat.color || "text-foreground"}`}
              >
                <Icon size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              {stat.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
