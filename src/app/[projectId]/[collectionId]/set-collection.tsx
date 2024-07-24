'use client'
import useCollectionStore from '@/zustand/collection-store'
import { useEffect } from 'react'
import { ApiToolProps } from './page'

const SetCollection = ({ params }: ApiToolProps) => {
  const selectCollection = useCollectionStore((state) => state.selectCollection)

  useEffect(() => {
    selectCollection(params.collectionId)
  })
  return null
}

export default SetCollection
