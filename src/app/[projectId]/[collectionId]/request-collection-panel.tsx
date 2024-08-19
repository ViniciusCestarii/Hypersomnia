import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PanelHeaderContainer } from '@/components/ui/panel/panel-header-container'
import RequestMethodBadge from '@/components/ui/panel/request-method-badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  cn,
  filterNodes,
  generateNewFolderTemplate,
  generateNewRequestTemplate,
  generateUUID,
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
import { useEffect, useRef, useState } from 'react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import useKeyCombination from '@/hooks/useKeyCombination'
import merge from 'lodash.merge'

const RequestCollectionPanel = () => {
  const collection = useHypersomniaStore((state) => state.selectedCollection)
  const createFileSystemNode = useHypersomniaStore(
    (state) => state.createFileSystemNode,
  )

  const selectRequest = useHypersomniaStore((state) => state.selectRequest)

  const [filter, setFilter] = useQueryState('qr')
  const [expandAll, setExpandAll] = useState(false) // todo: make this work properly

  // todo: move these creation functions so it can be reused
  const createNewRequest = () => {
    const newRequestNode = generateNewRequestTemplate()
    createFileSystemNode(newRequestNode)

    selectRequest([newRequestNode.id])
  }

  const createNewFolder = () => {
    const newFolderNode = generateNewFolderTemplate()
    createFileSystemNode(newFolderNode)
  }

  useKeyCombination([{ keys: ['c', 'r'] }], createNewRequest)
  useKeyCombination([{ keys: ['c', 'f'] }], createNewFolder)

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
      <ScrollArea type="auto" className="mt-2">
        <div className="h-[80vh]">
          {filteredNodes.map((node) => (
            <FileSystemNode
              key={node.id}
              node={node}
              path={[node.id]}
              openFolders={expandAll || (!!filter && filter?.length > 0)}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

type FileSystemNodeProps = {
  node: FileSystemNodeType
  path: string[]
  openFolders: boolean
}

const FileSystemNode = ({ openFolders, ...props }: FileSystemNodeProps) => {
  const selectedRequestPath = useHypersomniaStore(
    (state) => state.selectedRequestPath,
  )
  const { node, path } = props

  const [isOpen, setIsOpen] = useState(openFolders)

  const selectedRequestId = selectedRequestPath
    ? selectedRequestPath[selectedRequestPath.length - 1]
    : undefined

  useEffect(() => {
    setIsOpen(openFolders)
  }, [openFolders])

  // todo: animate open/close with framer-motion

  // todo: refact and use context instead of passing down props

  const isSelected = selectedRequestId === node.id

  const padding = `1px calc(${path.length}rem - ${isSelected ? 1 : 0}px)`

  const itemProps = {
    ...props,
    padding,
    isSelected,
  }

  if (node.isFolder) {
    return (
      <>
        <FolderContextMenu {...itemProps}>
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
    return <RequestItem {...itemProps} />
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>This node is invalid</AlertDescription>
    </Alert>
  )
}

interface RequestItemProps extends Omit<FileSystemNodeProps, 'openFolders'> {
  padding: string
  isSelected: boolean
}

const RequestItem = (props: RequestItemProps) => {
  const { node, padding, path, isSelected } = props

  const [isEditing, setIsEditing] = useState(false)

  const updateFile = useHypersomniaStore((state) => state.updateFile)

  const enterEditMode = () => {
    setIsEditing(true)
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const exitEditMode = () => {
    setIsEditing(false)
  }

  const inputRef = useRef<HTMLInputElement | null>(null)

  const selectRequest = useHypersomniaStore((state) => state.selectRequest)

  const handleSelectRequest = () => {
    selectRequest(path)
  }

  if (!node.request) {
    return null
  }

  return (
    <RequestContextMenu
      {...props}
      isEditing={isEditing}
      enterEditMode={enterEditMode}
      focusInput={focusInput}
    >
      <button
        style={{
          padding,
        }}
        onClick={handleSelectRequest}
        className={cn(
          'flex items-center hover:bg-muted/80 transition-colors w-full',
          isSelected &&
            'bg-primary/[0.06] dark:bg-primary/[0.12] border-l border-primary',
        )}
      >
        <RequestMethodBadge method={node.request.options.method} />
        <input
          ref={inputRef}
          onBlur={exitEditMode}
          value={node.name}
          onChange={({ target }) =>
            updateFile(path, { ...node, name: target.value })
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              exitEditMode()
            }
          }}
          className={cn(
            'ml-2 bg-transparen hidden w-full',
            isEditing && 'block',
          )}
        />
        <span className={cn('ml-2 text-nowrap', isEditing && 'hidden')}>
          {node.name}
        </span>
      </button>
    </RequestContextMenu>
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
      <DropdownMenuContent className="w-56">
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
            <DropdownMenuShortcut>C + F</DropdownMenuShortcut>
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
            <DropdownMenuShortcut>C + R</DropdownMenuShortcut>
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
  path?: string[]
  node: FileSystemNodeType
  isEditing: boolean
  enterEditMode: () => void
  focusInput: () => void
}

const RequestContextMenu = ({
  children,
  path,
  node,
  isEditing,
  focusInput,
  enterEditMode,
}: RequestContextMenuProps) => {
  const createFileSystemNode = useHypersomniaStore(
    (state) => state.createFileSystemNode,
  )
  const selectRequest = useHypersomniaStore((state) => state.selectRequest)
  const duplicateRequest = () => {
    const newId = generateUUID()

    // merge deep nested state
    const duplicatedNode = merge({}, node, {
      id: newId,
      name: `${node.name} (copy)`,
    })

    createFileSystemNode(duplicatedNode, path)

    const fatherPath = path?.slice(0, -1) ?? []
    selectRequest([...fatherPath, newId])
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent
        className="w-48"
        onCloseAutoFocus={(e) => {
          if (isEditing) {
            focusInput()
            e.preventDefault()
          }
        }}
      >
        <ContextMenuLabel className="text-xs">Actions</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs" onClick={duplicateRequest}>
          <Layers2 className="size-3 mr-2" /> <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs" onClick={enterEditMode}>
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
  path: string[]
  node: FileSystemNodeType
}

const FolderContextMenu = ({
  children,
  node,
  path,
}: FolderContextMenuProps) => {
  const createFileSystemNode = useHypersomniaStore(
    (state) => state.createFileSystemNode,
  )
  const selectRequest = useHypersomniaStore((state) => state.selectRequest)
  const duplicateNodeWithNewIds = (node: FileSystemNodeType) => {
    const newId = generateUUID()

    const duplicatedNode: FileSystemNodeType = merge({}, node, {
      id: newId,
      children: node.children?.map(duplicateNodeWithNewIds),
    })

    return duplicatedNode
  }

  const duplicateFolder = () => {
    const newId = generateUUID()

    const duplicatedNode = duplicateNodeWithNewIds({
      ...node,
      id: newId,
      name: `${node.name} (copy)`,
    })

    createFileSystemNode(duplicatedNode, path)
  }

  const myPath = [...path, node.id]

  const createNewRequest = () => {
    const newRequestNode = generateNewRequestTemplate()
    createFileSystemNode(newRequestNode, myPath)

    selectRequest([...path, newRequestNode.id])
  }

  const createNewFolder = () => {
    const newFolderNode = generateNewFolderTemplate()
    createFileSystemNode(newFolderNode, myPath)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel className="text-xs">Create</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs" onClick={createNewFolder}>
          <Folder className="size-3 mr-2" /> <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs" onClick={createNewRequest}>
          <ArrowUpDown className="size-3 mr-2" /> <span>New HTTP request</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel className="text-xs">Actions</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs" onClick={duplicateFolder}>
          <Layers2 className="size-3 mr-2" /> <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs">
          <Pencil className="size-3 mr-2" /> <span>Rename</span>
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
