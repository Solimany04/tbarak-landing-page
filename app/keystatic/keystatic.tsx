'use client';

import { makePage } from '@keystatic/core/ui';
import config from '@/keystatic.config';

// Cloud mode: this SPA authenticates against keystatic.cloud and commits to the
// GitHub repo (tbarak/tbarak) through Keystatic Cloud — no server route of ours.
export default makePage(config);
