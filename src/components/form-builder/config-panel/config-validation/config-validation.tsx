"use client";

import React, { useCallback } from "react";
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import ValidationRuleItem from "./validation-rule-item";
import {
  ValidationNumberInput,
  ValidationFormatSelect,
} from "./validation-limits";
import ValidationPreview from "./validation-preview";

export default function ConfigValidation() {
  const activeFieldId = useBuilderUIStore((s) => s.activeFieldId);
  const field = useBuilderSchemaStore((s) =>
    s.fields.find((f) => f.id === activeFieldId),
  );
  const updateField = useBuilderSchemaStore((s) => s.updateField);

  if (!field) return null;

  const rules = field.validation || {};
  const isTextBased = ["text", "textarea"].includes(field.type);
  const isNumberBased = ["number", "rating"].includes(field.type);
  const isFileBased = field.type === "file";

  // Flat update mechanism
  const updateValidation = useCallback(
    (key: string, value: any) => {
      updateField(field.id, {
        validation: {
          ...rules,
          [key]: value,
        },
      });
    },
    [field.id, rules, updateField],
  );

  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-4">
        {/* Universal: Custom Error Message */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Custom Error Message
          </Label>
          <Input
            placeholder="e.g., Please provide a valid answer"
            value={rules.customErrorMessage || ""}
            onChange={(e) =>
              updateValidation("customErrorMessage", e.target.value)
            }
            className="text-sm"
          />
        </div>

        {/* Text Based Rules */}
        {isTextBased && (
          <>
            <ValidationRuleItem
              title="Character Limit"
              description="Restrict how many characters can be typed."
              isActive={
                rules.minLength !== undefined || rules.maxLength !== undefined
              }
              onToggle={(active) => {
                if (!active) {
                  updateValidation("minLength", undefined);
                  updateValidation("maxLength", undefined);
                } else {
                  updateValidation("maxLength", 255); // Default start
                }
              }}
            >
              <div className="flex gap-4">
                <ValidationNumberInput
                  label="Minimum"
                  placeholder="0"
                  value={rules.minLength}
                  onChangeValue={(val) => updateValidation("minLength", val)}
                />
                <ValidationNumberInput
                  label="Maximum"
                  placeholder="255"
                  value={rules.maxLength}
                  onChangeValue={(val) => updateValidation("maxLength", val)}
                />
              </div>
            </ValidationRuleItem>

            {field.type === "text" && (
              <ValidationRuleItem
                title="Specific Format"
                description="Ensure the input looks like an email, URL, etc."
                isActive={rules.format !== undefined && rules.format !== "none"}
                onToggle={(active) =>
                  updateValidation("format", active ? "email" : "none")
                }
              >
                <ValidationFormatSelect
                  value={rules.format}
                  onChangeValue={(val) => updateValidation("format", val)}
                />
              </ValidationRuleItem>
            )}
          </>
        )}

        {/* Number Based Rules */}
        {isNumberBased && (
          <ValidationRuleItem
            title="Number Range Limit"
            description="Set the minimum and maximum allowed numbers."
            isActive={rules.min !== undefined || rules.max !== undefined}
            onToggle={(active) => {
              if (!active) {
                updateValidation("min", undefined);
                updateValidation("max", undefined);
              } else {
                updateValidation("min", 0);
              }
            }}
          >
            <div className="flex gap-4">
              <ValidationNumberInput
                label="Min Value"
                placeholder="0"
                value={rules.min}
                onChangeValue={(val) => updateValidation("min", val)}
              />
              <ValidationNumberInput
                label="Max Value"
                placeholder="100"
                value={rules.max}
                onChangeValue={(val) => updateValidation("max", val)}
              />
            </div>
          </ValidationRuleItem>
        )}

        {/* File Based Rules */}
        {isFileBased && (
          <ValidationRuleItem
            title="File Size Limit"
            description="Prevent users from uploading files that are too large."
            isActive={rules.maxFileSize !== undefined}
            onToggle={(active) =>
              updateValidation("maxFileSize", active ? 5 : undefined)
            }
          >
            <ValidationNumberInput
              label="Max Size (in MB)"
              placeholder="5"
              value={rules.maxFileSize}
              onChangeValue={(val) => updateValidation("maxFileSize", val)}
            />
          </ValidationRuleItem>
        )}
      </div>

      {/* The Killer Feature: Sandbox */}
      {["text", "number"].includes(field.type) && (
        <ValidationPreview field={field} />
      )}
    </div>
  );
}
