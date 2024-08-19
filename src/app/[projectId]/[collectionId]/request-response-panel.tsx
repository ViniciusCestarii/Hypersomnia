'use client'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useFetch from '@/hooks/useFetch'
import useIsClient from '@/hooks/useIsClient'
import {
  cn,
  getAuthConfig,
  getBodyData,
  getDefinedHeaders,
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
import ResponseCookiesTab from './(request-response-tabs)/response-cookies-tab'

const RequestResponsePanel = () => {
  const sendTrigger = useHypersomniaStore((state) => state.sendTrigger)
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const { timeTaken, requestStartTime, response, error, loading } =
    useHypersomniaStore((state) => state.requestFetchResult) ?? {}
  const cookies = useHypersomniaStore((state) => state.cookies)

  const [tab, setTab] = useQueryState(
    'response-tab',
    parseAsString.withDefault('body'),
  )

  const requestHeaders = request?.headers ?? []

  // todo: memoize values to prevent unnecessary re-renders
  const refetch = useFetch({
    ...request,
    options: {
      ...request?.options,
      headers: {
        ...getDefinedHeaders(),
        ...requestHeaders.reduce((acc: { [key: string]: string }, header) => {
          if (header.enabled && header.key) {
            acc[header.key] = header.value ?? ''
          }
          return acc
        }, {}),
        ...(request ? getAuthConfig(request) : {}),
      },
      data: request?.body ? getBodyData(request.body) : '',
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
    <>
      <PanelHeaderContainer>
        <>
          {response ? (
            <span
              title={httpStatusCodes[response.status]}
              className={cn(
                'font-semibold text-nowrap',
                getStatusColor(response?.status),
              )}
            >
              {`${response.status} ${httpStatusCodes[response.status]}`}
            </span>
          ) : (
            error && (
              <span
                className={cn('font-semibold text-nowrap', getStatusColor(500))}
                title={`${error.message} could be due to CORS policy, network
                    connection, bad DNS, or others issues`}
              >
                {error.message}
              </span>
            )
          )}
          {typeof timeTaken !== 'undefined' && (
            <span className="mx-2 text-nowrap">
              {(timeTaken?.toFixed(0) ?? 0) + 'ms'}
            </span>
          )}
        </>

        {requestStartTime && (
          <>
            <Separator orientation="vertical" className="ml-auto" />
            <TimeAgo requestStartTime={requestStartTime} />
          </>
        )}
      </PanelHeaderContainer>
      <Tabs value={tab} className="h-full">
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
            {!process.env.NEXT_PUBLIC_IS_RUNNING_REMOTELY && (
              <TabsTrigger
                value="cookies"
                className="min-w-[100px]"
                onClick={() => setTab('cookies')}
              >
                cookies ({cookies.length})
              </TabsTrigger>
            )}
            <ScrollBar orientation="horizontal" />
          </TabsList>
        </ScrollArea>
        <Separator className="w-full" />
        {request && (
          <>
            <TabsContent value="body" className="mt-0 h-full">
              <ResponseBodyTab />
            </TabsContent>
            <TabsContent value="headers" className="mt-0">
              <ResponseHeadersTab />
            </TabsContent>

            <TabsContent value="cookies" className="mt-0">
              {!process.env.NEXT_PUBLIC_IS_RUNNING_REMOTELY && (
                <ResponseCookiesTab />
              )}
            </TabsContent>
          </>
        )}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-background/35 z-50">
            Loading...
          </div>
        )}
      </Tabs>
    </>
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
