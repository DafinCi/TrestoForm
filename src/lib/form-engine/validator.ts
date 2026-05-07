import { z } from "zod";
import { FormField } from "@/types/field";

export const generateZodSchema = (fields: FormField[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    // 1. Tentukan base type berdasarkan field.type
    switch (field.type) {
      case "url":
        fieldSchema = z.string().url("Please enter a valid URL");
        break;
      case "file":
        // Untuk MVP Web3, file biasanya dihandle terpisah (upload dulu, dapat ID string),
        // tapi kita set any() dulu untuk file object dari browser
        fieldSchema = z.any();
        break;
      case "rating":
        fieldSchema = z.coerce.number().min(1).max(5);
        break;
      case "checkbox":
      case "select":
      case "text":
      case "textarea":
      default:
        fieldSchema = z.string();
        break;
    }

    // 2. Terapkan rules (Required vs Optional)
    if (field.required) {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required`);
      }
      // Jika file required
      if (field.type === "file") {
        fieldSchema = fieldSchema.refine(
          (val) => val !== undefined && val !== null,
          {
            message: `${field.label} is required`,
          },
        );
      }
    } else {
      // Jika tidak required, biarkan kosong atau undefined
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      } else {
        fieldSchema = fieldSchema.optional();
      }
    }

    // Simpan ke object shape dengan key = ID dari field
    schemaShape[field.id] = fieldSchema;
  });

  return z.object(schemaShape);
};
