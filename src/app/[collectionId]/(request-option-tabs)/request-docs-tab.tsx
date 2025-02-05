import dynamic from 'next/dynamic'
import Editor from '@/components/ui/panel/editor'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import Loading from '@/components/ui/loading'
import remarkGfm from 'remark-gfm'

const Markdown = dynamic(() => import('react-markdown'), {
  loading: () => <Loading className="h-[75vh]" />,
})

const RequestDocsTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  return (
    <Tabs defaultValue="write" className="h-full">
      <ScrollArea type="hover">
        <TabsList className="flex justify-start">
          <TabsTrigger value="write" className="w-1/2">
            write
          </TabsTrigger>
          <TabsTrigger value="preview" className="w-1/2">
            preview
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Separator className="w-full" />
      <TabsContent value="write" className="mt-0 h-full">
        <Editor
          language="markdown"
          value={request?.doc ?? ''}
          height="calc(100% - 4.8rem)"
          onChange={(value) => updateRequestField('doc', value)}
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <ScrollArea type="auto">
          <Markdown
            className="markdown px-3 max-h-[75vh]"
            remarkPlugins={[remarkGfm]}
          >
            {request?.doc}
          </Markdown>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

export default RequestDocsTab
