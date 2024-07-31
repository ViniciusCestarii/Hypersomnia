'use client'

import useHypersomniaStore from '@/zustand/hypersomnia-store'
import React, { useEffect } from 'react'
import { ApiToolProps } from './page'
import { findFileByPath, getCookies } from '@/lib/utils'

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
  const selectCollection = useHypersomniaStore(
    (state) => state.selectCollection,
  )
  const selectedRequestPath = useHypersomniaStore(
    (state) => state.selectedRequestPath,
  )
  const setCookies = useHypersomniaStore((state) => state.setCookies)

  useEffect(() => {
    selectProject(params.projectId)
  }, [params.projectId, selectProject])

  useEffect(() => {
    if (collection) {
      selectCollection(collection.id)
    }

    if (selectedRequestPath) {
      const fileRequest = findFileByPath(
        collection?.fileSystem ?? [],
        selectedRequestPath,
      )
      if (fileRequest) {
        useHypersomniaStore.setState({ selectedRequest: fileRequest.request })
      } else {
        useHypersomniaStore.setState({ selectedRequest: null })
      }
    }
  }, [collection, selectCollection, selectedRequestPath])

  useEffect(() => {
    setCookies(getCookies())
  }, [setCookies])

  return children
}

export default CollectionPageContext
