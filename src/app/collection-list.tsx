'use client'
import TypographyP from '@/components/ui/typography-p'
import { useQueryState } from 'nuqs'
import useIsClient from '../hooks/useIsClient'
import useHypersomniaStore from '../zustand/hypersomnia-store'
import Collection from './collection'
import CreateCollection from './create-collection'
import { Search } from 'lucide-react'
import ClearableInput from '@/components/ui/clearable-input'

const CollectionList = () => {
  const collections = useHypersomniaStore((state) => state.collections)

  const [filter, setFilter] = useQueryState(`qc`, {
    throttleMs: 200,
  })
  const isClient = useIsClient()

  const filteredCollections = collections.filter((collection) =>
    filter
      ? collection.title.toLowerCase().includes(filter.toLowerCase())
      : true,
  )

  return (
    <>
      <div className="flex flex-col-reverse sm:flex-row gap-4 pb-4">
        <div className="flex w-full items-center bg-card rounded-md border border-input ring-ring ring-offset-background focus-within:ring-2 focus-within:ring-offset-2">
          <label
            htmlFor="collection-filter"
            className="flex-shrink-0 pl-2 pr-1"
          >
            <span className="sr-only">Search for blog post</span>
            <Search />
          </label>
          <ClearableInput
            value={filter ?? ''}
            onChange={(e) => setFilter(e.target.value || null)}
            className="flex h-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full p-2 bg-card flex-1 border-none focus-visible:ring-0"
            id="collection-filter"
            placeholder="Filter"
          />
        </div>
        <CreateCollection />
      </div>
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

export default CollectionList
