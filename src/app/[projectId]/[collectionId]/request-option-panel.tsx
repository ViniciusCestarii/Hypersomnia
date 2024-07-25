import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestBadge from '@/components/ui/panel/request-badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCollectionContext from '@/zustand/collection-store'
import { parseAsString, useQueryState } from 'nuqs'

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
        <div className="p-2 pt-0">
          <TabsContent value="Params">
            <Alert className="bg-foreground/5 overflow-auto">
              <AlertTitle className="uppercase text-xs text-foreground/75">
                URL preview
              </AlertTitle>
              <AlertDescription className="text-extra-xs break-words max-h-28 relative">
                {request ? (
                  <>
                    {request.url}
                    <ClipboardButton
                      label="Copy URL"
                      text={request.url}
                      className="absolute right-0 bottom-0 backdrop-blur-[100rem]"
                    />
                  </>
                ) : (
                  <Skeleton className="h-2 mt-2 mb-1 w-[40%]" />
                )}
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="Body"></TabsContent>
        </div>
      </Tabs>
      <div className="p-2 pt-0"></div>
    </div>
  )
}

export default RequestOptionPanel
