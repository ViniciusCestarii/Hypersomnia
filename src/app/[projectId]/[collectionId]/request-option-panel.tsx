import { Button } from '@/components/ui/button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCollectionContext from '@/zustand/collection-store'
import { parseAsString, useQueryState } from 'nuqs'
import ParamsTab from './(request-option-tabs)/params-tab'

const RequestOptionPanel = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const sendRequest = useCollectionContext((state) => state.sendRequest)

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('params'),
  )

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer>
        {request && (
          <div className="flex relative max-w-full w-full">
            <RequestMethodBadge method={request.options.method} />{' '}
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
          <TabsTrigger value="params" onClick={() => setTab('params')}>
            params ({request?.queryParameters.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="body" onClick={() => setTab('body')}>
            body
          </TabsTrigger>
          <TabsTrigger value="auth" onClick={() => setTab('auth')}>
            auth
          </TabsTrigger>
          <TabsTrigger value="headers" onClick={() => setTab('headers')}>
            headers
          </TabsTrigger>
          <TabsTrigger value="scripts" onClick={() => setTab('scripts')}>
            scripts
          </TabsTrigger>
          <TabsTrigger value="docs" onClick={() => setTab('docs')}>
            docs
          </TabsTrigger>
        </TabsList>
        <Separator className="w-full" />
        <TabsContent value="params">
          <ParamsTab />
        </TabsContent>
        <TabsContent value="body">
          {/* Your BodyTab component or content goes here */}
        </TabsContent>
        <TabsContent value="auth">
          {/* Your AuthTab component or content goes here */}
        </TabsContent>
        <TabsContent value="headers">
          {/* Your HeadersTab component or content goes here */}
        </TabsContent>
        <TabsContent value="scripts">
          {/* Your ScriptsTab component or content goes here */}
        </TabsContent>
        <TabsContent value="docs">
          {/* Your DocsTab component or content goes here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RequestOptionPanel
