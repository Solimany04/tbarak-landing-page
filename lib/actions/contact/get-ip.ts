import { NextRequest } from "next/server";
import { ipAddress } from "@vercel/functions";

export function getClientIp(request: NextRequest): string {
  // Try Vercel's helper first
  const vercelIp = ipAddress(request);
  if (vercelIp) return vercelIp;

  // Fallback to x-vercel-forwarded-for or x-forwarded-for
  const xVercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  if (xVercelForwardedFor) return xVercelForwardedFor.split(",")[0].trim();

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  return "127.0.0.1";
}
