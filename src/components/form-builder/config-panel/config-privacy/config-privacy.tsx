"use client";

import React, { useCallback, useMemo } from "react";
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
import PrivacyVisibility from "./privacy-visibility";
import PrivacySecurity from "./privacy-security";
import PrivacyPreview from "./privacy-preview";

export default function ConfigPrivacy() {
  const activeFieldId = useBuilderUIStore((s) => s.activeFieldId);
  const field = useBuilderSchemaStore((s) =>
    s.fields.find((f) => f.id === activeFieldId),
  );
  const updateField = useBuilderSchemaStore((s) => s.updateField);

  if (!field) return null;

  // Set default values kalau privacy object belum ada di field
  const privacy = useMemo(() => {
    return (
      field.privacy || {
        isEncrypted: false,
        isMasked: false,
        visibility: "public" as const,
      }
    );
  }, [field.privacy]);

  // Helper untuk update flat privacy object
  const updatePrivacy = useCallback(
    (key: keyof typeof privacy, value: any) => {
      updateField(field.id, {
        privacy: {
          ...privacy,
          [key]: value,
        },
      });
    },
    [field.id, privacy, updateField],
  );

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      <PrivacyVisibility
        value={privacy.visibility}
        onChange={(val) => updatePrivacy("visibility", val)}
      />

      <hr className="border-border/60" />

      <PrivacySecurity
        isEncrypted={privacy.isEncrypted}
        isMasked={privacy.isMasked}
        onToggleEncrypt={(val) => updatePrivacy("isEncrypted", val)}
        onToggleMask={(val) => updatePrivacy("isMasked", val)}
      />

      <PrivacyPreview
        isEncrypted={privacy.isEncrypted}
        isMasked={privacy.isMasked}
        visibility={privacy.visibility}
      />
    </div>
  );
}
