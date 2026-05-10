"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Pakai Shadcn Input lu

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
  debounceDelay?: number;
}

export function DebouncedInput({
  value: initialValue,
  onChangeValue,
  debounceDelay = 300,
  className,
  ...props
}: DebouncedInputProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  // Sync jika prop dari luar berubah (misal: user klik field lain di canvas)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Efek Debounce: Kirim ke Zustand setelah user berhenti ngetik
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
      onBlur={() => onChangeValue(localValue)} // Fallback: lapor langsung pas blur
      className={`bg-muted/30 border-transparent focus:border-primary focus:bg-transparent transition-all shadow-none ${className}`}
    />
  );
}

// === Versi Textarea untuk Description ===
interface DebouncedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChangeValue: (value: string) => void;
  debounceDelay?: number;
}

export function DebouncedTextarea({
  value: initialValue,
  onChangeValue,
  debounceDelay = 300,
  className,
  ...props
}: DebouncedTextareaProps) {
  const [localValue, setLocalValue] = useState(initialValue);

  useEffect(() => {
    setLocalValue(initialValue);
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
    <textarea
      {...props}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => onChangeValue(localValue)}
      className={`flex w-full rounded-md border border-transparent bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:border-primary focus:bg-transparent transition-all shadow-none resize-none ${className}`}
    />
  );
}
