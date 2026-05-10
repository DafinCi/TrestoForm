// =============================================================================
// src/app/api/submissions/route.ts
// Example API Route — Form Submission with Walrus
//
// POST /api/submissions  → createSubmission
// GET  /api/submissions?submissionId=xxx → getSubmission
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getSubmission } from "@/services/submission.service";
import { WalrusError } from "@/lib/walrus/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await createSubmission(body);

    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err) {
    if (err instanceof WalrusError) {
      return NextResponse.json(
        { success: false, error: err.message, code: err.code },
        { status: 502 },
      );
    }
    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const submissionId = req.nextUrl.searchParams.get("submissionId");
  if (!submissionId) {
    return NextResponse.json(
      { error: "submissionId query param is required" },
      { status: 400 },
    );
  }

  try {
    const submission = await getSubmission(submissionId);
    return NextResponse.json({ success: true, submission });
  } catch (err) {
    if (err instanceof WalrusError) {
      return NextResponse.json(
        { success: false, error: err.message, code: err.code },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 },
    );
  }
}
