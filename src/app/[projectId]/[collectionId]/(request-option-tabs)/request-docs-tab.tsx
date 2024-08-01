import Editor from '@/components/ui/panel/editor'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const RequestDocsTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  return (
    <Tabs defaultValue="write">
      <ScrollArea type="hover">
        <TabsList className="flex justify-start">
          <TabsTrigger value="write" className="w-1/2">
            write
          </TabsTrigger>
          <TabsTrigger value="preview" className="w-1/2">
            preview
          </TabsTrigger>
          <ScrollBar orientation="horizontal" />
        </TabsList>
      </ScrollArea>
      <Separator className="w-full" />
      <TabsContent value="write" className="mt-0">
        <Editor
          language="markdown"
          value={request?.doc ?? ''}
          onChange={(value) => updateRequestField('doc', value)}
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <Markdown className="markdown pl-3" remarkPlugins={[remarkGfm]}>
          {request?.doc && request.doc.trimStart().length > 0
            ? request.doc
            : 'No content'}
        </Markdown>
      </TabsContent>
    </Tabs>
  )
}

export default RequestDocsTab
