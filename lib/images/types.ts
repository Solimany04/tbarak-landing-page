/** A source image resolved for <picture>; see components/OptimizedImage.tsx. */
export type OptimizedImageData = {
  /** Original file under /public: the <img src> fallback. */
  src: string;
  /** Intrinsic size (after EXIF rotation), for width/height attributes. */
  width?: number;
  height?: number;
  /** srcset strings ("url 640w, url 1080w"); empty when there are no variants. */
  avif: string;
  webp: string;
};
