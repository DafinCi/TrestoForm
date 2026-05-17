"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { FormField } from "@/types/field";

export default function ValidationPreview({ field }: { field: FormField }) {
  const [testValue, setTestValue] = useState("");
  const rules = field.validation || {};

  // Simple Local Validation Engine
  let error = null;

  if (rules.required && testValue.trim() === "") {
    error = "This field is required.";
  } else if (testValue.trim() !== "") {
    if (rules.minLength && testValue.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters.`;
    } else if (rules.maxLength && testValue.length > rules.maxLength) {
      error = `Cannot exceed ${rules.maxLength} characters.`;
    } else if (rules.format === "email" && !/^\S+@\S+\.\S+$/.test(testValue)) {
      error = "Must be a valid email address.";
    } else if (rules.format === "url" && !/^https?:\/\//.test(testValue)) {
      error = "Must be a valid URL (include http:// or https://).";
    }

    // Number range preview logic
    if (field.type === "number") {
      const numVal = parseFloat(testValue);
      if (!isNaN(numVal)) {
        if (rules.min !== undefined && numVal < rules.min)
          error = `Minimum value is ${rules.min}.`;
        if (rules.max !== undefined && numVal > rules.max)
          error = `Maximum value is ${rules.max}.`;
      }
    }
  }

  const showSuccess = testValue.trim() !== "" && !error;

  return (
    <div className="mt-8 p-4 bg-muted/20 border border-border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Live Sandbox Preview
        </h4>
        {testValue.length > 0 && rules.maxLength && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {testValue.length} / {rules.maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder="Test your rules here..."
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          className={`pr-10 ${error ? "border-destructive/50 focus-visible:ring-destructive/20" : ""}`}
        />
        {error && (
          <AlertCircle
            className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive"
            size={16}
          />
        )}
        {showSuccess && (
          <CheckCircle2
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
            size={16}
          />
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-destructive font-medium flex items-center gap-1">
          {error}
        </p>
      ) : showSuccess ? (
        <p className="text-[11px] text-emerald-500 font-medium">
          Looks good! Valid input.
        </p>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Type something to test the validation rules.
        </p>
      )}
    </div>
  );
}
