import { NextRequest, NextResponse } from 'next/server'

// Minimal fix: Handle POST requests coming from Paynkolay by redirecting to GET
// Payment gateways often POST to the success URL (form submit). Pages only accept GET,
// so we convert POST -> GET with a 303 redirect to the same path.
export async function POST(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  const url = new URL(`/success/${params.shortId}`, request.url)
  // Use 303 See Other so the client performs a GET request to the Location URL
  return NextResponse.redirect(url, 303)
}

// Optional: respond to HEAD to avoid 405 from some clients
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}