"use client";


import { ProductCarousel } from "../ProductCarousel";
import { ProductItem } from "@/app/utils/types";

const Products = () => {
  const productsList: ProductItem[] = [
    {
      productId: "1",
      productTitle: "برسولا قطن",
      productDesc:
        "قطن براسولا عالي الجودة بملمس ناعم ولمعان طبيعي، مثالي لتصنيع الملابس و يتميز بثبات الألوان.",
      productImage: ["/Products/Picture 1.png"],
    },
    {
      productId: "2",
      productTitle: "سينجل ليكرا قطن",
      productDesc:
        "قماش سينجل ليكرا خفيف ومرن، يجمع بين الراحة والانسيابية، مثالي للملابس اليومية والرياضية.",
      productImage: ["/Products/Picture 2.png"],
    },
    {
      productId: "3",
      productTitle: "قماش بيكا",
      productDesc:
        "بيكا يجمع بين المتانة والتهوية الجيدة بفضل نسيجه المميز، ما يجعله خيارًا مثاليًا للملابس المريحة والأنيقة.",
      productImage: ["/Products/Picture 3.png", "/Products/Picture 4.png"],
    },
    {
      productId: "4",
      productTitle: "سمر ميلتون",
      productDesc:
        "سمر ميلتون يمنحك مظهرًا أنيقًا بفضل كثافته ونعومته، مع متانة تدعم الاستخدام الطويل.",
      productImage: ["/Products/Picture 4.png"],
    },
    {
      productId: "5",
      productTitle: "انترلوك",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 5.png"],
    },
    {
      productId: "6",
      productTitle: "انترلوك 2",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 6.png"],
    },
    {
      productId: "7",
      productTitle: "انترلوك 3",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 7.png"],
    },
    {
      productId: "8",
      productTitle: "انترلوك 4",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 8.png"],
    },
    {
      productId: "9",
      productTitle: "انترلوك 5",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 9.png"],
    },
    {
      productId: "10",
      productTitle: "انترلوك 6",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: ["/Products/Picture 10.png"],
    },
  ];

  type ProductsListType = {
    productId: number,
    productTitle: string,
    productDesc: string,
    productImage: string,
  }[]
  const size = "";
  return (
    <div className=" w-full overflow-hidden mb-16">
      <h1 className=" font-semibold text-5xl mx-auto my-16 w-fit">
        منتجات <span className="text-secondary">تبارك</span>
      </h1>
      <ProductCarousel items={productsList} dir="rtl" />
    </div>
  );
};

export default Products;
