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
} from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { parseAsString, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import ResponseBodyTab from './(request-response-tabs)/response-body-tab'
import ResponseHeadersTab from './(request-response-tabs)/response-headers-tab'

const RequestResponsePanel = () => {
  const sendTrigger = useHypersomniaStore((state) => state.sendTrigger)
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const { time, response } =
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
            <span className="ml-2">{time + 'ms'}</span>
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

export default RequestResponsePanel
