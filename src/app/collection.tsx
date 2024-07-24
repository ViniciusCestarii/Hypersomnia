import TypographyH2 from '@/components/ui/typography-h2'
import React from 'react'
import TypographyP from '@/components/ui/typography-p'
import { Collection as CollectionType } from '../types/collection'
import { DropdownMenuDemo } from './collection-dropdown-menu'
import Link from 'next/link'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

interface CollectionProps {
  collection: CollectionType
}

const Collection = ({ collection }: CollectionProps) => {
  const selectedProject = useHypersomniaStore((state) => state.selectedProject)

  if (!selectedProject) {
    return null
  }

  return (
    <article>
      <header className="flex justify-between items-center">
        <Link
          href={`/${selectedProject.id}/${collection.id}`}
          className="hover:underline focus:underline"
        >
          <TypographyH2 className="border-0 pb-0">
            {collection.title}
          </TypographyH2>
        </Link>
        <DropdownMenuDemo />
      </header>
      <TypographyP>{collection.description}</TypographyP>
    </article>
  )
}

export default Collection
