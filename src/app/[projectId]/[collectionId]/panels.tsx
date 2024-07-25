'use client'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import useCookieStorage from '@/hooks/useCookieStorage'
import { ReactNode } from 'react'
import RequestCollectionPanel from './request-collection-panel'
import RequestOptionPanel from './request-option-panel'
import RequestResponsePanel from './request-response-panel'

interface PanelsProps {
  rcps?: number
  rops?: number
  rps?: number
}

export default function Panels({ rcps, rops, rps }: PanelsProps) {
  const [requestCollectionPanelSize, setRequestCollectionPanelSize] =
    useCookieStorage('rcps', rcps ?? 50)

  const [requestOptionPanelSize, setRequestOptionPanelSize] = useCookieStorage(
    'rops',
    rops ?? 50,
  )

  const [requestResponsePanelSize, setrequestResponsePanelSize] =
    useCookieStorage('rrps', rps ?? 50)

  return (
    <>
      <ResizablePanel
        onResize={(value) => setRequestCollectionPanelSize(value)}
        defaultSize={requestCollectionPanelSize}
      >
        <PanelContentWrapper>
          <RequestCollectionPanel />
        </PanelContentWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        onResize={(value) => setRequestOptionPanelSize(value)}
        defaultSize={requestOptionPanelSize}
      >
        <PanelContentWrapper>
          <RequestOptionPanel />
        </PanelContentWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        onResize={(value) => setrequestResponsePanelSize(value)}
        defaultSize={requestResponsePanelSize}
      >
        <PanelContentWrapper>
          <RequestResponsePanel />
        </PanelContentWrapper>
      </ResizablePanel>
    </>
  )
}

const PanelContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col h-full">{children}</div>
)
