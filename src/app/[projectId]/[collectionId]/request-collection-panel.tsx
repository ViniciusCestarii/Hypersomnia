import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestBadge from '@/components/ui/panel/request-badge'
import { Separator } from '@/components/ui/separator'
import { filterNodes } from '@/lib/utils'
import { FileSystemNode as FileSystemNodeType } from '@/types/collection'
import useCollectionContext from '@/zustand/collection-store'
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import Link from 'next/link'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

const RequestCollectionPanel = () => {
  const collection = useCollectionContext((state) => state.collection)

  const [filter, setFilter] = useQueryState('qr')
  const [expandAll, setExpandAll] = useQueryState('ea', parseAsBoolean)

  const filteredNodes = filterNodes(collection?.fileSystem || [], filter ?? '')

  return (
    <div className="flex flex-col">
      <PanelHeaderContainer className="pl-0">
        <Link href="/" passHref>
          <Button
            aria-label="return"
            title="return"
            size="icon"
            variant="ghost"
            className="rounded-none"
          >
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <Separator orientation="vertical" className="mr-2" />
        <span className="font-semibold">{collection?.title}</span>
      </PanelHeaderContainer>
      <div className="flex items-center p-2 gap-2">
        <Label className="sr-only" htmlFor="request-filter">
          Filter
        </Label>
        <Input
          id="request-filter"
          type="search"
          className="h-8 rounded-none"
          placeholder="Filter"
          value={filter ?? ''}
          onChange={({ target }) =>
            setFilter(target.value.length ? target.value : null)
          }
        />
        <Button
          onClick={() => setExpandAll(!expandAll)}
          aria-label={expandAll ? 'collapse all' : 'expand all'}
          title={expandAll ? 'collapse all' : 'expand all'}
          size="icon"
          variant="ghost"
          className="rounded-none"
        >
          {expandAll ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>
      <div className="mt-4">
        {filteredNodes.map((node) => (
          <FileSystemNode
            key={node.name}
            node={node}
            openFolders={expandAll || (!!filter && filter?.length > 0)}
          />
        ))}
      </div>
    </div>
  )
}

type FileSystemNodeProps = {
  node: FileSystemNodeType
  openFolders: boolean
}

const FileSystemNode = ({ node, openFolders }: FileSystemNodeProps) => {
  const selectRequest = useCollectionContext((state) => state.selectRequest)

  const [isOpen, setIsOpen] = useState(openFolders)

  useEffect(() => {
    setIsOpen(openFolders)
  }, [openFolders])

  // todo: animate open/close with framer-motion

  if (node.isFolder) {
    return (
      <div className="ml-4">
        <button
          className="flex items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <Folder size={16} className="ml-2" />
          <span className="ml-2">{node.name}</span>
        </button>
        {isOpen && (
          <div className="ml-4">
            {node.children?.map((childNode) => (
              <FileSystemNode
                key={childNode.name}
                node={childNode}
                openFolders={openFolders}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const { request } = node

  if (request) {
    return (
      <button
        onClick={() => selectRequest(request)}
        className="ml-4 flex items-center"
      >
        <RequestBadge method={request.options.method} />
        <span className="ml-2">{node.name}</span>
      </button>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>This node is invalid</AlertDescription>
    </Alert>
  )
}

export default RequestCollectionPanel
