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
import useCollectionContext from '@/zustand/collection-store'
import { parseAsString, useQueryState } from 'nuqs'
import ParamsTab from './(request-option-tabs)/params-tab'
import { Request } from '@/types/collection'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RequestOptionPanel = () => {
  const request = useCollectionContext((state) => state.selectedRequest)
  const sendRequest = useCollectionContext((state) => state.sendRequest)
  const updateSelectedRequest = useCollectionContext(
    (state) => state.updateSelectedRequest,
  )

  const handleRequestChange = (field: keyof Request, value: unknown) => {
    if (!request) return
    const requestCopy = { ...request, [field]: value }
    updateSelectedRequest(requestCopy)
  }

  const handleRequestOptionChange = (
    field: keyof Request['options'],
    value: unknown,
  ) => {
    if (!request) return
    const requestCopy = { ...request }
    requestCopy.options = {
      ...requestCopy.options,
      [field]: value,
    }
    updateSelectedRequest(requestCopy)
  }

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsString.withDefault('params'),
  )

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer className="pl-0">
        {request && (
          <div className="flex relative max-w-full w-full items-center">
            <Select
              value={request.options.method}
              onValueChange={(value) =>
                handleRequestOptionChange('method', value)
              }
            >
              <SelectTrigger className="border-0 w-fit">
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
              onChange={({ target }) =>
                handleRequestChange('url', target.value)
              }
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
