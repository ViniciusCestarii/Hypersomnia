'use client'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import {
  cn,
  getBodyData,
  getRequestWithQueryParams,
  getStatusColor,
  httpStatusCodes,
  timeAgo,
} from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import ResponseBodyTab from './(request-response-tabs)/response-body-tab'
import ResponseHeadersTab from './(request-response-tabs)/response-headers-tab'

const RequestResponsePanel = () => {
  const sendTrigger = useHypersomniaStore((state) => state.sendTrigger)
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const { timeTaken, requestStartTime, response } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}

  const [tab, setTab] = useQueryState(
    'response-tab',
    parseAsString.withDefault('body'),
  )

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
            <span className="mx-2 text-nowrap">{timeTaken + 'ms'}</span>
            {requestStartTime && (
              <>
                <Separator orientation="vertical" className="ml-auto" />
                <TimeAgo requestStartTime={requestStartTime} />
              </>
            )}
          </>
        )}
      </PanelHeaderContainer>
      <Tabs value={tab}>
        <ScrollArea type="hover">
          <TabsList className="flex justify-start">
            <TabsTrigger value="body" onClick={() => setTab('body')}>
              body
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="min-w-[104px]"
              onClick={() => setTab('headers')}
            >
              headers (
              {response?.headers ? Object.keys(response.headers).length : 0})
            </TabsTrigger>
            <TabsTrigger value="cookies" onClick={() => setTab('cookies')}>
              cookies
            </TabsTrigger>
            <ScrollBar orientation="horizontal" />
          </TabsList>
        </ScrollArea>
        <Separator className="w-full" />
        {request && (
          <>
            <TabsContent value="body" className="mt-0">
              <ResponseBodyTab />
            </TabsContent>
            <TabsContent value="headers" className="mt-0">
              <ResponseHeadersTab />
            </TabsContent>
            <TabsContent value="cookies">
              {/* Your HeadersTab component or content goes here */}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

interface TimeAgoProps {
  requestStartTime: number
}

const TimeAgo = ({ requestStartTime }: TimeAgoProps) => {
  const [timeSince, setTimeSince] = useState<string>('Just now')

  useEffect(() => {
    if (!requestStartTime) return

    const updateTime = () => {
      setTimeSince(timeAgo(requestStartTime))
    }

    updateTime()

    const now = new Date().getTime()
    const elapsedTime = now - requestStartTime

    // Set interval to 1 hour after the first hour
    let intervalTime = 60000
    if (elapsedTime >= 3600000) {
      intervalTime = 3600000
    }

    const intervalId = setInterval(updateTime, intervalTime)

    return () => clearInterval(intervalId)
  }, [requestStartTime])

  return <span className="text-nowrap pl-2">{timeSince}</span>
}

export default RequestResponsePanel
