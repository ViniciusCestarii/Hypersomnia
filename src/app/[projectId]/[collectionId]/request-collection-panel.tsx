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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  createNewFolder,
  createNewRequest,
  filterNodes,
  formatKeyShortcut,
} from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import {
  ArrowUpDown,
  ChevronLeft,
  File,
  Folder,
  Maximize2,
  Minimize2,
  Plus,
  Terminal,
} from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'

import { SortableTree } from '@/app/dnd-test/SortableTree'
import { setPropertyForAll } from '@/app/dnd-test/utilities'
import useKeyCombination from '@/hooks/useKeyCombination'
import { keyShortcuts } from '@/lib/keyboard-shortcuts'
import { TreeItems } from '@/app/dnd-test/types'
import { FileSystemNode } from '@/types'

const checkIfFolderIsOpen = (item: FileSystemNode): boolean => {
  if (typeof item.isOpen !== 'undefined') {
    return item.isOpen
  }

  if (item.children) {
    return item.children.some((child) => checkIfFolderIsOpen(child))
  }

  return false
}

const checkIfTheresAnyOpenFolder = (items: FileSystemNode[]): boolean => {
  return items.some((item) => checkIfFolderIsOpen(item))
}

const RequestCollectionPanel = () => {
  const collection = useHypersomniaStore((state) => state.selectedCollection)
  const updateCollection = useHypersomniaStore(
    (state) => state.updateCollection,
  )

  const isAnyFolderOpened = checkIfTheresAnyOpenFolder(
    collection?.fileSystem ?? [],
  )

  const toggleExpandAllFolders = () => {
    if (!collection) return
    const items = collection?.fileSystem || []
    const expandedItems = setPropertyForAll(items, 'isOpen', (item) => {
      if (item.isFolder) {
        return !isAnyFolderOpened
      } else {
        return item.isOpen
      }
    })
    updateCollection({ ...collection, fileSystem: expandedItems })
  }

  const handleUpdateCollection = (items: TreeItems) => {
    if (!collection) return
    updateCollection({ ...collection, fileSystem: items })
  }

  const [filter, setFilter] = useQueryState('qr')

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
            onClick={toggleExpandAllFolders}
            aria-label={isAnyFolderOpened ? 'collapse all' : 'expand all'}
            title={isAnyFolderOpened ? 'collapse all' : 'expand all'}
            size="icon"
            variant="ghost"
            className="rounded-none flex-shrink-0"
          >
            {isAnyFolderOpened ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </Button>
          <CollectionOptionsButton />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ScrollArea>
        <div className="h-full max-h-full">
          <SortableTree
            items={collection?.fileSystem ?? []}
            filteredItems={filteredNodes}
            setItems={handleUpdateCollection}
          />
        </div>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}

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

export default RequestCollectionPanel
