import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware drop-ins for next/link and next/navigation: root-relative
// hrefs get the current locale's prefix, external and empty hrefs pass through.
export const { Link, usePathname, useRouter, getPathname } = createNavigation(routing);
