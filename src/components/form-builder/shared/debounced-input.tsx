"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// === Versi Input (Untuk Label / Placeholder) ===
interface DebouncedInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChangeValue: (value: string) => void;
  debounceDelay?: number;
}

export function DebouncedInput({
  value: initialValue,
  onChangeValue,
  debounceDelay = 400, // 400ms adalah sweet spot untuk typing form
  className,
  ...props
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  // Sync dari parent ke lokal
  useEffect(() => {
    if (initialValue !== localValue) {
      setLocalValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  // Logic Debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== initialValue) {
        onChangeValue(localValue);
      }
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [localValue, initialValue, onChangeValue, debounceDelay]);

  return (
    <Input
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      // Fallback: kalau user langsung klik ke luar input sebelum delay habis
      onBlur={() => {
        if (localValue !== initialValue) {
          onChangeValue(localValue);
        }
      }}
      className={cn(
        "bg-muted/30 border-transparent transition-all shadow-none",
        "focus-visible:border-primary focus-visible:bg-transparent focus-visible:ring-primary/20",
        className,
      )}
    />
  );
}

// === Versi Textarea (Untuk Description / Help Text) ===
interface DebouncedTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  value: string;
  onChangeValue: (value: string) => void;
  debounceDelay?: number;
}

export function DebouncedTextarea({
  value: initialValue,
  onChangeValue,
  debounceDelay = 400,
  className,
  ...props
}: DebouncedTextareaProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue !== localValue) {
      setLocalValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue !== initialValue) {
        onChangeValue(localValue);
      }
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [localValue, initialValue, onChangeValue, debounceDelay]);

  return (
    <Textarea
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => {
        if (localValue !== initialValue) {
          onChangeValue(localValue);
        }
      }}
      className={cn(
        "bg-muted/30 border-transparent transition-all shadow-none resize-none",
        "focus-visible:border-primary focus-visible:bg-transparent focus-visible:ring-primary/20",
        className,
      )}
    />
  );
}
