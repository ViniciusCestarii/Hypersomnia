import Panels from '@/app/[projectId]/[collectionId]/panels'
import { ResizablePanelGroup } from '@/components/ui/resizable'
import { getCookie } from '@/lib/get-cookie'
import CollectionPageContext from './collection-page-context'
import { Toaster } from '@/components/ui/sonner'

export interface ApiToolProps {
  params: {
    projectId: string
    collectionId: string
  }
}

export default function ApiTool(props: ApiToolProps) {
  const hypersomniaLeftPanelSize = getCookie('hypersomnia_left_panel_size')
  const hypersomniaMiddlePanelSize = getCookie('hypersomnia_middle_panel_size')
  const hypersomniaRightPanelSize = getCookie('hypersomnia_right_panel_size')

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 rounded-lg border max-h-[calc(100vh-5rem)]"
      >
        <CollectionPageContext {...props}>
          <Panels
            hypersomniaLeftPanelSize={hypersomniaLeftPanelSize}
            hypersomniaMiddlePanelSize={hypersomniaMiddlePanelSize}
            hypersomniaRightPanelSize={hypersomniaRightPanelSize}
          />
        </CollectionPageContext>
      </ResizablePanelGroup>
      <Toaster />
    </>
  )
}
