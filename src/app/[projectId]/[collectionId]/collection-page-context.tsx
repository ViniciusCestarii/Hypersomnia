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
  useEffect(() => {
    useHypersomniaStore.getState().selectProject(params.projectId)
    useHypersomniaStore.setState((state) => ({
      requestFetchResult: {
        ...state.requestFetchResult,
        loading: false,
      },
    }))
  }, [params.projectId])

  useEffect(() => {
    if (useHypersomniaStore.getState().selectedProject) {
      useHypersomniaStore.getState().selectCollection(params.collectionId)
      useHypersomniaStore.getState().setIsReady(true)
    }
  }, [params.collectionId])

  useEffect(() => {
    useHypersomniaStore.getState().setCookies(getCookies())
  }, [])

  return children
}

export default CollectionPageContext
