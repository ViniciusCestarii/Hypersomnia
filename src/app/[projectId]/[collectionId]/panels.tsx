'use client'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import useCookieStorage from '@/hooks/useCookieStorage'
import { ReactNode } from 'react'
import RequestCollectionPanel from './request-collection-panel'
import RequestOptionPanel from './request-option-panel'
import RequestResponsePanel from './request-response-panel'

interface PanelsProps {
  hypersomniaLeftPanelSize?: number
  hypersomniaMiddlePanelSize?: number
  hypersomniaRightPanelSize?: number
}

export default function Panels({
  hypersomniaLeftPanelSize,
  hypersomniaMiddlePanelSize,
  hypersomniaRightPanelSize,
}: PanelsProps) {
  const [requestCollectionPanelSize, setRequestCollectionPanelSize] =
    useCookieStorage(
      'hypersomnia_left_panel_size',
      hypersomniaLeftPanelSize ?? 15,
    )

  const [requestOptionPanelSize, setRequestOptionPanelSize] = useCookieStorage(
    'hypersomnia_middle_panel_size',
    hypersomniaMiddlePanelSize ?? 60,
  )

  const [requestResponsePanelSize, setrequestResponsePanelSize] =
    useCookieStorage(
      'hypersomnia_right_panel_size',
      hypersomniaRightPanelSize ?? 25,
    )

  return (
    <>
      <ResizablePanel
        maxSize={60}
        onResize={(value) => setRequestCollectionPanelSize(value)}
        defaultSize={requestCollectionPanelSize}
      >
        <PanelContentWrapper>
          <RequestCollectionPanel />
        </PanelContentWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        maxSize={80}
        onResize={(value) => setRequestOptionPanelSize(value)}
        defaultSize={requestOptionPanelSize}
      >
        <PanelContentWrapper>
          <RequestOptionPanel />
        </PanelContentWrapper>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        maxSize={80}
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
