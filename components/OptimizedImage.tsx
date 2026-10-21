import type { CSSProperties } from "react";
import { preload } from "react-dom";
import type { OptimizedImageData } from "@/lib/images/types";

/* <picture> with AVIF and WebP srcsets from scripts/optimize-images.mjs and
   the original file as the <img> fallback. Server components resolve the data
   with getImage() from lib/images; client components receive it as props.

   No hooks, so it renders on either side. The <picture> is display:contents:
   classes and positioning on the <img> behave exactly as on a bare <img>
   (grid placement, absolute fill, object-cover). */

type ArtDirection = {
  /** Used instead of `image` while `media` matches. */
  image: OptimizedImageData;
  media: string;
  sizes: string;
};

type OptimizedImageProps = {
  image: OptimizedImageData;
  alt: string;
  /** Rendered CSS width, so the browser can pick a srcset candidate. */
  sizes: string;
  art?: ArtDirection;
  /** LCP image: eager, fetchpriority=high and preloaded from <head>. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  "aria-hidden"?: boolean;
};

/* Preloads the srcset the browser will pick from: AVIF when the image has it
   (type=image/avif makes a browser without AVIF skip the hint rather than
   fetch twice), else WebP. */
function preloadImage(image: OptimizedImageData, sizes: string, media?: string) {
  const [srcSet, type] = image.avif ? [image.avif, "image/avif"] : [image.webp, "image/webp"];
  if (!srcSet) {
    preload(image.src, { as: "image", fetchPriority: "high", media });
    return;
  }
  preload(image.src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, type, media, fetchPriority: "high" });
}

export function OptimizedImage({
  image,
  alt,
  sizes,
  art,
  priority = false,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  if (priority) {
    // One preload per media range, matching the <source> the browser will pick.
    if (art) preloadImage(art.image, art.sizes, art.media);
    preloadImage(image, sizes, art ? `not all and ${art.media}` : undefined);
  }

  return (
    <picture className="contents">
      {art?.image.avif && <source media={art.media} type="image/avif" srcSet={art.image.avif} sizes={art.sizes} />}
      {art?.image.webp && <source media={art.media} type="image/webp" srcSet={art.image.webp} sizes={art.sizes} />}
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
      <img
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? undefined : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={style}
        {...rest}
      />
    </picture>
  );
}
