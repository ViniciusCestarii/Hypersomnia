import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { getMethodColor } from '@/lib/utils'
import {
  FileSystemNode as FileSystemNodeType,
  MethodType,
} from '@/types/collection'
import useCollectionStore from '@/zustand/collection-store'
import {
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
} from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

const RequestCollectionPanel = () => {
  const selectedCollection = useCollectionStore(
    (state) => state.selectedCollection,
  )

  const [filter, setFilter] = useQueryState('qr')

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
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
        <span className="font-semibold">{selectedCollection?.title}</span>
      </div>
      <Separator />
      <Label className="sr-only" htmlFor="request-filter">
        Filter
      </Label>
      <Input
        id="request-filter"
        type="search"
        placeholder="Filter"
        value={filter ?? ''}
        onChange={({ target }) =>
          setFilter(target.value.length ? target.value : null)
        }
      />
      <div className="mt-4">
        {selectedCollection?.fileSystem.map((node) => (
          <FileSystemNode key={node.name} node={node} />
        ))}
      </div>
    </div>
  )
}

type FileSystemNodeProps = {
  node: FileSystemNodeType
}

const FileSystemNode = ({ node }: FileSystemNodeProps) => {
  const [isOpen, setIsOpen] = useState(false)

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
              <FileSystemNode key={childNode.name} node={childNode} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (node.request) {
    return (
      <div className="ml-4 flex items-center">
        <RequestBadge method={node.request?.method} />
        <span className="ml-2">{node.name}</span>
      </div>
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

interface RequestBadgeProps {
  method: MethodType
}

const RequestBadge = ({ method }: RequestBadgeProps) => {
  return <span className={getMethodColor(method)}>{method}</span>
}

export default RequestCollectionPanel
