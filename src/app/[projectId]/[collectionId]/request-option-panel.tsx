import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TypographyP from '@/components/ui/typography-p'
import { requestMethods } from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { parseAsString, useQueryState } from 'nuqs'
import RequestBodyTab from './(request-option-tabs)/request-body-tab'
import RequestParamsTab from './(request-option-tabs)/request-params-tab'
import RequestAuthTab from './(request-option-tabs)/request-auth-tab'
import useDefineMonacoTheme from '@/hooks/useDefineMonacoTheme'

const RequestOptionPanel = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const sendRequest = useHypersomniaStore((state) => state.sendRequest)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  const updateRequestOptionField = useHypersomniaStore(
    (state) => state.updateRequestOptionField,
  )

  useDefineMonacoTheme()

  const [tab, setTab] = useQueryState(
    'option-tab',
    parseAsString.withDefault('params'),
  )

  return (
    <div className="flex flex-col flex-1">
      <PanelHeaderContainer className="px-0">
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
                className="border-0 w-fit shadow-none"
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
              className="font-semibold shrink mr-16 border-0 shadow-none focus-visible:ring-0 pl-0"
            />
            <div className="absolute right-0 pr-2 bg-background">
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
        <ScrollArea type="hover">
          <TabsList className="flex justify-start">
            <TabsTrigger
              value="params"
              className="min-w-24"
              onClick={() => setTab('params')}
            >
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
        {request && (
          <>
            <TabsContent value="params">
              <RequestParamsTab />
            </TabsContent>
            <TabsContent value="body" className="mt-0">
              <RequestBodyTab />
            </TabsContent>
            <TabsContent value="auth">
              <RequestAuthTab />
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
          </>
        )}
      </Tabs>
      {/* todo: add button to create request or keyboard shortcut to select etc */}
      {!request && (
        <div className="flex justify-center items-center flex-1 -mt-12">
          <TypographyP className="text-muted-foreground text-center">
            No request selected
          </TypographyP>
        </div>
      )}
    </div>
  )
}

export default RequestOptionPanel
