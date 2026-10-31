import React from 'react'

import { Container } from './Container'
import { Heading } from './Heading'

/** Small page title band (WoodMart "title-size-small"): 44/36/28px, 20px padding (15px below 1025px). */
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-[15px] lg:py-5">
      {typeof children === 'string' ? (
        <Heading as="h1" size="page">
          {children}
        </Heading>
      ) : (
        children
      )}
    </Container>
  )
}
