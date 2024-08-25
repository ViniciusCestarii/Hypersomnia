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
  PointerSensor,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useMemo, useRef, useState } from 'react'

import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { SortableTreeItem } from './(components)/SortableTreeItem,'
import type { FlattenedItem, SensorContext, TreeItems } from './types'
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  setProperty,
  sortableTreeKeyboardCoordinates,
} from './utilities'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
}

interface SortableTreeProps {
  defaultItems?: TreeItems
  indentationWidth?: number
  items: TreeItems
  filteredItems: TreeItems
  setItems: (items: TreeItems) => void
}

export function SortableTree({
  items,
  filteredItems,
  setItems,
  indentationWidth = 20,
}: SortableTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const selectRequest = useHypersomniaStore((state) => state.selectRequest)

  const flattenedItems = useMemo(() => flattenTree(items), [items])
  const filteredFlattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(filteredItems)
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, isOpen, id }) =>
        !isOpen && children?.length ? [...acc, id] : acc,
      [],
    )

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    )
  }, [activeId, filteredItems])

  const projected =
    activeId && overId
      ? getProjection(
          filteredFlattenedItems,
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
  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indentationWidth),
  )
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  )

  const sortedIds = useMemo(
    () => filteredFlattenedItems.map(({ id }) => id),
    [filteredFlattenedItems],
  )
  const activeItem = activeId
    ? filteredFlattenedItems.find(({ id }) => id === activeId)
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
          {filteredFlattenedItems.map((flatenItem) => {
            const { id, name, isOpen, depth, isFolder, path } = flatenItem

            return (
              <SortableTreeItem
                key={id}
                id={id}
                value={name}
                depth={id === activeId && projected ? projected.depth : depth}
                indentationWidth={indentationWidth}
                isFolder={isFolder}
                isOpen={isOpen}
                handleItemAction={
                  isFolder
                    ? () => handleCollapse(id)
                    : () => selectRequest(path)
                }
                path={path}
                node={flatenItem}
              />
            )
          })}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={0}
                clone
                isFolder={activeItem.isFolder}
                isOpen={activeItem.isOpen}
                childCount={getChildCount(items, activeId)}
                value={activeItem.name}
                node={activeItem}
                path={activeItem.path}
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
      const projectedParent = clonedItems.find(({ id }) => id === parentId)

      const canBeParent =
        projectedParent === undefined || !!projectedParent.isFolder

      if (!canBeParent) {
        return
      }

      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
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

    document.body.style.setProperty('cursor', '')
  }

  function handleCollapse(id: string) {
    const updatedItems = setProperty(items, id, 'isOpen', (value) => {
      if (!value === false) {
        return undefined
      }

      return !value
    })
    setItems(updatedItems)
  }
}
