import Panels from '@/app/[collectionId]/panels'
import { ResizablePanelGroup } from '@/components/ui/resizable'
import { getCookie } from '@/lib/get-cookie'
import CollectionPageContext from './collection-page-context'
import { Toaster } from '@/components/ui/sonner'

export interface ApiToolProps {
  params: {
    collectionId: string
  }
}

interface Props {
  params: Promise<ApiToolProps['params']>
}

export default async function ApiTool(props: Props) {
  const hypersomniaLeftPanelSize = await getCookie(
    'hypersomnia_left_panel_size',
  )
  const hypersomniaMiddlePanelSize = await getCookie(
    'hypersomnia_middle_panel_size',
  )
  const hypersomniaRightPanelSize = await getCookie(
    'hypersomnia_right_panel_size',
  )

  const params = await props.params

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 rounded-lg border max-w-screen-xl mx-auto max-h-[calc(100vh-8rem)]"
      >
        <CollectionPageContext params={params}>
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
