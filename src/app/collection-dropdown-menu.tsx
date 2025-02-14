import {
  Copy,
  Ellipsis,
  FolderInput,
  FolderOutput,
  Pencil,
  Settings,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collection } from '@/types'
import CollectionConfirmDeleteModal from './collection-confirm-delete-modal'
import { useState } from 'react'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { createSlug } from '@/lib/utils'
import RenameCollection from './rename-collection'

interface CollectionDropdownMenuProps {
  collection: Collection
}

export function CollectionDropdownMenu({
  collection,
}: CollectionDropdownMenuProps) {
  const collections = useHypersomniaStore((state) => state.collections)
  const createCollection = useHypersomniaStore(
    (state) => state.createCollection,
  )
  const [deleteCollectionOpen, setDeleteCollectionOpen] = useState(false)
  const [renameCollectionOpen, setRenameCollectionOpen] = useState(false)

  const handleDuplicate = () => {
    let collectionTitle = `${collection.title} (Copy)`
    let count = 1

    while (collections.some((c) => c.title === collectionTitle)) {
      collectionTitle = `${collection.title} (Copy) ${count}`
      count++
    }

    const collectionCopy: Collection = JSON.parse(JSON.stringify(collection))

    createCollection({
      ...collectionCopy,
      id: createSlug(collectionTitle),
      title: collectionTitle,
    })
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(collection, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${collection.id}-collection.json`
    link.click()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="more options"
            title="more options"
            size="icon"
            variant="ghost"
            className="p-1 absolute top-4 right-4"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setRenameCollectionOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FolderInput className="mr-2 h-4 w-4" />
              <span>Import</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <FolderOutput className="mr-2 h-4 w-4" />
              <span>Export</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteCollectionOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameCollection
        open={renameCollectionOpen}
        onOpenChange={setRenameCollectionOpen}
        collection={collection}
      />
      <CollectionConfirmDeleteModal
        collection={collection}
        onOpenChange={setDeleteCollectionOpen}
        open={deleteCollectionOpen}
      />
    </>
  )
}
