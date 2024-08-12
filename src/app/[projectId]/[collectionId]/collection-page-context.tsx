'use client'

import { getCookies } from '@/lib/utils'
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
  const project = useHypersomniaStore((state) => state.selectedProject)

  const selectProject = useHypersomniaStore((state) => state.selectProject)
  const selectCollection = useHypersomniaStore(
    (state) => state.selectCollection,
  )

  const setCookies = useHypersomniaStore((state) => state.setCookies)

  useEffect(() => {
    selectProject(params.projectId)
    useHypersomniaStore.setState((state) => ({
      requestFetchResult: {
        ...state.requestFetchResult,
        loading: false,
      },
    }))
  }, [params.projectId, selectProject])

  useEffect(() => {
    if (project) {
      selectCollection(params.collectionId)
    }
  }, [params.collectionId, project, selectCollection])

  useEffect(() => {
    setCookies(getCookies())
  }, [setCookies])

  return children
}

export default CollectionPageContext
