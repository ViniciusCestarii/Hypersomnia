import { Button } from '@/components/ui/button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestBadge from '@/components/ui/panel/request-badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCollectionContext from '@/zustand/collection-store'
import { parseAsString, useQueryState } from 'nuqs'
import ParamsTab from './(request-option-tabs)/params-tab'

const tabs = ['Params', 'Body', 'Auth', 'Headers', 'Scripts', 'Docs']

const RequestOptionPanel = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const sendRequest = useCollectionContext((state) => state.sendRequest)

  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault(tabs[0]))

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer>
        {request && (
          <div className="flex relative max-w-full w-full">
            <RequestBadge method={request.options.method} />{' '}
            <span className="font-semibold ml-2 shrink">{request.url}</span>
            <div className="px-2 bg-background absolute -right-2 -translate-y-1/2 top-1/2">
              <Button
                onClick={sendRequest}
                aria-label="send"
                title="send"
                variant="default"
                className="h-6"
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </PanelHeaderContainer>
      <Tabs value={tab}>
        <TabsList className="flex justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} onClick={() => setTab(tab)}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <Separator className="w-full" />
        <TabsContent value="Params">
          <ParamsTab />
        </TabsContent>
        <TabsContent value="Body"></TabsContent>
      </Tabs>
    </div>
  )
}

export default RequestOptionPanel
