/* Single source of truth for the WhatsApp call-to-action.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER is inlined into the client bundle at BUILD time,
 * so it has to exist in the build environment. A local .env never leaves the
 * machine — on Vercel the value must be added under
 * Project Settings → Environment Variables and the project redeployed, or every
 * link below falls back to the "not configured" state.
 *
 * Whatever formatting the value carries ("+20 115 555 8998", "0020…") is
 * stripped here: wa.me only accepts the bare international number, digits only,
 * with no leading "+" or trunk zero.
 */
const RAW_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export const WHATSAPP_NUMBER = RAW_WHATSAPP_NUMBER.replace(/\D/g, '');

/**
 * A wa.me link for the configured number, or "" when no number is configured.
 * Callers treat "" as "render the control, but do not navigate" — that is
 * better than the previous `https://wa.me/undefined`, which opened a broken
 * WhatsApp page.
 */
export const whatsappHref = (message?: string): string => {
  if (!WHATSAPP_NUMBER) return '';
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
