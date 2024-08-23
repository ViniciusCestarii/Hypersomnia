'use client'

import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useMemo, useRef, useState } from 'react'

import { SortableTreeItem } from './(components)/SortableTreeItem,'
import type { FlattenedItem, SensorContext, TreeItems } from './types'
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from './utilities'
import { initialProjects } from '@/zustand/hypersomnia-store'

const initialItems: TreeItems = initialProjects[0].collections[0].fileSystem

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
}

interface Props {
  collapsible?: boolean
  defaultItems?: TreeItems
  indentationWidth?: number
  indicator?: boolean
}

export function SortableTree({
  collapsible,
  defaultItems = initialItems,
  indicator,
  indentationWidth = 20,
}: Props) {
  const [items, setItems] = useState(() => defaultItems)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: string | null
    overId: string
  } | null>(null)

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children?.length ? [...acc, id] : acc,
      [],
    )

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    )
  }, [activeId, items])
  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  })
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  )
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    }
  }, [flattenedItems, offsetLeft])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <ul>
          {flattenedItems.map(({ id, children, name, collapsed, depth }) => (
            <SortableTreeItem
              key={id}
              id={id}
              value={name}
              depth={id === activeId && projected ? projected.depth : depth}
              indentationWidth={indentationWidth}
              indicator={indicator}
              collapsed={Boolean(collapsed && children?.length)}
              onCollapse={
                collapsible && children?.length
                  ? () => handleCollapse(id)
                  : undefined
              }
            />
          ))}
          <DragOverlay
            dropAnimation={dropAnimation}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                collapsed={activeItem.collapsed}
                childCount={getChildCount(items, activeId) + 1}
                value={activeItem.name}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>
        </ul>
      </SortableContext>
    </DndContext>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    const activeIdString = activeId.toString()
    setActiveId(activeIdString)
    setOverId(activeIdString)

    const activeItem = flattenedItems.find(({ id }) => id === activeIdString)

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeIdString,
      })
    }

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ? over.id.toString() : null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items)),
      )
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const overItem = clonedItems[overIndex]
      if (!overItem.isFolder) {
        return
      }
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      setItems(newItems)
    }
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)
    setCurrentPosition(null)

    document.body.style.setProperty('cursor', '')
  }

  function handleRemove(id: string) {
    setItems((items) => removeItem(items, id))
  }

  function handleCollapse(id: string) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value
      }),
    )
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  }
}
