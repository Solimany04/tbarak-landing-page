/* JSON-LD for the landing page, built at export time from the same strings and
 * content the page renders — so every value in the markup is also visible
 * text on that locale's page (or a URL the page links to).
 */
import type { Locale } from '@/i18n/config';
import type { ProductItem } from '@/app/utils/types';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import {
  CONTACT_EMAIL,
  LOGO,
  MAP_URL,
  OG_IMAGE,
  SITE_URL,
  absoluteUrl,
  localePath,
  socialProfileUrls,
} from '@/lib/site';
import { whatsappHref } from '@/lib/whatsapp';

export type Messages = typeof en;
export const MESSAGES: Record<Locale, Messages> = { ar, en };

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const LOGO_ID = `${SITE_URL}/#logo`;

export function buildStructuredData(locale: Locale, products: ProductItem[]) {
  const m = MESSAGES[locale];
  const other = MESSAGES[locale === 'ar' ? 'en' : 'ar'];
  const pageUrl = absoluteUrl(localePath(locale));
  const whatsapp = whatsappHref();
  const sameAs = socialProfileUrls();
  const country = { '@type': 'Country', name: m.meta.country, identifier: 'EG' };
  const provider = { '@id': ORG_ID };

  const address = {
    '@type': 'PostalAddress',
    addressLocality: m.meta.addressLocality,
    addressRegion: m.meta.addressRegion,
    addressCountry: 'EG',
  };

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: m.hero.title,
    alternateName: [m.contact.companyName, m.about.brand],
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: absoluteUrl(LOGO.path),
      width: LOGO.width,
      height: LOGO.height,
      caption: m.meta.siteName,
    },
    image: { '@id': LOGO_ID },
    description: m.about.intro,
    slogan: m.hero.subtitle,
    email: CONTACT_EMAIL,
    address,
    // hasMap belongs to Place, so the map link hangs off the location.
    location: { '@type': 'Place', address, hasMap: MAP_URL },
    areaServed: country,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: CONTACT_EMAIL,
        // Same wa.me link the page's buttons use; omitted until the number is
        // configured in the build environment.
        ...(whatsapp ? { url: whatsapp } : {}),
        availableLanguage: ['Arabic', 'English'],
        areaServed: 'EG',
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: absoluteUrl('/'),
    name: m.meta.siteName,
    alternateName: other.meta.siteName,
    inLanguage: ['ar', 'en'],
    publisher: provider,
  };

  const webpage = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: m.meta.title,
    description: m.meta.description,
    inLanguage: locale,
    isPartOf: { '@id': SITE_ID },
    about: provider,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(OG_IMAGE.path(locale)),
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
    },
  };

  // The footer's "Services" column, described with the matching feature cards.
  const services = [
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service-wholesale`,
      name: m.footer.sWholesale,
      serviceType: m.footer.sWholesale,
      description: m.hero.body,
      provider,
      areaServed: country,
      audience: { '@type': 'BusinessAudience', audienceType: m.meta.audience },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${m.products.heading} ${m.products.brand}`,
        // ListItem rather than Product: there are no public prices, and a
        // Product without offers/reviews is flagged invalid by Google.
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.productTitle,
          description: p.productDesc,
          image: absoluteUrl(p.productImage[0]),
        })),
      },
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service-samples`,
      name: m.why.f5Title,
      description: m.why.f5Sub,
      provider,
      areaServed: country,
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service-shipping`,
      name: m.why.f3Title,
      description: m.why.f3Sub,
      provider,
      areaServed: country,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, webpage, ...services],
  };
}

/** JSON for a <script> body: escape "<" so content can't close the tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
