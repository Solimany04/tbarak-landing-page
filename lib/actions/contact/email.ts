import { Resend } from "resend";
import { ContactFormData } from "./contact-schema";
import NotificationEmail from "@/lib/emails/Notification";
import AutoReplyEmail from "@/lib/emails/AutoReply";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmails(data: ContactFormData, ip: string, userAgent: string) {
  const isVerified = process.env.RESEND_DOMAIN_VERIFIED === "true";

  const fallbackEmail = process.env.OWNER_FALLBACK_EMAIL || "";
  const productionToEmail = process.env.CONTACT_TO_EMAIL || "";
  const productionFromName = process.env.RESEND_FROM_NAME || "Website Contact";
  const productionFromEmail = process.env.RESEND_FROM_EMAIL || "";

  // 1. Send Notification Email
  const notificationFrom = isVerified 
    ? `${productionFromName} <${productionFromEmail}>` 
    : "Website Contact <onboarding@resend.dev>";
    
  const notificationTo = isVerified ? productionToEmail : fallbackEmail;

  const { error: notificationError } = await resend.emails.send({
    from: notificationFrom,
    to: notificationTo,
    replyTo: data.email,
    subject: `رسالة جديدة من ${data.firstName} ${data.lastName}`,
    react: NotificationEmail({ data, ip, userAgent }),
  });

  if (notificationError) {
    console.error("Resend Notification Error:", notificationError);
    throw new Error("Failed to send notification email");
  }

  // 2. Send Auto-Reply Email (ONLY if domain is verified)
  if (isVerified) {
    const { error: autoReplyError } = await resend.emails.send({
      from: `${productionFromName} <${productionFromEmail}>`,
      to: data.email,
      replyTo: productionToEmail, // Or wherever you want replies to the auto-reply to go
      subject: "استلمنا رسالتك - تبارك",
      react: AutoReplyEmail({ firstName: data.firstName }),
    });

    if (autoReplyError) {
      console.error("Resend Auto-Reply Error:", autoReplyError);
      // We don't necessarily want to fail the whole request if auto-reply fails, but we log it
    }
  }
}
