import {
  Type,
  AlignLeft,
  Hash,
  List,
  CheckSquare,
  Star,
  Calendar,
  Link,
  Mail,
  Phone,
  FileText,
  Video,
  Image,
  FileUp,
  Type as RichTextIcon,
} from "lucide-react";
import { FieldType, FormField } from "@/types/field";

export interface FieldDefinition extends Partial<FormField> {
  type: FieldType;
  icon: any;
  category: "Basic" | "Choice" | "Media" | "Advanced";
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // --- BASIC ---
  {
    type: "text",
    label: "Short Answer",
    icon: Type,
    category: "Basic",
    description: "Single line text",
  },
  {
    type: "textarea",
    label: "Paragraph",
    icon: AlignLeft,
    category: "Basic",
    description: "Multi-line text",
  },
  {
    type: "richtext",
    label: "Rich Text",
    icon: RichTextIcon,
    category: "Basic",
    description: "Text with formatting",
  },

  // --- CHOICE ---
  {
    type: "select",
    label: "Dropdown",
    icon: List,
    category: "Choice",
    description: "Select from list",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    category: "Choice",
    description: "Multiple selections",
  },
  {
    type: "rating",
    label: "Rating",
    icon: Star,
    category: "Choice",
    description: "Star-based feedback",
  },

  // --- MEDIA (The Premium Section) ---
  {
    type: "image",
    label: "Image Upload",
    icon: Image,
    category: "Media",
    description: "Direct upload to Walrus",
    validation: {
      maxFileSize: 5,
      allowedFileTypes: ["image/png", "image/jpeg"],
    },
  },
  {
    type: "video",
    label: "Video Upload",
    icon: Video,
    category: "Media",
    description: "Supports large video via Walrus",
    validation: {
      maxFileSize: 50,
      allowedFileTypes: ["video/mp4", "video/webm"],
    },
  },
  {
    type: "file",
    label: "Generic File",
    icon: FileUp,
    category: "Media",
    description: "Documents, PDF, etc.",
  },

  // --- ADVANCED ---
  { type: "date", label: "Date", icon: Calendar, category: "Advanced" },
  { type: "url", label: "URL", icon: Link, category: "Advanced" },
  { type: "email", label: "Email", icon: Mail, category: "Advanced" },
  { type: "phone", label: "Phone", icon: Phone, category: "Advanced" },
];
