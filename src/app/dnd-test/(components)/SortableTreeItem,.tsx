import React, { CSSProperties } from 'react'
import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { TreeItemProps, TreeItem } from './TreeItem'

interface SortableTreeItemProps extends TreeItemProps {
  id: string
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => !(isSorting || wasDragging)

export function SortableTreeItem({
  id,
  depth,
  handleProps,
  ...props
}: SortableTreeItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={style}
      depth={depth}
      ghost={isDragging}
      {...props}
      handleProps={{
        ...handleProps,
        ...attributes,
        ...listeners,
      }}
    />
  )
}
