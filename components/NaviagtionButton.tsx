"use client"

import React from 'react'
import { Button } from './ui/button'
import { scrollToNextSection } from '@/lib/actions/scrollToNextSection'
import { ButtonVariants, ButtonSizes } from '@/app/utils/types'

const NaviagtionButton = ({ classes, variant, navID, content, size }: { classes: string, variant: ButtonVariants, navID: string, content: string, size: ButtonSizes }) => {
    if (variant == "clean") {
        return (
            <button type='button' className={classes} onClick={() => scrollToNextSection(`${navID}`)}>
                {content}
            </button>
        )
    }
    else {
        return (
            <Button variant={variant} size={size} className={classes} onClick={() => scrollToNextSection(`${navID}`)}>
                {content}
            </Button>
        )
    }
}

export default NaviagtionButton
