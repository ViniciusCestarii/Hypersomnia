import {
  FileSystemNode,
  FileSystemNode as FileSystemNodeType,
  MethodType,
  Request,
} from '@/types/collection'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMethodColor(method: MethodType): string {
  switch (method) {
    case 'get':
      return 'text-green-500'
    case 'post':
      return 'text-blue-500'
    case 'put':
      return 'text-yellow-500'
    case 'delete':
      return 'text-red-500'
    case 'patch':
      return 'text-purple-500'
    case 'options':
    case 'head':
    case 'connect':
    case 'trace':
      return 'text-gray-500'
    default:
      return ''
  }
}

export function getStatusColor(status: number): string {
  if (status < 200) return 'text-gray-500'
  if (status < 300) return 'text-green-500'
  if (status < 400) return 'text-blue-500'
  if (status < 500) return 'text-yellow-500'
  return 'text-red-500'
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

type FindResult = {
  node: FileSystemNodeType | null
  path: string[]
}

export const findFirstRequestNode = (
  nodes: FileSystemNodeType[],
  currentPath: string[] = [],
): FindResult => {
  for (const node of nodes) {
    if (node.isFolder) {
      const result = findFirstRequestNode(node.children ?? [], [
        ...currentPath,
        node.name,
      ])
      if (result.node) return result
    }
    if (node.request) return { node, path: [...currentPath, node.name] }
  }
  return { node: null, path: [] }
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const findFileByPath = (
  nodes: FileSystemNodeType[],
  path: string[],
): FileSystemNodeType | null => {
  let currentNodes = nodes

  for (const segment of path) {
    const foundNode = currentNodes.find((node) => node.name === segment)
    if (!foundNode) return null

    if (foundNode.isFolder) {
      currentNodes = foundNode.children ?? []
    } else if (segment === path[path.length - 1]) {
      return foundNode
    } else {
      return null
    }
  }

  return null
}

export const updateRequestInFileSystem = (
  fileSystem: FileSystemNode[],
  path: string[],
  updatedRequest: Request,
): FileSystemNode[] => {
  if (path.length === 0) return fileSystem

  const [head, ...tail] = path

  return fileSystem.map((node) => {
    if (node.name === head) {
      if (tail.length === 0 && node.request) {
        return { ...node, request: updatedRequest }
      } else if (node.isFolder && node.children) {
        return {
          ...node,
          children: updateRequestInFileSystem(
            node.children,
            tail,
            updatedRequest,
          ),
        }
      }
    }
    return node
  })
}

export const getRequestWithQueryParams = (request: Request): string => {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)

  request?.queryParameters?.forEach((param) => {
    if (param.key && param.enabled) {
      params.append(param.key, param.value ?? '')
    }
  })

  return `${url.origin}${url.pathname}${params.size > 0 ? '?' + params.toString() : ''}`
}
