// =============================================================================
// src/app/api/forms/route.ts
// POST /api/forms  → saveFormSchema (dapat blobId untuk share link)
// GET  /api/forms?id=xxx → getFormSchema
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { saveFormSchema, getFormSchema } from "@/services/form.service";
import { WalrusError } from "@/lib/walrus/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validasi input minimalis
    if (!body.title || !body.fields || !Array.isArray(body.fields)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields (title, fields array)",
        },
        { status: 400 },
      );
    }

    const result = await saveFormSchema(
      body.title,
      body.fields,
      body.description,
    );

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: any) {
    if (err instanceof WalrusError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const formId = req.nextUrl.searchParams.get("id");
  if (!formId) {
    return NextResponse.json(
      { success: false, error: "formId (blobId) query param is required" },
      { status: 400 },
    );
  }

  try {
    const schema = await getFormSchema(formId);
    return NextResponse.json({ success: true, schema });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Form not found" },
      { status: 404 },
    );
  }
}
