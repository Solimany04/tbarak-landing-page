// types.ts
import type React from "react";

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

export type ButtonVariants = "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "heroOutline" | "heroSecondary" | "navSecondary" | "clean" | null | undefined
export type ButtonSizes = "xs" | "sm" | "default" | "lg" | "icon" | "hero" | null | undefined

export type NavigationButtonProps = {
    classes?: string;
    variant?: ButtonVariants;
    navID: string;
    content?: React.ReactNode;
    size?: ButtonSizes;
    productId?: string;
};
