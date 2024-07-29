'use client'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import ReadOnlyEditor from '@/components/ui/panel/read-only-editor'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import {
  cn,
  getBodyData,
  getRequestWithQueryParams,
  getStatusColor,
  httpStatusCodes,
} from '@/lib/utils'
import { BodyTypeText } from '@/types/collection'
import useCollectionContext from '@/zustand/collection-store'
import { useEffect } from 'react'

interface BodyDataType {
  text: string
  type: BodyTypeText | 'html'
}

const getDataText = (data: unknown): BodyDataType | undefined => {
  if (typeof data === 'string' && data.length > 0) {
    if (data.trimStart().startsWith('<!DOCTYPE html>')) {
      return {
        text: data,
        type: 'html',
      }
    }

    return {
      text: data,
      type: 'plain-text',
    }
  }
  if (typeof data === 'object' && data) {
    return {
      text: JSON.stringify(data, null, 2),
      type: 'json',
    }
  }
}

const RequestResponsePanel = () => {
  const sendTrigger = useCollectionContext((state) => state.sendTrigger)
  const request = useCollectionContext((state) => state.selectedRequest)
  // todo: memoize values to prevent unnecessary re-renders
  const { data, response, error, loading, time, refetch } = useFetch({
    ...request,
    options: {
      ...request?.options,
      data: request ? getBodyData({ ...request }) : '',
      url: request ? getRequestWithQueryParams(request) : '',
    },
    enabled: false,
  })

  const isClient = useIsClient()

  useEffect(() => {
    if (isClient) {
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendTrigger])

  const renderPanelBody = () => {
    const dataText = getDataText(data)

    // todo: use monaco-editor to display content formatted (JSON, HTML, XML, etc)
    return (
      <div className="relative h-[80vh]">
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-background/35 z-50">
            Loading...
          </div>
        )}
        {!error && dataText && (
          <ReadOnlyEditor language={dataText.type} value={dataText.text} />
        )}
      </div>
    )
  }

  return (
    <div>
      <PanelHeaderContainer>
        {response && (
          <>
            <span
              className={cn(
                'font-semibold text-nowrap',
                getStatusColor(response.status),
              )}
            >
              {response.status} {httpStatusCodes[response.status]}
            </span>
            <span className="ml-2">{time + 'ms'}</span>
          </>
        )}
      </PanelHeaderContainer>
      {renderPanelBody()}
    </div>
  )
}

export default RequestResponsePanel
