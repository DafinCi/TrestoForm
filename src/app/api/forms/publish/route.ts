export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { saveFormSchema } from "@/services/form.service";

/**
 * POST /api/forms/publish
 * Handles incoming form schemas from the client, validates the state,
 * and pushes the final JSON structure to the decentralized Walrus Network.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, fields, creatorAddress, transactionDigest } = body;

    // 1. Strict Payload Validation
    if (!title || !fields || !creatorAddress || !transactionDigest) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields. Ensure title, fields, creatorAddress, and transactionDigest are provided.",
        },
        { status: 400 },
      );
    }

    // [Optional Production Step] Verify the transaction digest on-chain here
    // to ensure the user actually paid before storing their blob.
    // e.g., await blockchainService.verifyPayment(transactionDigest);

    console.log(
      `[API/Publish] Processing publication request from creator: ${creatorAddress}`,
    );

    // 2. Delegate Walrus execution to your dedicated Form Service
    // This utilizes your configured underlying upload mechanisms seamlessly.
    const { formId } = await saveFormSchema(title, fields);

    console.log(
      `[API/Publish] Form successfully anchored to Walrus. Blob ID: ${formId}`,
    );

    // 3. Return a clean structure mapping 'formId' to 'blobId' as required by your frontend
    return NextResponse.json(
      {
        success: true,
        blobId: formId,
        message: "Form schema successfully deployed to the Walrus network.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "[API/Publish] Critical failure during form publication:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "An unexpected error occurred while communicating with Walrus.",
      },
      { status: 500 },
    );
  }
}
