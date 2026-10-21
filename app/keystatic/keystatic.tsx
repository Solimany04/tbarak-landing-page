'use client';

import { lazy } from 'react';
import type { Config } from '@keystatic/core';
import { Keystatic } from '@keystatic/core/ui';
import keystaticConfig from '@/keystatic.config';
import { registerCompressedImageInput } from '@/lib/keystatic/compressed-image';

// The image field's admin UI is registered here, in the admin's own client
// bundle, so that the public pages never reference it (see compressed-image.tsx).
registerCompressedImageInput(lazy(() => import('@/lib/keystatic/compressed-image-input')));

// Same as @keystatic/next's makePage (which only wraps <Keystatic />), without
// needing that extra package. The loose Config type mirrors makePage's own.
const config: Config<any, any> = keystaticConfig;

// Cloud mode: this SPA signs in against keystatic.cloud and commits to the
// GitHub repo through Keystatic Cloud — no server route needed.
export default function KeystaticApp() {
  return <Keystatic config={config} />;
}
