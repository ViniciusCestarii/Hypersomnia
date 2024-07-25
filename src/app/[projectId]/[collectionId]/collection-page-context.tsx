'use client'

import { CollectionProvider } from '@/zustand/collection-store'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import React, { useEffect } from 'react'
import { ApiToolProps } from './page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface CollectionPageContextProps extends ApiToolProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
      <CollectionProvider project={selectedProject} collection={collection}>
        {children}
      </CollectionProvider>
    </QueryClientProvider>
  )
}

export default CollectionPageContext
