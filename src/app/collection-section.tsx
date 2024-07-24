import TypographyH2 from '@/components/ui/typography-h2'
import { Suspense } from 'react'
import CollectionList from './collection-list'

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

export default CollectionSection
