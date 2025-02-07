import React from 'react'
import { Collection as CollectionType } from '../types/collection'
import { CollectionDropdownMenu } from './collection-dropdown-menu'
import Link from 'next/link'

interface CollectionProps {
  collection: CollectionType
}

const Collection = ({ collection }: CollectionProps) => {
  return (
    <div className="relative">
      <CollectionDropdownMenu collection={collection} />
      <Link href={`/${collection.id}`} className="group">
        <article className="h-40 border rounded-md p-4">
          <header className="pr-8 text-lg break-all group-hover:underline group-focus:underline">
            {collection.title}
          </header>
        </article>
      </Link>
    </div>
  )
}

export default Collection
