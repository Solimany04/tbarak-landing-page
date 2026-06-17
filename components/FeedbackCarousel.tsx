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


const FeedbackCarousel = ({ dummyFeedbacks }: {dummyFeedbacks: FeedbackCardProps[]}) => {
    return (
        <Carousel
          opts={{
            direction: "rtl",
            loop: true,
            align: "start",
            watchDrag: false,
          }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              speed: 4,
              startDelay: 0,
            }),
          ]}
          className="w-full"
          dir="rtl"
        >
          <CarouselContent className="-ms-14">
            {dummyFeedbacks.map((fb, idx) => (
              <CarouselItem key={idx} className="ps-14 basis-[auto] cursor-auto">
                <FeedbackCard avatar={fb.avatar} name={fb.name} desc={fb.desc} content={fb.content} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
    );
}

export default FeedbackCarousel