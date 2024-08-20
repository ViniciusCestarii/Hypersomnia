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
import useDefineMonacoTheme from '@/hooks/useDefineMonacoTheme'
import { keyShortcuts } from '@/lib/keyboard-shortcuts'
import {
  createNewRequest,
  formatKeyShortcut,
  requestMethods,
} from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { Code2, Key } from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import RequestAuthTab from './(request-option-tabs)/request-auth-tab'
import RequestBodyTab from './(request-option-tabs)/request-body-tab'
import RequestDocsTab from './(request-option-tabs)/request-docs-tab'
import RequestHeadersTab from './(request-option-tabs)/request-headers-tab'
import RequestParamsTab from './(request-option-tabs)/request-params-tab'

const RequestOptionPanel = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const sendRequest = useHypersomniaStore((state) => state.sendRequest)
  const isReady = useHypersomniaStore((state) => state.isReady)
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
    <>
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
              placeholder="https://api.example.com/"
              className="font-semibold shrink mr-16 border-0 shadow-none focus-visible:ring-0 pl-0 placeholder:text-muted-foreground/40"
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
      <Tabs value={tab} className="h-full">
        <ScrollArea type="hover">
          <TabsList className="flex justify-start">
            <TabsTrigger
              value="params"
              className="min-w-[6.25rem]"
              onClick={() => setTab('params')}
            >
              params (
              {request?.queryParameters?.filter(
                (query) => query.key && query.enabled,
              ).length ?? 0}
              )
            </TabsTrigger>
            <TabsTrigger value="body" onClick={() => setTab('body')}>
              body {request?.body && <Code2 className="size-4 ml-2" />}
            </TabsTrigger>
            <TabsTrigger value="auth" onClick={() => setTab('auth')}>
              auth {request?.auth?.enabled && <Key className="size-4 ml-2" />}
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="min-w-[6.5rem]"
              onClick={() => setTab('headers')}
            >
              headers (
              {request?.headers?.filter(
                (header) => header.key && header.enabled,
              ).length ?? 0}
              )
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
            <TabsContent value="params" className="h-full">
              <RequestParamsTab />
            </TabsContent>
            <TabsContent value="body" className="mt-0 h-full">
              <RequestBodyTab />
            </TabsContent>
            <TabsContent value="auth" className="mt-0">
              <RequestAuthTab />
            </TabsContent>
            <TabsContent value="headers" className="mt-0 h-full">
              <RequestHeadersTab />
            </TabsContent>
            <TabsContent value="docs" className="mt-0 h-full">
              <RequestDocsTab />
            </TabsContent>
          </>
        )}
        {/* todo: add button to create request or keyboard shortcut to select etc */}
        {isReady && !request && (
          <div className="flex justify-center items-center flex-1 h-full">
            <TypographyP className="relative text-primary/85 flex flex-col gap-4 text-center after:content-[''] after:-z-10 after:shadow-merge-bg after:absolute after:rounded-full after:w-[200%] after:-translate-y-[calc(35%)] after:-left-1/2 after:bg-[length:24px_24px] after:aspect-square after:bg-grid">
              No request selected
              <span className="flex gap-4 items-center text-muted-foreground text-sm">
                Create Request
                <kbd className="bg-background border p-1 py-0">
                  {formatKeyShortcut(keyShortcuts.createRequest)}
                </kbd>
              </span>
              <Button
                aria-label="Create Request"
                title="Create Request"
                onClick={() => {
                  createNewRequest()
                }}
              >
                Create Request
              </Button>
            </TypographyP>
          </div>
        )}
      </Tabs>
    </>
  )
}

export default RequestOptionPanel
