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
import { Button } from "./button";
import Image from "next/image";

type ProductCardProps = {
  title: string;
  desc: string;
  image: string;
  size: string;
};

const ProductCard = ({ title, desc , image, size }: ProductCardProps) => {
  return (
    <div>
      <Card className={`relative mx-auto h-118 w-73 md:w-81 max-w-sm pt-0 ${size}`}>
        <div className="absolute inset-0 z-30 aspect-video" />
        <Image
          width={500}
          height={500}
          src={image}
          alt=""
          className="relative z-20 aspect-video h-72 w-full object-cover rounded-t-4xl"
        />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className=" font-normal || hover:shadow-[inset_0_0_0_1px_black] hover:bg-white hover:text-primary ">
            احصل عليه الآن
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;
