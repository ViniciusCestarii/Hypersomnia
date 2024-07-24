'use client'
import { ResizablePanelGroup } from '@/components/ui/resizable'
import useCollectionStore from '@/zustand/collection-store'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const Panels = dynamic(
  () => import('@/app/[projectId]/[collectionId]/panels'),
  {
    ssr: false,
  },
)

interface ApiToolProps {
  params: {
    projectId: string
    collectionId: string
  }
}

export default function ApiTool({ params }: ApiToolProps) {
  const selectCollection = useCollectionStore((state) => state.selectCollection)

  useEffect(() => {
    selectCollection(params.collectionId)
  })

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex flex-1 rounded-lg border"
    >
      <Panels />
    </ResizablePanelGroup>
  )
}
