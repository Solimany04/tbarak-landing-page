import { reader } from './reader';
import type { Locale } from '@/i18n/config';
import type { FeedbackCardProps } from '@/app/utils/types';

const AVATARS = [
  '/FeedbackAvatars/Ellipse1.png',
  '/FeedbackAvatars/Ellipse2.png',
  '/FeedbackAvatars/Ellipse3.png',
];

const pick = (locale: Locale, ar?: string, en?: string) =>
  (locale === 'en' ? en || ar : ar) ?? '';

export async function getFeedbacks(locale: Locale): Promise<FeedbackCardProps[]> {
  const rows = await reader.collections.feedbacks.all();
  return rows
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))
    .map(({ entry }, i) => ({
      avatar: AVATARS[i % AVATARS.length],
      name: pick(locale, entry.nameAr, entry.nameEn),
      desc: pick(locale, entry.roleAr, entry.roleEn),
      content: pick(locale, entry.contentAr, entry.contentEn),
    }));
}
