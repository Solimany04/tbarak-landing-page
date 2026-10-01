import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Written to /robots.txt at build time.
export const dynamic = 'force-static';

/**
 * AI crawlers are listed by name so the intent is explicit: training crawlers,
 * the search indexers behind AI answers, and the fetchers that act on a
 * user's request. A crawler that matches a named group ignores the "*" group,
 * so each one needs its own allow.
 *
 * Cloudflare can override this file: if "Block AI bots" or "Managed
 * robots.txt" is on for the zone, it prepends its own Disallow rules.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
