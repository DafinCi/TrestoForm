import React from "react";
import { BarChart3, HelpCircle } from "lucide-react";

export default function AnalyticsComingSoon() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary animate-bounce">
        <BarChart3 size={32} />
      </div>
      <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">
        Advanced Analytics Under Construction
      </h1>
      <p className="text-muted-foreground text-base max-w-md mb-6">
        We are building a robust serverless cryptographic insight engine powered
        by Walrus network. Response telemetry aggregation will be fully
        transparent and real-time.
      </p>
      <div className="bg-muted/50 px-4 py-2.5 rounded-xl border border-border flex items-center gap-2 text-xs text-muted-foreground">
        <HelpCircle size={14} className="text-primary" />
        <span>Estimated release: Hackathon Mainnet Milestone v1.2</span>
      </div>
    </div>
  );
}
