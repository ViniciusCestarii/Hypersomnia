import { FileSystemNode } from '@/types'
import type { MutableRefObject } from 'react'

export type TreeItem = FileSystemNode

export type TreeItems = FileSystemNode[]

export interface FlattenedItem extends FileSystemNode {
  parentId: null | string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
