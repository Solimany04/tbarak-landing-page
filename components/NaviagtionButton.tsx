"use client"

import React from 'react'
import { Button } from './ui/button'
import { scrollToNextSection } from '@/lib/actions/scrollToNextSection'
import { ButtonVariants, ButtonSizes } from '@/app/utils/types'

const NaviagtionButton = ({classes, variant, navID, content, size}: {classes: string, variant: ButtonVariants, navID: string, content: string, size: ButtonSizes}) => {
  return (
    <Button variant={variant} size={size} className={classes} onClick={() => scrollToNextSection(`${navID}`)}>
      {content}
    </Button>
  )
}

export default NaviagtionButton
