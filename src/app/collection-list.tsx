'use client'
import Collection from './collection'
import useCollectionsStore from '../zustand/collections-store'
import TypographyP from '@/components/ui/typography-p'
import useIsClient from '../hooks/useIsClient'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useQueryState } from 'nuqs'
import useHypersomniaStore from '../zustand/hypersomnia-store'
import { useEffect } from 'react'

const CollectionList = () => {
  const collections = useCollectionsStore((state) => state.collections)
  const selectedProject = useHypersomniaStore((state) => state.selectedProject)

  const [filter, setFilter] = useQueryState(`qc`)
  const isClient = useIsClient()

  useEffect(() => {
    if (selectedProject && isClient) {
      setFilter(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, setFilter])

  const filteredCollections = filter
    ? collections.filter((collection) =>
        collection.title.toLowerCase().includes(filter.toLowerCase()),
      )
    : collections

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
