import { arrayMove } from '@dnd-kit/sortable'

import type { FlattenedItem, SensorContext, TreeItem, TreeItems } from './types'

import {
  closestCorners,
  DroppableContainer,
  getFirstCollision,
  KeyboardCode,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core'
import { FileSystemNode } from '@/types'

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection(
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function flatten(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0,
  path: string[] = [],
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index, path: [...path, item.id] },
      ...flatten(item.children ?? [], item.id, depth + 1, [...path, item.id]),
    ]
  }, [])
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items)
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = { id: 'root', name: 'root', children: [] }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const itemParentId = item.parentId ?? root.id
    const parent = nodes[itemParentId] ?? findItem(items, itemParentId)

    const { id, children, isFolder, isOpen, request, name } = item

    const itemWithoutSecondaryParameters: FileSystemNode = {
      id,
      name,
      children,
      isFolder,
      isOpen,
      request,
    }

    parent.children!.push(itemWithoutSecondaryParameters)
  }

  return root.children!
}

export function findItem(items: TreeItem[], itemId: string) {
  return items.find(({ id }) => id === itemId)
}

export function findItemDeep(
  items: TreeItems,
  itemId: string,
): TreeItem | undefined {
  for (const item of items) {
    const { id, children } = item

    if (id === itemId) {
      return item
    }

    if (children?.length) {
      const child = findItemDeep(children, itemId)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

export function removeItem(items: TreeItems, id: string) {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item?.children?.length) {
      item.children = removeItem(item.children, id)
    }

    newItems.push(item)
  }

  return newItems
}

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems,
  id: string,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
): TreeItems {
  return items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        [property]: setter(item[property]),
      }
    }

    if (item?.children?.length) {
      return {
        ...item,
        children: setProperty(item.children, id, property, setter),
      }
    }

    return item
  })
}

export function setPropertyForAll<T extends keyof TreeItem>(
  items: TreeItems,
  property: T,
  setter: (value: TreeItem) => TreeItem[T],
): TreeItems {
  return items.map((item) => {
    return {
      ...item,
      children: setPropertyForAll(item.children ?? [], property, setter),
      [property]: setter(item),
    }
  })
}

function countChildren(items: TreeItem[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children?.length) {
      return countChildren(children, acc + 1)
    }

    return acc + 1
  }, count)
}

export function getChildCount(items: TreeItems, id: string) {
  if (!id) {
    return 0
  }

  const item = findItemDeep(items, id)

  return item ? countChildren(item.children ?? []) : 0
}

export function removeChildrenOf(items: FlattenedItem[], ids: string[]) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item?.children?.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
]

const horizontal: string[] = [KeyboardCode.Left, KeyboardCode.Right]

export const sortableTreeKeyboardCoordinates: (
  context: SensorContext,
  indentationWidth: number,
) => KeyboardCoordinateGetter =
  (context, indentationWidth) =>
  (
    event,
    {
      currentCoordinates,
      context: {
        active,
        over,
        collisionRect,
        droppableRects,
        droppableContainers,
      },
    },
  ) => {
    if (directions.includes(event.code)) {
      if (!active || !collisionRect) {
        return
      }

      event.preventDefault()

      const {
        current: { items, offset },
      } = context

      if (horizontal.includes(event.code) && over?.id) {
        const { depth, maxDepth, minDepth } = getProjection(
          items,
          active.id.toString(),
          over.id.toString(),
          offset,
          indentationWidth,
        )

        switch (event.code) {
          case KeyboardCode.Left:
            if (depth > minDepth) {
              return {
                ...currentCoordinates,
                x: currentCoordinates.x - indentationWidth,
              }
            }
            break
          case KeyboardCode.Right:
            if (depth < maxDepth) {
              return {
                ...currentCoordinates,
                x: currentCoordinates.x + indentationWidth,
              }
            }
            break
        }

        return undefined
      }

      const containers: DroppableContainer[] = []

      droppableContainers.forEach((container) => {
        if (container?.disabled || container.id === over?.id) {
          return
        }

        const rect = droppableRects.get(container.id)

        if (!rect) {
          return
        }

        switch (event.code) {
          case KeyboardCode.Down:
            if (collisionRect.top < rect.top) {
              containers.push(container)
            }
            break
          case KeyboardCode.Up:
            if (collisionRect.top > rect.top) {
              containers.push(container)
            }
            break
        }
      })

      const collisions = closestCorners({
        active,
        collisionRect,
        pointerCoordinates: null,
        droppableRects,
        droppableContainers: containers,
      })
      let closestId = getFirstCollision(collisions, 'id')

      if (closestId === over?.id && collisions.length > 1) {
        closestId = collisions[1].id
      }

      if (closestId && over?.id) {
        const activeRect = droppableRects.get(active.id)
        const newRect = droppableRects.get(closestId)
        const newDroppable = droppableContainers.get(closestId)

        if (activeRect && newRect && newDroppable) {
          const newIndex = items.findIndex(({ id }) => id === closestId)
          const newItem = items[newIndex]
          const activeIndex = items.findIndex(({ id }) => id === active.id)
          const activeItem = items[activeIndex]

          if (newItem && activeItem) {
            const { depth } = getProjection(
              items,
              active.id.toString(),
              closestId.toString(),
              (newItem.depth - activeItem.depth) * indentationWidth,
              indentationWidth,
            )
            const isBelow = newIndex > activeIndex
            const modifier = isBelow ? 1 : -1
            const offset = 0

            const newCoordinates = {
              x: newRect.left + depth * indentationWidth,
              y: newRect.top + modifier * offset,
            }

            return newCoordinates
          }
        }
      }
    }

    return undefined
  }
