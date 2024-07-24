'use client'
import TypographyH2 from '@/components/ui/typography-h2'
import Collection from './collection'
import useCollectionStore from './zustand/collection-store'
import TypographyP from '@/components/ui/typography-p'
import useIsClient from './hooks/useIsClient'

const CollectionGrid = () => {
  const collections = useCollectionStore((state) => state.collections)

  const isClient = useIsClient()

  return (
    <section>
      <TypographyH2>Collections</TypographyH2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
        {collections.length === 0 && isClient && (
          <TypographyP>No collections found</TypographyP>
        )}
      </div>
    </section>
  )
}

export default CollectionGrid
