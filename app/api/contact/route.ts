import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/actions/contact/contact-schema";
import { getClientIp } from "@/lib/actions/contact/get-ip";
import { getRatelimit } from "@/lib/actions/contact/rate-limit";
import { verifyTurnstileToken } from "@/lib/actions/contact/turnstile";
import { sendContactEmails, isEmailConfigured } from "@/lib/actions/contact/email";

// This route talks to Resend/Upstash/Turnstile per request; never prerender it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Secrets the handler cannot work without. Upstash is optional. */
function missingConfig(): string[] {
  const missing: string[] = [];
  if (!isEmailConfigured()) missing.push("RESEND_API_KEY");
  if (!process.env.TURNSTILE_SECRET_KEY) missing.push("TURNSTILE_SECRET_KEY");
  return missing;
}

export async function POST(request: NextRequest) {
  try {
    // 0. Configuration guard
    // Returns 503 instead of throwing, so a deployment without the contact
    // secrets still builds and serves; the form just reports it is unavailable.
    const missing = missingConfig();
    if (missing.length > 0) {
      console.error(`Contact form disabled, missing env: ${missing.join(", ")}`);
      return NextResponse.json({ error: "Contact form is not configured" }, { status: 503 });
    }

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

    // 5. Rate Limiting (skipped when Upstash is not configured)
    const ratelimit = getRatelimit();
    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    } else {
      console.warn("Upstash is not configured; contact form rate limiting is disabled");
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
