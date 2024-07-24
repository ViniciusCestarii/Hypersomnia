import Panels from '@/app/[projectId]/[collectionId]/panels'
import { ResizablePanelGroup } from '@/components/ui/resizable'
import { getCookie } from '@/lib/get-cookie'
import SetCollection from './set-collection'

export interface ApiToolProps {
  params: {
    projectId: string
    collectionId: string
  }
}

export default function ApiTool({ params }: ApiToolProps) {
  const rcps = getCookie('rcps')
  const rops = getCookie('rops')
  const rps = getCookie('rps')

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex flex-1 rounded-lg border"
    >
      <SetCollection params={params} />
      <Panels rcps={rcps} rops={rops} rps={rps} />
    </ResizablePanelGroup>
  )
}
