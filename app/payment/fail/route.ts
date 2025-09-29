import { NextRequest, NextResponse } from "next/server";

// Handle Paynkolay POST callback hitting the page path instead of API
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const responseCode = (formData.get("RESPONSE_CODE") as string) || "";
    const responseData = (formData.get("RESPONSE_DATA") as string) || "";

    // Build a minimal, consistent redirect to the unified error page
    const reason = "payment_failed";
    const message = responseData || (responseCode === "0" ? "Ödeme işlemi başarısız oldu." : "Bilinmeyen hata oluştu.");

    const redirectUrl = new URL(
      `/payment/error?reason=${encodeURIComponent(reason)}&message=${encodeURIComponent(message)}`,
      req.url
    );

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Fail route POST handler error:", error);
    return NextResponse.redirect(new URL("/payment/error?reason=server_error", req.url));
  }
}