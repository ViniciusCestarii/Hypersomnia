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
    useHypersomniaStore.setState((state) => ({
      requestFetchResult: {
        ...state.requestFetchResult,
        loading: false,
      },
    }))

    const state = useHypersomniaStore.getState()

    const oldCollectionId = state.selectedCollection?.id

    if (oldCollectionId !== params.collectionId) {
      state.selectCollection(params.collectionId)
      state.selectRequest([])
      state.setRequestFetchResult(null)
    }

    state.setIsReady(true)
  }, [params.collectionId])

  useEffect(() => {
    useHypersomniaStore.getState().setCookies(getCookies())
  }, [])

  return children
}

export default CollectionPageContext
