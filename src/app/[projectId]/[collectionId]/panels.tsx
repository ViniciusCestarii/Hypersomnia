'use client'

import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import useLocalStorage from '@/hooks/useLocalStorage'
import useCollectionStore from '@/zustand/collection-store'
import { ReactNode } from 'react'

export default function Panels() {
  const [requestCollectionPanelSize, setRequestCollectionPanelSize] =
    useLocalStorage('rcps', 50)

  const [requestOptionPanelSize, setRequestOptionPanelSize] = useLocalStorage(
    'rops',
    50,
  )

  const [responsePanelSize, setResponsePanelSize] = useLocalStorage('rps', 50)

  const selectedCollection = useCollectionStore(
    (state) => state.selectedCollection,
  )

  return (
    <>
      <ResizablePanel
        onResize={(value) => setRequestCollectionPanelSize(value)}
        defaultSize={requestCollectionPanelSize}
      >
        <PanelContentWrapper>
          <span className="font-semibold">{selectedCollection?.title}</span>
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
  <div className="flex flex-col h-full p-6">{children}</div>
)
