'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TypographyP from '@/components/ui/typography-p'
import { useQueryState } from 'nuqs'
import useIsClient from '../hooks/useIsClient'
import useHypersomniaStore from '../zustand/hypersomnia-store'
import Collection from './collection'

const CollectionList = () => {
  const selectedProject = useHypersomniaStore((state) => state.selectedProject)

  const [filter, setFilter] = useQueryState(`qc`)
  const isClient = useIsClient()

  const filteredCollections =
    (filter
      ? selectedProject?.collections.filter((collection) =>
          collection.title.toLowerCase().includes(filter.toLowerCase()),
        )
      : selectedProject?.collections) ?? []

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

export default CollectionList
