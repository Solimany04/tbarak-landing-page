'use client';

import type { Config } from '@keystatic/core';
import { Keystatic } from '@keystatic/core/ui';
import keystaticConfig from '@/keystatic.config';

// Same as @keystatic/next's makePage (which only wraps <Keystatic />), without
// needing that extra package. The loose Config type mirrors makePage's own.
const config: Config<any, any> = keystaticConfig;

// Cloud mode: this SPA signs in against keystatic.cloud and commits to the
// GitHub repo through Keystatic Cloud — no server route needed.
export default function KeystaticApp() {
  return <Keystatic config={config} />;
}
