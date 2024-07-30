'use client'
import Editor from '@/components/ui/panel/editor'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import {
  cn,
  formatHtmlContent,
  getBodyData,
  getRequestWithQueryParams,
  getStatusColor,
  httpStatusCodes,
} from '@/lib/utils'
import { BodyTypeText } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { useEffect } from 'react'

interface BodyDataType {
  text: string
  type: BodyTypeText | 'html'
}

const getDataText = (data: unknown): BodyDataType | undefined => {
  if (typeof data === 'string' && data.length > 0) {
    if (data.trimStart().startsWith('<!DOCTYPE html>')) {
      return {
        text: formatHtmlContent(data),
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
  const sendTrigger = useHypersomniaStore((state) => state.sendTrigger)
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const { data, time, response, error, loading } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}
  // todo: memoize values to prevent unnecessary re-renders
  const refetch = useFetch({
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
    if (isClient && typeof sendTrigger !== 'undefined') {
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
          <Editor
            language={dataText.type}
            value={dataText.text}
            options={{
              readOnly: true,
              domReadOnly: true,
            }}
          />
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
