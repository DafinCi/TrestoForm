"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { LockKeyhole, EyeOff } from "lucide-react";

interface PrivacySecurityProps {
  isEncrypted: boolean;
  isMasked: boolean;
  onToggleEncrypt: (val: boolean) => void;
  onToggleMask: (val: boolean) => void;
}

export default function PrivacySecurity({
  isEncrypted,
  isMasked,
  onToggleEncrypt,
  onToggleMask,
}: PrivacySecurityProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Data Protection (Powered by Seal)
      </h4>

      {/* End-to-End Protection (Encryption) */}
      <div
        className={`p-4 rounded-lg border transition-colors ${isEncrypted ? "border-emerald-500/50 bg-emerald-500/5" : "border-border bg-card"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={14}
                className={
                  isEncrypted ? "text-emerald-500" : "text-muted-foreground"
                }
              />
              <p className="text-sm font-semibold">End-to-End Protection</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Encrypts response data before storing. Only authorized admins can
              decrypt and read this data.
            </p>
          </div>
          <Switch checked={isEncrypted} onCheckedChange={onToggleEncrypt} />
        </div>
      </div>

      {/* Response Masking */}
      <div
        className={`p-4 rounded-lg border transition-colors ${isMasked ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <EyeOff
                size={14}
                className={isMasked ? "text-primary" : "text-muted-foreground"}
              />
              <p className="text-sm font-semibold">Response Masking</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Hide partial data on dashboards (e.g., j***@mail.com). Good for
              sensitive info.
            </p>
          </div>
          <Switch checked={isMasked} onCheckedChange={onToggleMask} />
        </div>
      </div>
    </div>
  );
}
