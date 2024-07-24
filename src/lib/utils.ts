import {
  FileSystemNode as FileSystemNodeType,
  MethodType,
} from '@/types/collection'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMethodColor(method: MethodType): string {
  switch (method) {
    case 'GET':
      return 'text-green-500'
    case 'POST':
      return 'text-blue-500'
    case 'PUT':
      return 'text-yellow-500'
    case 'DELETE':
      return 'text-red-500'
    case 'PATCH':
      return 'text-purple-500'
    case 'OPTIONS':
    case 'HEAD':
    case 'CONNECT':
    case 'TRACE':
      return 'text-gray-500'
    default:
      return ''
  }
}

export const filterNodes = (
  nodes: FileSystemNodeType[],
  filter: string,
): FileSystemNodeType[] => {
  if (!filter) return nodes

  const lowercasedFilter = filter.toLowerCase()

  return nodes
    .filter((node) => {
      if (node.isFolder) {
        const filteredChildren = filterNodes(node.children ?? [], filter)
        return filteredChildren.length > 0
      }
      return node.name.toLowerCase().includes(lowercasedFilter)
    })
    .map((node) => ({
      ...node,
      children: node.isFolder
        ? filterNodes(node.children ?? [], filter)
        : node.children,
    }))
}
