import { NextRequest, NextResponse } from "next/server";

// Some providers may POST directly to /payment/error.
// Accept POST and convert it to a GET render via 303 redirect.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const responseCode = (formData.get("RESPONSE_CODE") as string) || "";
    const responseData = (formData.get("RESPONSE_DATA") as string) || "";
    const messageParam = (formData.get("message") as string) || "";

    const message = messageParam || responseData || (responseCode === "0" ? "Ödeme işlemi başarısız oldu." : "Bilinmeyen hata oluştu.");

    const redirectUrl = new URL(
      `/payment/error?reason=payment_failed&message=${encodeURIComponent(message)}`,
      req.url
    );

    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("Error route POST handler error:", error);
    return NextResponse.redirect(new URL("/payment/error?reason=server_error", req.url), 303);
  }
}