'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import useCookieStorage from '@/hooks/useCookieStorage'
import useCollectionStore from '@/zustand/collection-store'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

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
          <div className="flex items-center gap-2">
            <Link href="/" passHref>
              <Button
                aria-label="return"
                title="return"
                size="icon"
                variant="ghost"
              >
                <ChevronLeft size={20} />
              </Button>
            </Link>
            <Separator orientation="vertical" />
            <span className="font-semibold">{selectedCollection?.title}</span>
          </div>
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
