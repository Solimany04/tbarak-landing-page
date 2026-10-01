/* /llms.txt (https://llmstxt.org): a plain-Markdown brief for AI answer
 * engines. Generated at export time from messages/*.json and the product
 * content, so it always says exactly what the pages say.
 */
import { getProducts } from '@/lib/content/products';
import { MESSAGES } from '@/lib/seo/structured-data';
import {
  CONTACT_EMAIL,
  HERO_STATS,
  MAP_URL,
  SITE_URL,
  absoluteUrl,
  localePath,
  socialProfileUrls,
} from '@/lib/site';
import { whatsappHref } from '@/lib/whatsapp';

export async function buildLlmsTxt(): Promise<string> {
  const { ar, en } = MESSAGES;
  const [productsEn, productsAr] = await Promise.all([getProducts('en'), getProducts('ar')]);
  const arTitle = new Map(productsAr.map((p) => [p.productId, p.productTitle]));
  const whatsapp = whatsappHref();
  const social = socialProfileUrls();
  const location = `${en.meta.addressLocality}, ${en.meta.addressRegion}, ${en.meta.country}`;

  const lines = [
    `# ${en.hero.title} (${ar.hero.title})`,
    '',
    `> ${en.about.intro}`,
    '',
    `${en.hero.body} ${en.contact.addressNote}`,
    '',
    '## Key facts',
    '',
    `- Name: ${en.hero.title} (${ar.hero.title}), also ${en.contact.companyName} (${ar.contact.companyName}).`,
    `- What we do: ${en.hero.body}`,
    `- Who we serve: ${en.meta.audience}.`,
    `- Where: ${location}. Map: ${MAP_URL}`,
    `- Coverage: ${en.why.f3Sub}.`,
    `- Track record: ${HERO_STATS.years} years of experience, ${HERO_STATS.clients} clients, ${HERO_STATS.fabrics} fabric types.`,
    '- Languages: Arabic (default) and English.',
    '',
    '## Services',
    '',
    `- ${en.footer.sWholesale}: ${en.hero.body}`,
    `- ${en.why.f5Title}: ${en.why.f5Sub}.`,
    `- ${en.why.f3Title}: ${en.why.f3Sub}.`,
    `- ${en.why.f2Title}: ${en.why.f2Sub}.`,
    `- ${en.why.f1Title}: ${en.why.f1Sub}.`,
    '',
    '## Fabrics',
    '',
    ...productsEn.map((p) => {
      const arName = arTitle.get(p.productId);
      return `- ${p.productTitle}${arName && arName !== p.productTitle ? ` (${arName})` : ''}`;
    }),
    '',
    '## Contact',
    '',
    ...(whatsapp ? [`- WhatsApp: ${whatsapp}`] : []),
    `- Email: ${CONTACT_EMAIL}`,
    `- Address: ${location}`,
    ...social.map((url) => `- ${url}`),
    '',
    '## بالعربية',
    '',
    ar.about.intro,
    '',
    `${ar.hero.body} ${ar.contact.addressNote}`,
    '',
    '## Pages',
    '',
    `- [${ar.meta.siteName} (Arabic, default)](${absoluteUrl(localePath('ar'))}): ${ar.meta.description}`,
    `- [${en.meta.siteName} (English)](${absoluteUrl(localePath('en'))}): ${en.meta.description}`,
    '',
    '## Optional',
    '',
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    '',
  ];

  return lines.join('\n');
}
