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

const ProductCard = () => {
  return (
    <div>
      <Card className="relative mx-auto h-118 w-73 md:w-81 max-w-sm pt-0">
        <div className="absolute inset-0 z-30 aspect-video" />
        <Image
          width={500}
          height={500}
          src="/Products/Picture 1.png"
          alt=""
          className="relative z-20 aspect-video h-72 w-full object-cover rounded-t-4xl"
        />
        <CardHeader>
          <CardTitle>براسولا قطن</CardTitle>
          <CardDescription>
            قطن براسولا عالي الجودة بملمس ناعم ولمعان طبيعي، مثالي لتصنيع
            الملابس و يتميز بثبات الألوان.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className=" font-normal || hover:shadow-[inset_0_0_0_1px_black] hover:bg-white hover:text-primary ">أحصل عليه الأن</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;
