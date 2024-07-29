import {
  FileSystemNode,
  FileSystemNode as FileSystemNodeType,
  MethodType,
  Request,
} from '@/types/collection'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { html as beautifyHtml } from 'js-beautify'

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

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export const findSystemNodeByPath = (
  fileSystem: FileSystemNode[],
  path: string[],
): FileSystemNode | undefined => {
  const findNode = (
    nodes: FileSystemNode[],
    path: string[],
  ): FileSystemNode | undefined => {
    if (path.length === 0) return undefined

    const [head, ...tail] = path

    for (const node of nodes) {
      if (node.name === head) {
        if (tail.length === 0) return node

        if (node.isFolder && node.children) {
          return findNode(node.children, tail)
        }
      }
    }

    return undefined
  }

  return findNode(fileSystem, path)
}

export const getRequestWithQueryParams = (request: Request): string => {
  if (
    !request.url &&
    request.queryParameters.filter((param) => param.key && param.enabled)
      .length === 0
  )
    return ''
  const params = new URLSearchParams()

  request?.queryParameters?.forEach((param) => {
    if (param.key && param.enabled) {
      params.append(param.key, param.value ?? '')
    }
  })

  const hasProtocol =
    request.url.startsWith('http://') || request.url.startsWith('https://')

  const addInterrogation = request.url.includes('?') ? '&' : '?'

  return `${hasProtocol ? '' : 'http://'}${request.url}${params.size > 0 && request.url.length > 0 ? addInterrogation : ''}${params.toString()}`
}

export const requestMethods: MethodType[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
]

export const httpStatusCodes: { [key: number]: string } = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
}

type GetBodyData = Pick<Request, 'bodyType' | 'bodyContent'>

export const getBodyData = ({ bodyType, bodyContent }: GetBodyData) => {
  if (bodyContent === undefined) return undefined

  if (bodyType === 'json') {
    try {
      return JSON.parse(bodyContent)
    } catch (e) {
      return bodyContent
    }
  }
  return bodyContent
}

interface GenerateEditorDefaultProps {
  theme?: string
}

export const generateEditorDefaultProps = ({
  theme,
}: GenerateEditorDefaultProps) => ({
  theme: theme === 'dark' ? 'vs-dark' : 'light',
  height: '80vh',
  options: {
    minimap: { enabled: false },
    formatOnPaste: true,
    fontSize: 12,
  },
})

export const formatHtmlContent = (content: string, tabSize = 2): string =>
  beautifyHtml(content, { indent_size: tabSize })
