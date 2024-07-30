import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import { Separator } from '@/components/ui/separator'
import { filterNodes } from '@/lib/utils'
import { FileSystemNode as FileSystemNodeType } from '@/types/collection'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
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
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

const RequestCollectionPanel = () => {
  const collection = useHypersomniaStore((state) => state.selectedCollection)

  const [filter, setFilter] = useQueryState('qr')
  const [expandAll, setExpandAll] = useState(false) // todo: make this work properly

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
        <h2 className="font-semibold text-nowrap">{collection?.title}</h2>
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
            path={[node.name]}
            openFolders={expandAll || (!!filter && filter?.length > 0)}
          />
        ))}
      </div>
    </div>
  )
}

type FileSystemNodeProps = {
  node: FileSystemNodeType
  path: string[]
  openFolders: boolean
}

const FileSystemNode = ({ node, path, openFolders }: FileSystemNodeProps) => {
  const selectRequest = useHypersomniaStore((state) => state.selectRequest)

  const [isOpen, setIsOpen] = useState(openFolders)

  useEffect(() => {
    setIsOpen(openFolders)
  }, [openFolders])

  // todo: animate open/close with framer-motion

  const handleSelectRequest = () => {
    if (node.request) {
      selectRequest(path)
    }
  }

  if (node.isFolder) {
    return (
      <div className="ml-4">
        <button
          className="flex items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <Folder size={16} className="ml-2" />
          <span className="ml-2 text-nowrap">{node.name}</span>
        </button>
        {isOpen && (
          <div className="ml-4">
            {node.children?.map((childNode) => (
              <FileSystemNode
                key={childNode.name}
                node={childNode}
                path={[...path, childNode.name]}
                openFolders={openFolders}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (node.request) {
    return (
      <button onClick={handleSelectRequest} className="ml-4 flex items-center">
        <RequestMethodBadge method={node.request.options.method} />
        <span className="ml-2 text-nowrap">{node.name}</span>
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
