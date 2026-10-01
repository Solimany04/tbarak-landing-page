import { buildLlmsTxt } from '@/lib/seo/llms';

// Rendered once during `next build` and exported as the static file /llms.txt.
export const dynamic = 'force-static';

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
