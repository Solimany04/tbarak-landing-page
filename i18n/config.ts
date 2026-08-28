export const SUPPORTED = ['ar', 'en'] as const;
export const DEFAULT_LOCALE = 'ar';
export type Locale = (typeof SUPPORTED)[number];
