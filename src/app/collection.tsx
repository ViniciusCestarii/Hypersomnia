import TypographyH2 from '@/components/ui/typography-h2'
import React from 'react'
import TypographyP from '@/components/ui/typography-p'
import { Collection as CollectionType } from './types/collection'

interface CollectionProps {
  collection: CollectionType
}

const Collection = ({ collection }: CollectionProps) => {
  return (
    <article>
      <TypographyH2 className="border-0 pb-0">{collection.title}</TypographyH2>
      <TypographyP>{collection.description}</TypographyP>
    </article>
  )
}

export default Collection
