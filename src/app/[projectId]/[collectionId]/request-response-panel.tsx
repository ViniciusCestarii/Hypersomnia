'use client'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import { cn, getStatusColor } from '@/lib/utils'
import { Request } from '@/types/collection'
import useCollectionContext from '@/zustand/collection-store'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const fetchRequestData = async (request: Request) => {
  const initialTime = performance.now()
  const response = await fetch(request.url, request.options)
  const finalTime = performance.now() - initialTime - 1

  const dataReturn = {
    response,
    json: await response.json(),
    time: finalTime.toFixed(0),
  }

  return dataReturn
}

const RequestResponsePanel = () => {
  const sendTrigger = useCollectionContext((state) => state.sendTrigger)
  const request = useCollectionContext((state) => state.selectedRequest)

  const { data, response, error, loading, time, refetch } = useFetch({
    ...request,
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
    if (error) {
      return <div>Error fetching data: {error.message}</div>
    }

    const jsonText = data ? JSON.stringify(data, null, 2) : null

    return (
      <ScrollArea type="auto" className="h-[800px] relative pr-4">
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-background/35">
            Loading...
          </div>
        )}
        {jsonText && (
          <ClipboardButton
            label="Copy JSON"
            text={jsonText}
            className="absolute top-1 right-2 bg-background"
          />
        )}
        {jsonText && <pre className="text-xs pr-2">{jsonText}</pre>}
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
              className={cn('font-semibold', getStatusColor(response.status))}
            >
              {response.status}
            </span>
            <span className="ml-2">{response.statusText}</span>
            <span className="ml-2">{time + 'ms'}</span>
          </>
        )}
      </PanelHeaderContainer>
      {renderPanelBody()}
    </div>
  )
}

export default RequestResponsePanel
