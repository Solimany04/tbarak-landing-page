"use client"

import React from 'react'
import FeedbackCard from './FeedbackCard'
import { FeedbackCardProps } from '@/app/utils/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import AutoScroll from "embla-carousel-auto-scroll"
import { useInViewport, usePrefersReducedMotion } from '@/lib/hooks/useMotionPreferences'


const FeedbackCarousel = ({ dummyFeedbacks }: { dummyFeedbacks: FeedbackCardProps[] }) => {
    const plugin = React.useRef(
        AutoScroll({
          playOnInit: false,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          speed: 3,
          startDelay: 0,
        })
    );
    const [api, setApi] = React.useState<CarouselApi>();
    const reducedMotion = usePrefersReducedMotion();
    const inViewport = useInViewport(api?.rootNode());

    // Scroll only while the section is on screen, and never for visitors who
    // asked for reduced motion; they can drag through the cards instead.
    // `api` is set once embla (and so the plugin) has initialised.
    React.useEffect(() => {
        if (!api) return;
        const autoScroll = plugin.current;
        if (inViewport && !reducedMotion) autoScroll.play();
        else autoScroll.stop();
    }, [api, inViewport, reducedMotion]);

    return (
        <Carousel
          setApi={setApi}
          opts={{
            direction: "rtl",
            loop: true,
            align: "start",
            watchDrag: reducedMotion,
          }}
          plugins={[plugin.current]}
          className="w-full [mask-image:linear-gradient(to_right,transparent,black_2.5%,black_97.5%,transparent)]"
          dir="rtl"
        >
          <CarouselContent className="-ms-14">
            {dummyFeedbacks.map((fb, idx) => (
              <CarouselItem key={idx} className="ps-14 basis-auto cursor-auto">
                <FeedbackCard avatar={fb.avatar} name={fb.name} desc={fb.desc} content={fb.content} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
    );
}

export default FeedbackCarousel