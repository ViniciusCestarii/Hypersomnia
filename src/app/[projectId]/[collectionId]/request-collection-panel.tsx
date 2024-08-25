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
import { useState } from 'react'

import { SortableTree } from '@/app/dnd-test/SortableTree'
import useKeyCombination from '@/hooks/useKeyCombination'
import { keyShortcuts } from '@/lib/keyboard-shortcuts'

const RequestCollectionPanel = () => {
  const collection = useHypersomniaStore((state) => state.selectedCollection!)
  const updateCollection = useHypersomniaStore(
    (state) => state.updateCollection,
  )

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
      {/* openFolders={expandAll || (!!filter && filter?.length > 0)} I should update the store */}
      <ScrollArea>
        <div className="h-full max-h-full">
          <SortableTree
            items={filteredNodes}
            setItems={(items) =>
              updateCollection({ ...collection, fileSystem: items })
            }
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
