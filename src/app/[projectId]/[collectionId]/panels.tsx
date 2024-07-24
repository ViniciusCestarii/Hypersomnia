'use client'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import useCookieStorage from '@/hooks/useCookieStorage'
import { ReactNode } from 'react'
import RequestCollectionPanel from './request-collection-panel'

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

  const [responsePanelSize, setResponsePanelSize] = useCookieStorage(
    'rps',
    rps ?? 50,
  )

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
          <span className="font-semibold">Two</span>
        </PanelContentWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        onResize={(value) => setResponsePanelSize(value)}
        defaultSize={responsePanelSize}
      >
        <PanelContentWrapper>
          <span className="font-semibold">Three</span>
        </PanelContentWrapper>
      </ResizablePanel>
    </>
  )
}

const PanelContentWrapper = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col h-full">{children}</div>
)
