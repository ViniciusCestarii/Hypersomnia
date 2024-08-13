import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  filterNodes,
  generateNewFolderTemplate,
  generateNewRequestTemplate,
} from '@/lib/utils'
import { FileSystemNode as FileSystemNodeType } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  File,
  Folder,
  Layers2,
  Maximize2,
  Minimize2,
  Pencil,
  Plus,
  Terminal,
  Trash,
} from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

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
      <ScrollArea>
        <div className="flex items-center p-2 gap-2 min-w-48">
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
            className="rounded-none flex-shrink-0"
          >
            {expandAll ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          <CollectionOptionsButton />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mt-4">
        {filteredNodes.map((node) => (
          <FileSystemNode
            key={node.id}
            node={node}
            path={[node.id]}
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

  const padding = `1px ${path.length}rem`

  if (node.isFolder) {
    return (
      <>
        <FolderContextMenu>
          <button
            style={{
              padding,
            }}
            className="flex items-center cursor-pointer hover:bg-muted/80 transition-colors w-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronDown size={16} className="flex-shrink-0" />
            ) : (
              <ChevronRight size={16} className="flex-shrink-0" />
            )}
            <Folder size={16} className="ml-2 flex-shrink-0" />
            <span className="ml-2 text-nowrap">{node.name}</span>
          </button>
        </FolderContextMenu>
        {isOpen &&
          node.children?.map((childNode) => (
            <FileSystemNode
              key={childNode.id}
              node={childNode}
              path={[...path, childNode.id]}
              openFolders={openFolders}
            />
          ))}
      </>
    )
  }

  if (node.request) {
    return (
      <RequestContextMenu>
        <button
          style={{
            padding,
          }}
          onClick={handleSelectRequest}
          className="flex items-center hover:bg-muted/80 transition-colors w-full"
        >
          <RequestMethodBadge method={node.request.options.method} />
          <span className="ml-2 text-nowrap">{node.name}</span>
        </button>
      </RequestContextMenu>
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

const CollectionOptionsButton = () => {
  const createFileSystemNode = useHypersomniaStore(
    (state) => state.createFileSystemNode,
  )
  const selectRequest = useHypersomniaStore((state) => state.selectRequest)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="create folder/request"
          title="create folder/request"
          size="icon"
          variant="ghost"
          className="rounded-none flex-shrink-0"
        >
          <Plus size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            <span>Create</span>
          </DropdownMenuLabel>
          <DropdownMenuItem
            inset
            className="text-xs"
            onClick={() => {
              const folderNode = generateNewFolderTemplate()
              createFileSystemNode(folderNode)
            }}
          >
            <Folder className="mr-1 size-3" />
            <span>New Folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            inset
            className="text-xs"
            onClick={() => {
              const requestNode = generateNewRequestTemplate()
              createFileSystemNode(requestNode)
              selectRequest([requestNode.id])
            }}
          >
            <ArrowUpDown className="mr-1 size-3" />
            <span>New HTTP request</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            <span>Import</span>
          </DropdownMenuLabel>
          <DropdownMenuItem inset className="text-xs">
            <Terminal className="mr-1 size-3" />
            <span>From Curl</span>
          </DropdownMenuItem>
          <DropdownMenuItem inset className="text-xs">
            <File className="mr-1 size-3" />
            <span>From File</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface RequestContextMenuProps {
  children: React.ReactNode
}

const RequestContextMenu = ({ children }: RequestContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel className="text-xs">Actions</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs">
          <Layers2 className="size-3 mr-2" /> <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <Pencil className="size-3 mr-2" /> <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <Terminal className="size-3 mr-2" /> <span>Copy as Curl</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-xs">
          <Trash className="size-3 mr-2" /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

interface FolderContextMenuProps {
  children: React.ReactNode
}

const FolderContextMenu = ({ children }: FolderContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel className="text-xs">Create</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs">
          <Folder className="size-3 mr-2" /> <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <ArrowUpDown className="size-3 mr-2" /> <span>New HTTP request</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel className="text-xs">Actions</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs">
          <Layers2 className="size-3 mr-2" /> <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <Pencil className="size-3 mr-2" /> <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <Terminal className="size-3 mr-2" /> <span>Copy as Curl</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-xs">
          <Trash className="size-3 mr-2" /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default RequestCollectionPanel
