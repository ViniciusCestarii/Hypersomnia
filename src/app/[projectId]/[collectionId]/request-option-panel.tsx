import { Button } from '@/components/ui/button'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { requestMethods } from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { parseAsString, useQueryState } from 'nuqs'
import ParamsTab from './(request-option-tabs)/params-tab'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import BodyTab from './(request-option-tabs)/body-tab'

const RequestOptionPanel = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const sendRequest = useHypersomniaStore((state) => state.sendRequest)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  const updateRequestOptionField = useHypersomniaStore(
    (state) => state.updateRequestOptionField,
  )

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('params'),
  )

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer className="pl-0">
        {request && (
          <div className="flex relative max-w-full w-full items-center">
            <Label className="sr-only" htmlFor="request-method">
              Method
            </Label>
            <Select
              value={request.options.method}
              onValueChange={(value) =>
                updateRequestOptionField('method', value)
              }
            >
              <SelectTrigger
                aria-label="request method"
                id="request-method"
                className="border-0 w-fit"
              >
                <RequestMethodBadge method={request.options.method} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {requestMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      <RequestMethodBadge method={method} />
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label className="sr-only" htmlFor="request-url">
              URL
            </Label>
            <Input
              id="request-url"
              onChange={({ target }) => updateRequestField('url', target.value)}
              value={request.url}
              className="font-semibold shrink mr-16 border-0 focus-visible:ring-0 pl-0"
            />
            <Button
              onClick={sendRequest}
              aria-label="send"
              title="send"
              variant="default"
              className="h-6 absolute right-0 -translate-y-1/2 top-1/2"
            >
              Send
            </Button>
          </div>
        )}
      </PanelHeaderContainer>
      <Tabs value={tab}>
        <ScrollArea type="hover">
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
            <ScrollBar orientation="horizontal" />
          </TabsList>
        </ScrollArea>
        <Separator className="w-full" />
        <TabsContent value="params">
          <ParamsTab />
        </TabsContent>
        <TabsContent value="body" className="mt-0">
          <BodyTab />
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
