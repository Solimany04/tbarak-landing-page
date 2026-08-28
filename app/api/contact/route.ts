import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/actions/contact/contact-schema";
import { getClientIp } from "@/lib/actions/contact/get-ip";
import { ratelimit } from "@/lib/actions/contact/rate-limit";
import { verifyTurnstileToken } from "@/lib/actions/contact/turnstile";
import { sendContactEmails } from "@/lib/actions/contact/email";

export async function POST(request: NextRequest) {
  try {
    // 1. Content-Type & Method guards
    if (request.headers.get("content-type") !== "application/json") {
      return NextResponse.json({ error: "Invalid Content-Type" }, { status: 415 });
    }

    // Body size guard (~16 KB)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 16384) {
      return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    }

    // Parse body
    const body = await request.json();

    // 2. Honeypot check
    // If bots fill this in, we return 200 silently to avoid tipping them off.
    if (body.company && body.company.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // 3. Zod validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    const data = result.data;

    // 4. Client IP extraction
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || "Unknown";

    // 5. Rate Limiting
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 6. Turnstile Verification
    const isHuman = await verifyTurnstileToken(data.token, ip);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed" }, { status: 403 });
    }

    // 7. Send Emails (Notification & Auto-Reply)
    await sendContactEmails(data, ip, userAgent);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
