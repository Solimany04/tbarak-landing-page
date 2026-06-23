"use client"

import React from 'react'
import { Button } from './ui/button'
import { scrollToNextSection } from '@/lib/actions/scrollToNextSection'
import { ButtonVariants, ButtonSizes, NavigationButtonProps } from '@/app/utils/types'
import { focusProduct } from '@/lib/actions/productCarouselNav'




const NaviagtionButton = ({ classes, variant, navID, content, size, productId }: NavigationButtonProps) => {
    const handleClick = () => {
        scrollToNextSection(navID);
        if (productId) focusProduct(productId);
    };

    if (variant === "clean") {
        return (
            <button type="button" className={classes} onClick={handleClick}>
                {content}
            </button>
        );
    }

    return (
        <Button variant={variant} size={size} className={classes} onClick={handleClick}>
            {content}
        </Button>
    );
};

export default NaviagtionButton;
