/**
 * Browser-only image compression for Keystatic admin uploads.
 *
 * Everything happens client-side with a <canvas> so it works on Keystatic
 * Cloud's free tier and on static hosting — no image service, no server step.
 * The bytes returned here are exactly what Keystatic commits to the repo.
 *
 * compressImage() touches DOM APIs (Image, canvas, URL.createObjectURL) when
 * CALLED, but nothing here runs at module scope, so the module itself is safe
 * to import from code that is also evaluated on the server (the field
 * definition imports formatBytes). Only call compressImage from the admin UI.
 */

export type CompressOptions = {
  /** Longest-edge cap in px. Images already within it are not resized. */
  maxEdge: number;
  /** Encoder quality (0–1) for lossy formats (WebP / JPEG). */
  quality: number;
};

export type CompressResult = {
  blob: Blob;
  /** File extension (no dot) matching `blob.type`. */
  extension: string;
  /** Output pixel size. Unknown for pass-through SVGs. */
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  /** Whether the longest edge was scaled down to `maxEdge`. */
  resized: boolean;
  /**
   * How the output was produced:
   * - `webp`      converted via canvas.toBlob('image/webp')
   * - `fallback`  WebP unsupported; re-encoded in the original format
   * - `original`  original bytes kept untouched (SVG, or already smaller
   *               than the re-encoded result and no resize was needed)
   */
  outcome: 'webp' | 'fallback' | 'original';
};

const MIME_TO_EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
};

/** Formats every current browser can render in <img>; anything else (HEIC, TIFF…) must be converted. */
const WEB_SAFE = new Set(['image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif']);

export function extensionForMime(mime: string, fallback: string): string {
  return MIME_TO_EXT[mime] ?? fallback;
}

export function extensionOf(filename: string): string {
  return filename.match(/\.([^.]+)$/)?.[1]?.toLowerCase() ?? '';
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type Decoded = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release(): void;
};

/**
 * Decode a File into something drawImage() accepts. Prefers createImageBitmap
 * (off-main-thread, honours EXIF orientation) and falls back to <img>, which
 * modern browsers also orient from EXIF.
 */
async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Unsupported container for createImageBitmap — try <img> below.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('The browser could not decode this image.'));
      el.src = url;
    });
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => {} };
  } finally {
    // The element keeps its decoded bitmap after load; the URL is no longer needed.
    URL.revokeObjectURL(url);
  }
}

/** canvas.toBlob returns a PNG when the type is unsupported, so verify the type. */
function encode(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => resolve(blob && blob.type === type ? blob : null), type, quality);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Resize (longest edge ≤ maxEdge) and convert to WebP. If the browser cannot
 * encode WebP, the resized image is re-encoded in its original format instead
 * (canvas only guarantees PNG and JPEG, so other rasters become PNG). SVGs are
 * passed through untouched — rasterising a vector would only lose quality.
 */
export async function compressImage(file: File, opts: CompressOptions): Promise<CompressResult> {
  if (file.type === 'image/svg+xml') {
    return { blob: file, extension: 'svg', resized: false, outcome: 'original' };
  }

  const decoded = await decode(file);
  const { width: originalWidth, height: originalHeight } = decoded;
  if (!originalWidth || !originalHeight) {
    decoded.release();
    throw new Error('The browser could not decode this image.');
  }

  const scale = Math.min(1, opts.maxEdge / Math.max(originalWidth, originalHeight));
  const width = Math.max(1, Math.round(originalWidth * scale));
  const height = Math.max(1, Math.round(originalHeight * scale));
  const resized = scale < 1;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    decoded.release();
    throw new Error('Canvas is unavailable in this browser.');
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(decoded.source, 0, 0, width, height);
  decoded.release();

  const dims = { width, height, originalWidth, originalHeight, resized };

  let encoded = await encode(canvas, 'image/webp', opts.quality);
  let outcome: CompressResult['outcome'] = 'webp';
  if (!encoded) {
    const fallbackType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    encoded = await encode(canvas, fallbackType, opts.quality);
    outcome = 'fallback';
  }

  // Nothing usable came out of the canvas — keep the upload as-is rather than
  // dropping it. (Practically unreachable: PNG encoding is mandatory.)
  if (!encoded) {
    return { blob: file, extension: extensionOf(file.name), ...dims, resized: false, outcome: 'original' };
  }

  // Re-encoding can inflate an already well-compressed file. When no resize was
  // needed and the original is smaller, committing the original wins.
  if (!resized && WEB_SAFE.has(file.type) && file.size <= encoded.size) {
    return {
      blob: file,
      extension: extensionForMime(file.type, extensionOf(file.name)),
      ...dims,
      outcome: 'original',
    };
  }

  return { blob: encoded, extension: extensionForMime(encoded.type, 'png'), ...dims, outcome };
}
