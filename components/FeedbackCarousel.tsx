"use client"

import React from 'react'
import FeedbackCard from './FeedbackCard'
import { FeedbackCardProps } from '@/app/utils/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import AutoScroll from "embla-carousel-auto-scroll"


const FeedbackCarousel = ({ dummyFeedbacks }: { dummyFeedbacks: FeedbackCardProps[] }) => {
    const plugin = React.useRef(
        AutoScroll({
          playOnInit: true,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          speed: 3,
          startDelay: 0,
        })
    );

    return (
        <Carousel
          opts={{
            direction: "rtl",
            loop: true,
            align: "start",
            watchDrag: false,
          }}
          plugins={[plugin.current]}
          className="w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
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