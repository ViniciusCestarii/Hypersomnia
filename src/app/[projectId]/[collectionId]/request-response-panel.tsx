'use client'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import {
  cn,
  getBodyData,
  getRequestWithQueryParams,
  getStatusColor,
  httpStatusCodes,
} from '@/lib/utils'
import useCollectionContext from '@/zustand/collection-store'
import { useEffect } from 'react'

const noContent = 'No content'

const getDataText = (data: unknown) => {
  if (typeof data === 'string' && data.length > 0) {
    return JSON.stringify(data, null, 2)
  }
  if (typeof data === 'object' && data) {
    return JSON.stringify(data, null, 2)
  }
  return noContent
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
    const jsonText = getDataText(data)

    // todo: use monaco-editor to display content formatted (JSON, HTML, XML, etc)

    return (
      <ScrollArea type="auto" className="h-[800px] relative pr-4">
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-background/35">
            Loading...
          </div>
        )}
        {!error && jsonText && jsonText !== noContent && (
          <ClipboardButton
            label="copy content"
            text={jsonText}
            className="absolute top-1 right-2 bg-background"
          />
        )}
        {error && <span>Error fetching data: {error.message}</span>}
        {!error && jsonText && <pre className="text-xs pr-2">{jsonText}</pre>}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
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
