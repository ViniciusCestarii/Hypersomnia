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
  copyToClipboard,
  createNewFolder,
  createNewRequest,
  duplicateFile,
  filterNodes,
  formatKeyShortcut,
  hypersomniaRequestToCurl,
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
import { forwardRef, useEffect, useRef, useState } from 'react'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import useKeyCombination from '@/hooks/useKeyCombination'
import { keyShortcuts } from '@/lib/keyboard-shortcuts'

const RequestCollectionPanel = () => {
  const collection = useHypersomniaStore((state) => state.selectedCollection)

  const [filter, setFilter] = useQueryState('qr')
  const [expandAll, setExpandAll] = useState(false) // todo: make this work properly

  const filteredNodes = filterNodes(collection?.fileSystem || [], filter ?? '')

  return (
    <>
      <PanelHeaderContainer className="pl-0 flex-shrink-0">
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
      <ScrollArea className="flex-shrink-0">
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
      <ScrollArea>
        <div className="h-full max-h-full">
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
    </>
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

  const selectedRequestId = selectedRequestPath
    ? selectedRequestPath[selectedRequestPath.length - 1]
    : undefined

  // todo: animate open/close with framer-motion

  const isSelected = selectedRequestId === node.id

  const padding = `1px calc(${path.length}rem - ${isSelected ? 1 : 0}px)`

  const itemProps = {
    ...props,
    padding,
    openFolders,
    isSelected,
  }

  if (node.isFolder) {
    return <FolderItem {...itemProps} />
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

  const exitEditMode = () => {
    setIsEditing(false)
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
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
        <EditableTitle
          ref={inputRef}
          isEditing={isEditing}
          value={node.name}
          id={'edit-request-' + node.id}
          onChange={(value) => updateFile(path, { ...node, name: value })}
          onBlur={exitEditMode}
        />
      </button>
    </RequestContextMenu>
  )
}

interface FolderItemProps extends FileSystemNodeProps {
  padding: string
}

const FolderItem = (props: FolderItemProps) => {
  const { node, path, openFolders, padding } = props

  const [isOpen, setIsOpen] = useState(openFolders)
  const [isEditing, setIsEditing] = useState(false)

  const updateFile = useHypersomniaStore((state) => state.updateFile)

  const enterEditMode = () => {
    setIsEditing(true)
  }

  const exitEditMode = () => {
    setIsEditing(false)
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setIsOpen(openFolders)
  }, [openFolders])

  return (
    <>
      <FolderContextMenu
        {...props}
        isEditing={isEditing}
        enterEditMode={enterEditMode}
        focusInput={focusInput}
      >
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
          <EditableTitle
            id={'edit-folder-' + node.id}
            ref={inputRef}
            isEditing={isEditing}
            value={node.name}
            onChange={(value) => updateFile(path, { ...node, name: value })}
            onBlur={exitEditMode}
          />
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

interface EditableTitleProps {
  value: string
  id: string
  onChange: (value: string) => void
  onBlur: () => void
  isEditing: boolean
}

const EditableTitle = forwardRef<HTMLInputElement, EditableTitleProps>(
  ({ value, onChange, onBlur, isEditing, id }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onBlur()
      }

      // Space key should not trigger the parent button
      if (e.key === ' ') {
        e.preventDefault()
        onChange(value + ' ')
      }
    }

    if (isEditing) {
      return (
        <>
          <label htmlFor={id} className="sr-only">
            {value} name
          </label>
          <input
            id={id}
            ref={ref}
            onBlur={onBlur}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'ml-2 bg-transparent hidden w-full',
              isEditing && 'block',
            )}
          />
        </>
      )
    }

    return (
      <span className={cn('ml-2 text-nowrap', isEditing && 'hidden')}>
        {value}
      </span>
    )
  },
)

EditableTitle.displayName = 'EditableTitle'

const CollectionOptionsButton = () => {
  useKeyCombination([keyShortcuts.createRequest], createNewRequest)
  useKeyCombination([keyShortcuts.createFolder], createNewFolder)

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
              createNewFolder()
            }}
          >
            <Folder className="mr-1 size-3" />
            <span>New Folder</span>
            <DropdownMenuShortcut>
              {formatKeyShortcut(keyShortcuts.createFolder)}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            inset
            className="text-xs"
            onClick={() => {
              createNewRequest()
            }}
          >
            <ArrowUpDown className="mr-1 size-3" />
            <span>New HTTP request</span>
            <DropdownMenuShortcut>
              {formatKeyShortcut(keyShortcuts.createRequest)}
            </DropdownMenuShortcut>
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

interface FileContextMenuProps {
  children: React.ReactNode
  path: string[]
  node: FileSystemNodeType
  isEditing: boolean
  enterEditMode: () => void
  focusInput: () => void
}

type RequestContextMenuProps = FileContextMenuProps

const RequestContextMenu = ({
  children,
  path,
  node,
  isEditing,
  focusInput,
  enterEditMode,
}: RequestContextMenuProps) => {
  const deleteFile = useHypersomniaStore((state) => state.deleteFile)

  const deleteRequest = () => {
    deleteFile(path)
  }

  const duplicateRequest = () => {
    duplicateFile(path, node)
  }

  const copyAsCurl = () => {
    if (!node.request) return
    const textToCopy = hypersomniaRequestToCurl(node.request)
    copyToClipboard(textToCopy)
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
        <ContextMenuItem inset className="text-xs" onClick={copyAsCurl}>
          <Terminal className="size-3 mr-2" /> <span>Copy as Curl</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-xs" onClick={deleteRequest}>
          <Trash className="size-3 mr-2" /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

type FolderContextMenuProps = FileContextMenuProps

const FolderContextMenu = ({
  children,
  node,
  path,
  enterEditMode,
  focusInput,
  isEditing,
}: FolderContextMenuProps) => {
  const deleteFile = useHypersomniaStore((state) => state.deleteFile)

  const duplicateFolder = () => {
    duplicateFile(path, node)
  }

  const deleteFolder = () => {
    deleteFile(path)
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
        <ContextMenuLabel className="text-xs">Create</ContextMenuLabel>
        <ContextMenuItem
          inset
          className="text-xs"
          onClick={() => {
            createNewFolder(path)
          }}
        >
          <Folder className="size-3 mr-2" /> <span>New Folder</span>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          className="text-xs"
          onClick={() => {
            createNewRequest(path)
          }}
        >
          <ArrowUpDown className="size-3 mr-2" /> <span>New HTTP request</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel className="text-xs">Actions</ContextMenuLabel>
        <ContextMenuItem inset className="text-xs" onClick={duplicateFolder}>
          <Layers2 className="size-3 mr-2" /> <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuItem inset className="text-xs" onClick={enterEditMode}>
          <Pencil className="size-3 mr-2" /> <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-xs" onClick={deleteFolder}>
          <Trash className="size-3 mr-2" /> <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default RequestCollectionPanel
