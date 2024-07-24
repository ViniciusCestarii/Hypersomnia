'use client'
import TypographyH2 from '@/components/ui/typography-h2'
import Collection from './collection'
import useCollectionStore from '../zustand/collection-store'
import TypographyP from '@/components/ui/typography-p'
import useIsClient from '../hooks/useIsClient'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Suspense } from 'react'
import { useQueryState } from 'nuqs'
import useHypersomniaStore from '../zustand/hypersomnia-store'

const CollectionSection = () => {
  return (
    <section>
      <TypographyH2>Collections</TypographyH2>
      <Suspense>
        <CollectionList />
      </Suspense>
    </section>
  )
}

const CollectionList = () => {
  const collections = useCollectionStore((state) => state.collections)
  const selectedProject = useHypersomniaStore((state) => state.selectedProject)

  const [filter, setFilter] = useQueryState(`qc-${selectedProject?.id}`)

  const filteredCollections = filter
    ? collections.filter((collection) =>
        collection.title.toLowerCase().includes(filter.toLowerCase()),
      )
    : collections

  const isClient = useIsClient()
  return (
    <>
      <Label className="sr-only" htmlFor="collection-filter">
        Filter
      </Label>
      <Input
        id="collection-filter"
        type="search"
        placeholder="Filter"
        value={filter ?? ''}
        onChange={({ target }) =>
          setFilter(target.value.length ? target.value : null)
        }
      />{' '}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCollections.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
        {filteredCollections.length === 0 && isClient && (
          <TypographyP>No collections found</TypographyP>
        )}
      </div>
    </>
  )
}

export default CollectionSection
