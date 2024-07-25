import Panels from '@/app/[projectId]/[collectionId]/panels'
import { ResizablePanelGroup } from '@/components/ui/resizable'
import { getCookie } from '@/lib/get-cookie'
import CollectionPageContext from './collection-page-context'

export interface ApiToolProps {
  params: {
    projectId: string
    collectionId: string
  }
}

export default function ApiTool(props: ApiToolProps) {
  const rcps = getCookie('rcps')
  const rops = getCookie('rops')
  const rrps = getCookie('rrps')

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex flex-1 rounded-lg border"
    >
      <CollectionPageContext {...props}>
        <Panels rcps={rcps} rops={rops} rrps={rrps} />
      </CollectionPageContext>
    </ResizablePanelGroup>
  )
}
