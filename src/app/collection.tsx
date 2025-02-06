import TypographyH2 from '@/components/ui/typography-h2'
import React from 'react'
import TypographyP from '@/components/ui/typography-p'
import { Collection as CollectionType } from '../types/collection'
import { CollectionDropdownMenu } from './collection-dropdown-menu'
import Link from 'next/link'

interface CollectionProps {
  collection: CollectionType
}

const Collection = ({ collection }: CollectionProps) => {
  return (
    <article>
      <header className="flex justify-between">
        <Link
          href={`/${collection.id}`}
          className="hover:underline focus:underline"
        >
          <TypographyH2 className="border-0 pb-0 break-all">
            {collection.title}
          </TypographyH2>
        </Link>
        <CollectionDropdownMenu collection={collection} />
      </header>
      <TypographyP>{collection.description}</TypographyP>
    </article>
  )
}

export default Collection
