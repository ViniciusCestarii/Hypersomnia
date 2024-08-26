import {
  cn,
  createNewFolder,
  createNewRequest,
  duplicateFile,
} from '@/lib/utils'
import React, { forwardRef, HTMLAttributes, useRef, useState } from 'react'
import { Handle } from './Handle'

import RequestMethodBadge from '@/components/ui/panel/request-method-badge'

import {
  FileSystemNodeRequest,
  FileSystemNode as FileSystemNodeType,
} from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import {
  AlertCircle,
  ArrowUpDown,
  ChevronRight,
  Folder,
  Layers2,
  Pencil,
  Terminal,
  Trash,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { copyRequestAsCurl } from '@/lib/export'

export interface TreeItemProps extends HTMLAttributes<HTMLLIElement> {
  childCount?: number
  clone?: boolean
  isOpen?: boolean
  depth: number
  ghost?: boolean
  isHighlighted?: boolean
  handleProps?: any
  indicator?: boolean
  indentationWidth: number
  value: string
  handleItemAction?: () => void
  node: FileSystemNodeType
  path: string[]
  isFolder?: boolean
  wrapperRef?(node: HTMLLIElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (props, ref) => {
    const { node } = props

    if (node.isFolder) {
      return <FolderItem ref={ref} {...props} />
    }

    if (typeof node.request !== 'undefined') {
      return (
        <RequestItem
          ref={ref}
          {...props}
          node={{ ...node, request: node.request }}
        />
      )
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>This node is invalid</AlertDescription>
      </Alert>
    )
  },
)

TreeItem.displayName = 'TreeItem'

interface RequestItemProps extends TreeItemProps {
  node: FileSystemNodeRequest
}

export const RequestItem = forwardRef<HTMLDivElement, RequestItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      ghost,
      isHighlighted,
      handleProps,
      indentationWidth,
      style,
      value,
      isOpen,
      wrapperRef,
      handleItemAction,
      node,
      path,
      ...props
    },
    ref,
  ) => {
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

    return (
      <RequestContextMenu
        node={node}
        path={path}
        enterEditMode={enterEditMode}
        isEditing={isEditing}
        focusInput={focusInput}
      >
        <li
          ref={wrapperRef}
          style={{
            paddingLeft: `${indentationWidth * depth - Number(isHighlighted) + 1}px`,
          }}
          {...props}
          className={cn(
            props.className,
            'hover:bg-muted/80',
            isHighlighted &&
              'bg-primary/[0.06] dark:bg-primary/[0.12] border-l border-primary',
            ghost && 'opacity-50',
          )}
        >
          <div ref={ref} style={style} className="flex">
            <Handle {...handleProps} cursor={clone ? 'grabbing' : 'grab'} />
            <button
              className="flex items-center cursor-pointer transition-colors w-full gap-1"
              onClick={handleItemAction}
            >
              <RequestMethodBadge method={node.request.options.method} />
              <EditableTitle
                ref={inputRef}
                isEditing={isEditing}
                value={value}
                id={`edit-request-${node.id}`}
                onChange={(value) => updateFile(path, { ...node, name: value })}
                onBlur={exitEditMode}
              />
            </button>
          </div>
        </li>
      </RequestContextMenu>
    )
  },
)

RequestItem.displayName = 'RequestItem'

export const FolderItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      ghost,
      handleProps,
      indentationWidth,
      isOpen,
      isHighlighted,
      style,
      value,
      wrapperRef,
      handleItemAction,
      node,
      path,
      ...props
    },
    ref,
  ) => {
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

    return (
      <FolderContextMenu
        node={node}
        path={path}
        enterEditMode={enterEditMode}
        isEditing={isEditing}
        focusInput={focusInput}
      >
        <li
          ref={wrapperRef}
          style={{
            paddingLeft: `${indentationWidth * depth}px`,
          }}
          {...props}
          className={cn(
            props.className,
            'hover:bg-muted/80',
            ghost && 'opacity-50',
          )}
        >
          <div ref={ref} style={style} className="flex hover:bg-muted/80">
            <Handle {...handleProps} cursor={clone ? 'grabbing' : 'grab'} />
            <button
              className="flex items-center cursor-pointer transition-colors w-full gap-1"
              onClick={handleItemAction}
            >
              <ChevronRight
                size={16}
                className={cn('flex-shrink-0', isOpen && 'rotate-90')}
              />
              <Folder size={16} className="flex-shrink-0" />
              <span className="relative">
                <EditableTitle
                  ref={inputRef}
                  isEditing={isEditing}
                  value={value}
                  id={`edit-folder-${node.id}`}
                  onChange={(value) =>
                    updateFile(path, { ...node, name: value })
                  }
                  onBlur={exitEditMode}
                />
                {clone && (
                  <span className="absolute -top-3 -right-8 rounded-full border-2 w-6 text-sm flex items-center justify-center aspect-square">
                    {childCount}
                  </span>
                )}
              </span>
            </button>
          </div>
        </li>
      </FolderContextMenu>
    )
  },
)

FolderItem.displayName = 'FolderItem'

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
      <span className={cn('text-nowrap', isEditing && 'hidden')}>{value}</span>
    )
  },
)

EditableTitle.displayName = 'EditableTitle'

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
    copyRequestAsCurl(node.request)
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
