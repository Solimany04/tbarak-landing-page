import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

type ProductCardProps = {
  title: string;
  desc: string;
  image: string;
  size: string;
};

const ProductCard = ({ title, desc, image, size }: ProductCardProps) => {
  return (
    <div className="h-full w-full">
      <Card
        className={`relative mx-auto flex flex-col h-full w-full max-w-[324px] pt-0 ${size} {/*w-73 md:w-81*/}`}
      >
        <div className="absolute inset-0 z-30 aspect-video" />
        <div className="relative w-full flex-1 min-h-[80px]">
          <Image
            width={500}
            height={500}
            src={image}
            alt=""
            className="relative z-20 aspect-video w-full object-cover rounded-t-4xl"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="shrink-0">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className=" font-normal || hover:shadow-[inset_0_0_0_1px_black] hover:bg-white hover:text-primary ">
              احصل عليه الآن
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;
