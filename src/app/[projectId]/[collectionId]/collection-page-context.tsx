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
  const selectedProject = useHypersomniaStore((state) => state.selectedProject)
  const selectProject = useHypersomniaStore((state) => state.selectProject)

  useEffect(() => {
    selectProject(params.projectId)
  }, [params.projectId, selectProject])

  const collection =
    useHypersomniaStore((state) =>
      state.selectedProject?.collections.find(
        (collection) => collection.id === params.collectionId,
      ),
    ) ?? null

  return (
    <CollectionProvider project={selectedProject} collection={collection}>
      {children}
    </CollectionProvider>
  )
}

export default CollectionPageContext
