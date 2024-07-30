'use client'

import { CollectionProvider } from '@/zustand/collection-store'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import React, { useEffect } from 'react'
import { ApiToolProps } from './page'

interface CollectionPageContextProps extends ApiToolProps {
  children: React.ReactNode
}

const CollectionPageContext = ({
  params,
  children,
}: CollectionPageContextProps) => {
  const selectProject = useHypersomniaStore((state) => state.selectProject)
  const collection =
    useHypersomniaStore((state) =>
      state.selectedProject?.collections.find(
        (collection) => collection.id === params.collectionId,
      ),
    ) ?? null

  useEffect(() => {
    selectProject(params.projectId)
  }, [params.projectId, selectProject])

  useEffect(() => {
    if (collection) {
      useHypersomniaStore.setState({ selectedCollection: collection })
    }
  }, [collection])

  return children
}

export default CollectionPageContext
