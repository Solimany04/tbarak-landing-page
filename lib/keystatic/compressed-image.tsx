/**
 * `compressedImage` — a drop-in replacement for Keystatic's `fields.image`
 * that resizes and converts uploads to WebP in the browser before they are
 * committed, and rejects anything still over `maxBytes` afterwards.
 *
 * It implements Keystatic's `AssetFormField` contract (@keystatic/core 0.5.x)
 * and stores exactly what `fields.image` stores — a single string,
 * `${publicPath}/${slug}/${fieldPath}.${ext}` — so existing entries and the
 * reader keep working unchanged. Only the extension of NEW uploads differs
 * (`.webp` instead of the original).
 *
 * keystatic.config.ts is evaluated on the server too (createReader, the API
 * route, React Server Components), where Keystatic itself stubs every field
 * Input and imports none of its UI. This module mirrors that: it imports no
 * @keystar/ui and no browser code; the real input lives in
 * ./compressed-image-input.tsx and is loaded lazily, on first render, in the
 * browser only.
 */
import { lazy, Suspense } from 'react';
import type { AssetFormField, FormFieldStoredValue } from '@keystatic/core';
import { formatBytes } from './image-compression';

export type CompressionMeta = {
  originalBytes: number;
  originalName: string;
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  resized: boolean;
  outcome: 'webp' | 'fallback' | 'original';
};

/**
 * Same in-memory shape as `fields.image` (`data` / `extension` / `filename`)
 * so array `itemLabel`s and anything else reading the form value keep working.
 * `meta` is only present on images uploaded through this field in the current
 * editing session; it is never serialised.
 */
export type CompressedImageValue = {
  data: Uint8Array;
  extension: string;
  filename: string;
  meta?: CompressionMeta;
};

export type CompressedImageInputProps = {
  value: CompressedImageValue | null;
  onChange(value: CompressedImageValue | null): void;
  autoFocus: boolean;
  forceValidation: boolean;
  label: string;
  description?: string;
  isRequired: boolean;
  maxEdge: number;
  quality: number;
  maxBytes: number;
};

// Mirrors Keystatic's (unexported) RequiredValidation helper type.
type RequiredValidation<IsRequired extends boolean | undefined> = IsRequired extends true
  ? { validation: { isRequired: true } }
  : unknown;

export const DEFAULT_MAX_EDGE = 1570;
export const DEFAULT_QUALITY = 0.8;
export const DEFAULT_MAX_BYTES = 1024 * 1024;

// Local copies of two one-line helpers Keystatic does not export.
const getSrcPrefix = (publicPath: string | undefined, slug: string | undefined) =>
  typeof publicPath === 'string'
    ? `${publicPath.replace(/\/*$/, '')}/${slug === undefined ? '' : slug + '/'}`
    : '';
const fixPath = (path: string) => path.replace(/^\.?\/+/, '').replace(/\/*$/, '');

const LazyInput = lazy(() => import('./compressed-image-input'));

export function compressedImage<IsRequired extends boolean | undefined>({
  label,
  directory,
  publicPath,
  description,
  validation,
  maxEdge = DEFAULT_MAX_EDGE,
  quality = DEFAULT_QUALITY,
  maxBytes = DEFAULT_MAX_BYTES,
}: {
  label: string;
  directory?: string;
  publicPath?: string;
  description?: string;
  validation?: { isRequired?: IsRequired };
  /** Longest-edge cap in px; smaller images are left at their size. @default 1570 */
  maxEdge?: number;
  /** WebP quality, 0–1. @default 0.8 */
  quality?: number;
  /** Hard limit on the committed file size, checked AFTER compression. @default 1 MiB */
  maxBytes?: number;
} & RequiredValidation<IsRequired>): AssetFormField<
  CompressedImageValue | null,
  CompressedImageValue | (IsRequired extends true ? never : null),
  string | (IsRequired extends true ? never : null)
> {
  type Nullable = IsRequired extends true ? never : null;
  const isRequired = !!validation?.isRequired;

  return {
    kind: 'form',
    formKind: 'asset',
    label,
    Input(props) {
      return (
        <Suspense fallback={null}>
          <LazyInput
            {...props}
            label={label}
            description={description}
            isRequired={isRequired}
            maxEdge={maxEdge}
            quality={quality}
            maxBytes={maxBytes}
          />
        </Suspense>
      );
    },
    defaultValue() {
      return null;
    },
    // filename / parse / serialize are byte-for-byte the fields.image behaviour
    // so stored values and on-disk asset paths are identical.
    filename(value, args) {
      if (typeof value === 'string') {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value: FormFieldStoredValue, args) {
      if (value === undefined) return null;
      if (typeof value !== 'string') throw new Error('Must be a string');
      if (args.asset === undefined) return null;
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: value.match(/\.([^.]+$)/)?.[1] ?? '',
      };
    },
    validate(value) {
      if (value === null) {
        if (isRequired) throw new Error(`${label} is required`);
        return null as Nullable;
      }
      // The upload handler never lets an oversized result into the form state,
      // but this is the gate Keystatic runs on save, so enforce it here too.
      // Images that were already committed (no meta) are deliberately exempt
      // so editing other fields of an old entry is never blocked.
      if (value.meta && value.data.byteLength > maxBytes) {
        throw new Error(`${label} must be ${formatBytes(maxBytes)} or smaller after compression`);
      }
      return value;
    },
    serialize(value, args) {
      if (value === null) return { value: undefined, asset: undefined };
      const filename = args.suggestedFilenamePrefix
        ? `${args.suggestedFilenamePrefix}.${value.extension}`
        : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: { filename, content: value.data },
      };
    },
    directory: directory ? fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) throw new Error('Must be a string');
        const val = value === undefined ? null : value;
        if (val === null && isRequired) throw new Error(`${label} is required`);
        return val as string | Nullable;
      },
    },
  };
}
