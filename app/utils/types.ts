// types.ts
export interface ProductItem {
  productId: string;
  productTitle: string;
  productDesc: string;
  productImage: string[]; // مصفوفة تدعم صورة واحدة أو أكثر
}

export type CardStatus = "active" | "adjacent" | "distant";

export type FeedbackCardProps = {
    avatar?: string,
    name?: string,
    desc?: string,
    content?: string
}