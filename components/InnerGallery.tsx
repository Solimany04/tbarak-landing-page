import React, { useState, useRef, useEffect, UIEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface InnerGalleryProps {
  images: string[];
  isActive: boolean;
  zoomed?: boolean;
}

export const InnerGallery: React.FC<InnerGalleryProps> = ({ images, isActive, zoomed = false }) => {
  const [currentPic, setCurrentPic] = useState(0);
  const [fadeOverlay, setFadeOverlay] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const isTransitioning = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const dragDistance = useRef(0);

  const N = images.length;

  // Scale is contained by the parent's overflow-hidden frame; the parent owns the toggle
  const zoomClasses = cn("transition-transform duration-200 ease-out origin-center", zoomed && "scale-200");

  useEffect(() => {
    if (!isActive) {
      setCurrentPic(0);
      return;
    }
    
    // Initialize scroll position to the first real image (index 2)
    const container = scrollContainerRef.current;
    if (container) {
      setTimeout(() => {
        if (!container) return;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = 2 * container.clientWidth;
        setTimeout(() => {
          if (container) container.style.scrollBehavior = "smooth";
        }, 50);
      }, 10);
    }
  }, [isActive]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.clientWidth;
    if (width === 0) return;

    const rawIndex = Math.round(container.scrollLeft / width);
    let logicalIndex = rawIndex - 2;
    logicalIndex = ((logicalIndex % N) + N) % N;

    setCurrentPic(logicalIndex);

    // Infinite loop warp logic for non-drag state (e.g. snapping, trackpad)
    if (!isDown.current) {
      if (container.scrollLeft <= width) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft += N * width;
      } else if (container.scrollLeft >= (N + 2) * width) {
        container.style.scrollBehavior = "auto";
        container.scrollLeft -= N * width;
      }
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDown.current = true;
    dragDistance.current = 0;
    if (!scrollContainerRef.current) return;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.scrollBehavior = "auto";
  };

  const onMouseLeave = () => {
    if (isDown.current) {
      isDown.current = false;
      const container = scrollContainerRef.current;
      if (container) {
        container.style.scrollBehavior = "smooth";
        const width = container.clientWidth;
        if (width > 0) {
          const index = Math.round(container.scrollLeft / width);
          container.scrollTo({ left: index * width, behavior: "smooth" });
        }
      }
    }
  };

  const onMouseUp = () => {
    if (isDown.current) {
      isDown.current = false;
      const container = scrollContainerRef.current;
      if (container) {
        container.style.scrollBehavior = "smooth";
        const width = container.clientWidth;
        if (width > 0) {
          const index = Math.round(container.scrollLeft / width);
          container.scrollTo({ left: index * width, behavior: "smooth" });
        }
      }
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    const width = container.clientWidth;
    
    const x = e.pageX - container.offsetLeft;
    dragDistance.current = Math.max(dragDistance.current, Math.abs(x - startX.current));

    const walk = (x - startX.current) * 1.5;
    let newScrollLeft = scrollLeftRef.current - walk;

    // Warp horizontally during drag to keep them in the infinite bounds
    while (newScrollLeft <= width) {
      newScrollLeft += N * width;
      scrollLeftRef.current += N * width;
    }
    while (newScrollLeft >= (N + 2) * width) {
      newScrollLeft -= N * width;
      scrollLeftRef.current -= N * width;
    }

    container.scrollLeft = newScrollLeft;
  };

  const scrollToIndex = (idx: number, mode: 'fade' | 'slide' = 'slide') => {
    if (isTransitioning.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    if (mode === 'fade') {
      isTransitioning.current = true;
      setFadeOverlay(images[currentPic]);
      setIsFading(true);

      setTimeout(() => {
        container.style.scrollBehavior = "auto";
        container.scrollTo({ left: (idx + 2) * container.clientWidth, behavior: "auto" });
        
        setTimeout(() => {
          if (container) container.style.scrollBehavior = "smooth";
        }, 50);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsFading(false);
          });
        });

        setTimeout(() => {
          setFadeOverlay(null);
          isTransitioning.current = false;
        }, 500);
      }, 0);
    } else {
      container.style.scrollBehavior = "smooth";
      container.scrollTo({ left: (idx + 2) * container.clientWidth, behavior: "smooth" });
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // A drag must not bubble up as a click, since the parent toggles zoom on click
    if (dragDistance.current >= 5) e.stopPropagation();
  };

  if (!isActive || images.length <= 1) {
    return <img src={images[0]} alt="product" className={cn("w-full h-full object-cover select-none pointer-events-none", zoomClasses)} draggable={false} />;
  }

  // Prepend 2 last images and append 2 first images for infinite loop buffer
  const extendedImages = [
    images[N - 2] || images[0],
    images[N - 1],
    ...images,
    images[0],
    images[1] || images[0]
  ];

  return (
    <div className="relative w-full h-full">
      <div className={cn("relative w-full h-full", zoomClasses)}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onClick={handleClick}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                     active:cursor-grabbing"
          dir="ltr"
        >
          {extendedImages.map((img, idx) => {
            let logicalIndex = idx - 2;
            logicalIndex = ((logicalIndex % N) + N) % N;

            return (
              <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                <img 
                  src={img} 
                  alt={`product-${logicalIndex}`} 
                  className="w-full h-full object-cover select-none pointer-events-none rounded-sm" 
                  draggable={false} 
                />
              </div>
            );
          })}
        </div>

        {fadeOverlay && (
          <div 
            className={cn(
              "absolute inset-0 z-10 transition-opacity duration-500 ease-in-out pointer-events-none",
              isFading ? "opacity-100" : "opacity-0"
            )}
          >
            <img src={fadeOverlay} alt="fade overlay" className="w-full h-full object-cover rounded-sm" />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              scrollToIndex(idx, 'slide');
            }}
            aria-label={`image ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300 cursor-pointer",
              currentPic === idx ? "bg-white w-3" : "bg-white/50 w-2 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
};